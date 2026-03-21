const express = require("express");
const morgan = require("morgan");

const app = express();

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: `10kb` }));

app.use("/", (req, res, next) => {
  res.send("Hello from server");
});

module.exports = app;
