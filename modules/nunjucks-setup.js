const nunjucks = require("nunjucks");

function setupNunjucks(path, app) {
  nunjucks.configure(path + "/public/views", {
    autoescape: true,
    express: app,
    tags: {
      blockStart: "[%",
      blockEnd: "%]",
      variableStart: "[[",
      variableEnd: "]]",
      commentStart: "[#",
      commentEnd: "#]",
    },
  });

  app.set("view engine", "njk");
}

module.exports = { setupNunjucks };
