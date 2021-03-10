if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const querystring = require("querystring");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.set("views", "./views");
app.set("view engine", "ejs");

// token payment - token charge
app.use("/charge-token", require("./routes").chargeToken);

// regular payment - cc charge
app.use("/payment", require("./routes").payment);

// charge-hold-deal
app.use("/charge-hold-deal", require("./routes").chargeHoldDeal);

// cancel hold deal / refund hold deal
app.use("/cancel-hold-deal", require("./routes").chargeHoldDeal);

// refund token
app.use("/refund-token", require("./routes").refundToken);

// refund cc charge
app.use("/cancel-deal", require("./routes").cancelDeal);

app.get("/", (req, res) => {
  res.render("index");
});

//success page
app.get("/success-page", (req, res) => {
  res.render("success");
});

// Indicator URL
app.get("/NotifyURL", async (req, res) => {
  try {
    const isDeal = await getDealIndication();
    console.log(isDeal);
    if (isDeal.ResponseCode == 0 && isDeal.lowprofilecode) {
      res.json(isDeal);
    }
  } catch (err) {
    console.error(err);
    res.json(false);
  }
});

async function getDealIndication() {
  const url = `https://secure.cardcom.solutions/Interface/BillGoldGetLowProfileIndicator.aspx?`;
  let config = [];
  config["terminalnumber"] = 1000;
  config["username"] = process.env.USER_NAME;
  config["lowprofilecode"] = "2e4346ba-e521-4d87-95cd-cf160c39dbc9";
  const str = querystring.encode(config);
  const response = await axios.get(url + str);
  const obj = querystring.decode(response.data);
  return obj;
}

app.listen(PORT, console.log("App is running on ", PORT));
