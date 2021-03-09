const express = require("express");
const cors = require("cors");

const router = express.Router();

router.get('/', (req, res) => {
  res.render("index");
})
router.get('/payment', (req, res) => {
  res.json({test: "test"});
})
router.post('/payment', (req, res) => {
  res.json({test: "test"});
})
module.exports = router;
