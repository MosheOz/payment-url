const express = require("express");
const cors = require("cors");

const app = express();

app.get('/', (req, res) => {
  res.render("index");
})

module.exports = app;
