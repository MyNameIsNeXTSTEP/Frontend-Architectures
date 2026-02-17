const express = require("express");
const path = require("path");

const app = express();
const PORT = 3004;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", {
    title: "SSR Example",
    message: "This page is rendered on the server.",
    items: ["Fast first paint", "SEO friendly output", "Simple data hydration path"]
  });
});

app.listen(PORT, () => {
  console.log(`SSR example is running: http://localhost:${PORT}`);
});
