const nunjucks = require("nunjucks");

function setupNunjucks(app) {
  nunjucks.configure("views", {
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
