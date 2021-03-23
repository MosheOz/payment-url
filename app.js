if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const querystring = require("querystring");
const axios = require("axios");
const fs = require("fs");

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
app.use("/cancel-hold-deal", require("./routes").cancelHoldDeal);

// refund token
app.use("/refund-token", require("./routes").refundToken);

// refund cc charge
app.use("/cancel-deal", require("./routes").cancelDeal);

app.get("/", (req, res) => {
  res.render("index");
});

//success page
app.get("/success-page", (req, res) => {
  console.log(req.body);
  res.render("success");
});

// Indicator URL
app.get("/NotifyURL/:lowProfileCode?", async (req, res) => {
  try {
    const isDeal = await getDealIndication();
    console.log("notify ==> ", isDeal);
    // check deal details and validate success
    // TO DO store this data in DB
    if (isDeal.ResponseCode == 0 && isDeal.lowprofilecode) {
      res.json(isDeal);
    }
  } catch (err) {
    console.error(err);
    res.json(false);
  }
});

app.get('/download', function(req, res){
  const file = `${__dirname}/test.bin`;
  res.download(file); // Set disposition and send it.
});

async function getDealIndication() {
  try {
    const data = fs.readFileSync("low-profile-code.txt", "utf8");
    const url = `https://secure.cardcom.solutions/Interface/BillGoldGetLowProfileIndicator.aspx?`;
    let config = [];
    config["terminalnumber"] = process.env.TERMINAL_NUMBER;
    config["username"] = process.env.USER_NAME;
    config["lowprofilecode"] = JSON.parse(data).LowProfileCode;
    const str = querystring.encode(config);
    const response = await axios.get(url + str);
    const obj = querystring.decode(response.data);
    console.log(obj)
    return obj;
  } catch (err) {
    console.error(err);
  }
}

app.listen(PORT, console.log("App is running on ", PORT));

const {
  InstitutionSendPayment,
  SendPaymentsRecord,
  MasaVSendPayments,
} = require("masav");

let masavFile = new MasaVSendPayments();
let institution = new InstitutionSendPayment(
  "12345678",
  "12345",
  "201005",
  "201005",
  "שלום",
  "001"
);
institution.addPaymentRecords([
  new SendPaymentsRecord(
    "01",
    "123",
    "123456789",
    "000000018",
    "שלום",
    "000001234",
    12
  ),
  new SendPaymentsRecord(
    "09",
    "222",
    "654321",
    "000000018",
    "שלום",
    "000001234",
    100.12
  ),
]);
masavFile.addInstitution(institution);
masavFile.saveFile("test.bin");
