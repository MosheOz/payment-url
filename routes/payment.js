const router = require("express").Router();
const fs = require('fs');

const querystring = require("querystring");
const axios = require("axios");

let LOW_PROFILE_CODE = "";

router.get("/", async (req, res) => {
  // Create Post Information
  // Account vars
  let vars = [];
  vars["TerminalNumber"] = process.env.TERMINAL_NUMBER; // Company terminal
  vars["UserName"] = process.env.USER_NAME; // API User
  vars["APILevel"] = process.env.API_LEVEL; // level of cardcome API
  vars["codepage"] = process.env.UNICODE; // unicode

  const body = {
    SumToBill: 78,
    coinID: 1,
    NumOfPayments: 1,
    IsAutoRecurringPayment: false,
    IsIframe: true,
    CreateInvoice: true, // to Create Invoice (Need permissions to create invoice )
    Operation: 1,
    pageLanguage: "he",
    MaxNumOfPayments: 12,
    MinNumOfPayments: 1,
    HideCreditCardUserId: false,
    userId: 1,
    userName: "Moshe",
    CardOwnerPhone: "058000000",
    CardOwnerEmail: "test@test.com",
    invoice: {
      CustName: "customr Name",
      CustAddresLine1: "",
      CustAddresLine2: "",
      CustCity: "Jerusalem",
      CustLinePH: "039619611",
      CustMobilePH: "0540000000",
      Language: "he",
      Email: "yaniv@SomeEmail.com",
      SendByEmail: true,
      items: [
        {
          Description: "Apples",
          Price: "12",
          Quantity: "2",
        },
        {
          Description: "Orange",
          Price: "7",
          Quantity: "3",
        },
        {
          Description: "Tomato",
          Price: "3",
          Quantity: "5",
        },
        {
          Description: "Cucumber",
          Price: "6",
          Quantity: "1",
        },
        {
          Description: "Guava",
          Price: "4",
          Quantity: "3",
        },
      ],
    },
  };

  vars["Operation"] = body.Operation; // operation: 1- only charge, 2-charge and token creation, 3-token creation, 4-HOLD charge

  if (body.Operation === 2 || body.Operation === 3) { // check if it's create token req
    vars["CreateTokenJValidateType"] = 5;
  }

  if (body.Operation === 1) { // check if it's a HOLD deal
  vars["SuspendedDealJValidateType"] = 2;
  vars["SuspendedDealGroup"] = 0;
  }
  vars["Language"] = body.pageLanguage; // page languge he- hebrew , en - english , ru , ar
  vars["CoinID"] = body.coinID; // billing coin , 1- NIS , 2- USD other , article :  http://kb.cardcom.co.il/article/AA-00247/0
  
  // Other Optional vars :
  
  vars["SumToBill"] = body.SumToBill; // Sum To Bill
  vars["ProductName"] = "Your Cart Details"; // Product Name , will how if no invoice will be created.
  vars["HideCVV"] = false; // Product Name , will how if no invoice will be created.
  
  vars["IndicatorUrl"] = `${process.env.BASE_URL}/NotifyURL/${LOW_PROFILE_CODE}`; // Indicator Url \ Notify URL . after use -  http://kb.cardcom.co.il/article/AA-00240/0
  vars["SuccessRedirectUrl"] = `${process.env.BASE_URL}/success-page/${LOW_PROFILE_CODE}`; // Success Page
  vars["ErrorRedirectUrl"] =
  "https://secure.cardcom.solutions/DealWasUnSuccessful.aspx?customVar=1234"; // Error Page
  vars["CancelType"] = "2"; // show Cancel button on start; 0-not show, 1-show demo button, 2-show and get back to the cancel url
  vars["CancelUrl"] = `${process.env.BASE_URL}`;
  
  vars["ReturnValue"] =
  new Date().getTime() + Math.floor(Math.random() * 1000000); // Optional , ,recommended , value that will be return and save in CardCom system
  vars["MaxNumOfPayments"] = body.MaxNumOfPayments; // max num of payments to show  to the user
  vars["MinNumOfPayments"] = body.MinNumOfPayments; // min num of payments to show  to the user
  vars["HideCreditCardUserId"] = body.HideCreditCardUserId; // min num of payments to show  to the user
  
  vars["CardOwnerName"] = body.userName;
  vars["HideCardOwnerName"] = false;
  vars["CardOwnerPhone"] = body.CardOwnerPhone;
  vars["ShowCardOwnerPhone"] = true;
  vars["ReqCardOwnerPhone "] = true;
  vars["CardOwnerEmail "] = body.CardOwnerEmail;
  vars["ShowCardOwnerEmail"] = true;
  vars["ReqCardOwnerEmail"] = true;
  
  // vars["SapakMutav"] = "1234";
  
  if (body.CreateInvoice && body.Operation !== 3) {
    vars["ShowInvoiceHead"] = "true"; //  if show & edit Invoice Details on the page.
    vars["InvoiceHeadOperation"] = "1";
    vars["IsCreateInvoice"] = "true";
    // customer info :
    vars["InvoiceHead.CustName"] = "Moshe"; // customer name
    vars["InvoiceHead.SendByEmail"] = "true"; // will the invoice be send by email to the customer
    vars["InvoiceHead.Language"] = body.invoice.Language; // he or en only
    vars["InvoiceHead.Email"] = "test@gmail.com";
    
    // products info for invoice
    body.invoice.items.forEach((data, index) => {
      vars[`InvoiceLines${index + 1}.Description`] = data.Description;
      vars[`InvoiceLines${index + 1}.Price`] = data.Price;
      vars[`InvoiceLines${index + 1}.Quantity`] = data.Quantity;
    });
  }
  
  const str = querystring.encode(vars);
  
  try {
    const response = await axios.post(
      "https://secure.cardcom.solutions/Interface/LowProfile.aspx",
      str
      );
      
      const obj = querystring.decode(response.data);
      console.log(obj);
      if (obj.ResponseCode == "0") {
        LOW_PROFILE_CODE = obj.LowProfileCode; // save low profile code from response.
        fs.writeFileSync('low-profile-code.txt', JSON.stringify(obj));
        
        if (body.IsIframe) {
          // res.render("iframe", { data: obj.url });
          res.status(200).json(obj)
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

module.exports = router;
