const express = require("express");
const cors = require("cors");

const router = express.Router();

router.get('/', (req, res) => {
  res.render("index");
})

module.exports = router;
