/*global UIkit, Vue, Pusher, */

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;

(() => {
  const createPusher = (context, connectionCallback) => {
    const pusher = new Pusher("c2b8efa8df3788ccdb62", {
      cluster: "eu",
    });

    context.channel = pusher.subscribe(window.user);

    pusher.connection.bind("connected", () => {
      context.channel.bind("message", ({ message }) => {
        let data = null;

        try {
          data = JSON.parse(message);
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

      connectionCallback();
    });
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
      async fetchActiveTimers() {
        if (!this.channel) return console.log("Pusher channel not set");
        fetchJson("/api/timers/trigger", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "ACTIVE_TIMERS",
            channel: window.user,
          }),
        });
      },
      fetchOldTimers() {
        if (!this.channel) return console.log("Pusher channel not set");
        fetchJson("/api/timers/trigger", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "OLD_TIMERS",
            channel: window.user,
          }),
        });
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
      createPusher(this, () => {
        this.fetchActiveTimers();
        setInterval(() => {
          this.fetchActiveTimers();
        }, 1000);
        this.fetchOldTimers();
      });
    },
  });
})();
