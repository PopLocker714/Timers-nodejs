/*global UIkit, Vue */

(() => {
  const createWs = (context) => {
    const wsProto = location.protocol === "http:" ? "ws:" : "wss:";
    const ws = new WebSocket(`${wsProto}//${location.host}`);

    /* ws.addEventListener("open", () => {
      console.log("WebSocket connection established");
    }); */

    ws.addEventListener("message", (event) => {
      let data = null;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        console.error(error);
        return;
      }

      if (data.type === "OLD_TIMERS") {
        context.oldTimers = data.timers;
      }

      if (data.type === "ACTIVE_TIMERS") {
        context.activeTimers = data.timers;
      }
    });

    ws.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    return ws;
  };

  const notification = (config) =>
    UIkit.notification({
      pos: "top-right",
      timeout: 5000,
      ...config,
    });

  const alert = (message) =>
    notification({
      message,
      status: "danger",
    });

  const info = (message) =>
    notification({
      message,
      status: "success",
    });

  const fetchJson = (...args) =>
    fetch(...args)
      .then((res) =>
        res.ok
          ? res.status !== 204
            ? res.json()
            : null
          : res.text().then((text) => {
              throw new Error(text);
            })
      )
      .catch((err) => {
        alert(err.message);
      });

  new Vue({
    el: "#app",
    data: {
      desc: "",
      activeTimers: [],
      oldTimers: [],
    },
    methods: {
      fetchActiveTimers() {
        if (!this.ws) return console.log("no ws");
        this.ws.send(JSON.stringify({ type: "ACTIVE_TIMERS" }));
        /* fetchJson("/api/timers?isActive=true").then((activeTimers) => {
          this.activeTimers = activeTimers;
        }); */
      },
      fetchOldTimers() {
        if (!this.ws) return console.log("no ws");
        this.ws.send(JSON.stringify({ type: "OLD_TIMERS" }));
        /* fetchJson("/api/timers?isActive=false").then((oldTimers) => {
          this.oldTimers = oldTimers;
        }); */
      },
      createTimer() {
        const description = this.desc;
        this.desc = "";
        fetchJson("/api/timers", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description }),
        }).then(({ id }) => {
          info(`Created new timer "${description}" [${id}]`);
          this.fetchActiveTimers();
        });
      },
      stopTimer(id) {
        fetchJson(`/api/timers/${id}/stop`, {
          method: "post",
        }).then(() => {
          info(`Stopped the timer [${id}]`);
          this.fetchActiveTimers();
          this.fetchOldTimers();
        });
      },
      formatTime(ts) {
        return new Date(ts).toTimeString().split(" ")[0];
      },
      formatDuration(d) {
        d = Math.floor(d / 1000);
        const s = d % 60;
        d = Math.floor(d / 60);
        const m = d % 60;
        const h = Math.floor(d / 60);
        return [h > 0 ? h : null, m, s]
          .filter((x) => x !== null)
          .map((x) => (x < 10 ? "0" : "") + x)
          .join(":");
      },
    },
    created() {
      let isOpen = false;
      this.ws = createWs(this);
      this.ws.addEventListener("open", () => {
        isOpen = true;
      });

      const interval = setInterval(() => {
        if (isOpen) {
          this.fetchActiveTimers();
          setInterval(() => {
            this.fetchActiveTimers();
          }, 1000);
          this.fetchOldTimers();
          clearInterval(interval);
        }
      }, 200);
    },
  });
})();
