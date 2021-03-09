const express = require("express");
const cors = require("cors");
const querystring = require("querystring");
const axios = require("axios");
const routes = require('./routes')
const { defineVarsArr, defineVarInvoice } = require("./vars.helper");

const app = express();
const PORT = process.env.PORT || 3000;

// const TerminalNumber = 1000; // Company terminal
// const UserName = "barak9611"; // API User
// const CreateInvoice = true; // to Create Invoice (Need permissions to create invoice )
// const IsIframe = true; // Iframe or Redirect
// const Operation = 4;

// Create Post Information
// Account vars
// const vars = [];
// vars["TerminalNumber"] = TerminalNumber;
// vars["UserName"] = UserName;
// vars["APILevel"] = "10"; // req
// vars["codepage"] = "65001"; // unicode
// vars["Operation"] = Operation;

// vars["Language"] = "en"; // page languge he- hebrew , en - english , ru , ar
// vars["CoinID"] = "1"; // billing coin , 1- NIS , 2- USD other , article :  http://kb.cardcom.co.il/article/AA-00247/0
// vars["SumToBill"] = "79.4"; // Sum To Bill
// vars["ProductName"] = "Test Product"; // Product Name , will how if no invoice will be created.

// vars["SuccessRedirectUrl"] =
//   "https://secure.cardcom.solutions/DealWasSuccessful.aspx"; // Success Page
// vars["ErrorRedirectUrl"] =
//   "https://secure.cardcom.solutions/DealWasUnSuccessful.aspx?customVar=1234"; // Error Page

// Other Optional vars :

// vars["CancelType"] = "2"; // show Cancel button on start ,
// vars["CancelUrl"] ="https://payment-cardcom.herokuapp.com/";
// //vars["IndicatorUrl"] = "http://www.yoursite.com/NotifyURL"; // Indicator Url \ Notify URL . after use -  http://kb.cardcom.co.il/article/AA-00240/0

// vars["ReturnValue"] = "1234"; // Optional , ,recommended , value that will be return and save in CardCom system
// vars["MaxNumOfPayments"] = "12"; // max num of payments to show  to the user

// vars["ShowInvoiceHead"] = "true"; //  if show & edit Invoice Details on the page.
// vars["InvoiceHeadOperation"] = "1";

app.use(cors());
app.use(express.json());
app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/payment", require('./routes').payment);

app.use('/', require('./routes').init)

app.listen(PORT, console.log("App is running on ", PORT));
