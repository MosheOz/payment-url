const express = require("express");
const cors = require("cors");
const querystring = require("querystring");
const axios = require("axios");

const { defineVarsArr, defineVarInvoice } = require("./vars.helper");
const app = express();
const PORT = 3000;

const CreateInvoice = true; // to Create Invoice (Need permissions to create invoice )
const IsIframe = true; // Iframe or Redirect
let LOW_PROFILE_CODE = "";

// Create Post Information
// Account vars
let vars = [];

app.use(cors());
app.use(express.json());
app.set("views", "./views");
app.set("view engine", "ejs");



app.get("/", (req, res) => {
  res.render("index");
});

app.use("/payment-token", require('./routes').token);

// regular payment - cc charge
app.post("/payment", async (req, res) => {
  vars = defineVarsArr();
  if (CreateInvoice) {
    vars = defineVarInvoice();
  }

  const str = querystring.encode(vars);
  console.log(vars);

  try {
    const response = await axios.post(
      "https://secure.cardcom.solutions/Interface/LowProfile.aspx",
      str
    );

    const obj = querystring.decode(response.data);

    if (obj.ResponseCode == "0") {
      LOW_PROFILE_CODE = obj.LowProfileCode; // save low profile code from response.
      // console.log(obj.PayPalUrl);
      if (IsIframe) {
        console.log(obj.url);
        // res.redirect(obj.url);
        res.render("iframe", { data: obj.url });
        return;
      } // redirect
      else {
        res.redirect(obj.url);
      }
    } else {
      console.error(response);
      res.status(500).json({ error: response });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

// token charge

//success page
app.get("/success-page", (req, res) => {
  res.render("success");
});

// Indicator URL
app.get("/NotifyURL", async (req, res) => {
  try {
    const isDeal = await getDealIndication();
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
  config["username"] = "barak9611";
  config["lowprofilecode"] = "2e4346ba-e521-4d87-95cd-cf160c39dbc9";
  const str = querystring.encode(config);
  const response = await axios.get(url + str);
  const obj = querystring.decode(response.data);
  return obj;
}

app.listen(PORT, console.log("App is running on ", PORT));
