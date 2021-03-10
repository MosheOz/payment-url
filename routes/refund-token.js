const router = require("express").Router();

const querystring = require("querystring");
const axios = require("axios");

//create token

// router.post(() => {})

// charge token
router.get("/", async (req, res) => {
  let vars = [];
  vars["TerminalNumber"] = "1000";
  vars["UserName"] = process.env.USER_NAME;
  vars["TokenToCharge.RefundInsteadOfCharge"] = true; //// =====> for refund!!
  vars["TokenToCharge.UserPassword"] = process.env.PASSWORD; //// =====> for refund!!
  vars["TokenToCharge.APILevel"] = "9";
  vars["TokenToCharge.Token"] = "4cf8e168-261e-4613-8d20-000332986b24";
  vars["TokenToCharge.Salt"] = "12421"; //User ID or a Cost var.
  vars["TokenToCharge.CardValidityMonth"] = "09";
  vars["TokenToCharge.CardValidityYear"] = "19";
  vars["TokenToCharge.SumToBill"] = "250.50";
  vars["TokenToCharge.CoinID"] = "1";
  vars["TokenToCharge.NumOfPayments"] = "1";
  vars["CustomeFields.Field1"] = "Custom e Comments 1 ";
  vars["CustomeFields.Field2"] = "Custom e Comments 2";
  vars["codepage"] = "65001"; //UNICODE
  // invoice Option - optinal
  vars["InvoiceHead.CustName"] = "customr Name";
  vars["InvoiceHead.CustAddresLine1"] = "address line 1";
  vars["InvoiceHead.CustAddresLine2"] = "address line 2";
  vars["InvoiceHead.CustCity"] = "state";
  vars["InvoiceHead.CustLinePH"] = "039619611";
  vars["InvoiceHead.CustMobilePH"] = "0540000000";
  vars["InvoiceHead.Language"] = "he";
  vars["InvoiceHead.Email"] = "yaniv@SomeEmail.com";
  vars["InvoiceHead.SendByEmail"] = "True";
  vars["InvoiceLines.Description"] = "Item Line 1";
  vars["InvoiceLines.Price"] = "200";
  vars["InvoiceLines.IsPriceIncludeVAT"] = "true";
  vars["InvoiceLines1.Quantity"] = "1";
  vars["InvoiceLines1.Description"] = "Item Line 2";
  vars["InvoiceLines1.Price"] = "50.5";
  vars["InvoiceLines1.IsPriceIncludeVAT"] = "true";
  vars["InvoiceLines1.Quantity"] = "1";

  const str = querystring.encode(vars);

  try {
    const response = await axios.post(
      "https://secure.cardcom.solutions/Interface/ChargeToken.aspx",
      str
    );

    //ResponseCode={0}&Description={1}&InternalDealNumber={2}&InvoiceResponse.ResponseCode={3}&InvoiceResponse.Description={4}&InvoiceResponse.InvoiceNumber={5}&InvoiceResponse.InvoiceType={6}
    const obj = querystring.decode(response.data);

    if (obj.ResponseCode && obj.ResponseCode == "0") {
      // chack if InvoiceResponse_ResponseCode == 0 to see if invoice is ok
      // Save Invoice number and Type to DB :
      res.status(200).json({ InternalDealNumber: obj.InternalDealNumber });
    } else {
      res
        .status(500)
        .json({ "Error Code": obj.ResponseCode, Description: obj.Description });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
