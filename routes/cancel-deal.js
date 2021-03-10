const router = require("express").Router();

const querystring = require("querystring");
const axios = require("axios");

const url = "https://secure.cardcom.co.il/Interface/CancelDeal.aspx";

router.get("/", async (req, res) => {
  let vars = [];
  const TerminalNumber = 1000;
  const userName = "barak9611";
  const userpassword = "c1234567!";
  const internalDealNumber = "83678740";

  //optinal
  const PartialSum = 1.1;
  const CancelOnly = true; //Only cancel in case the card not yet charged
  console.log(
    `${url}?name=${userName}&pass=${userpassword}&terminalNumber=${TerminalNumber}&internalDealNumber=${internalDealNumber}`
  );
  try {
    const response = await axios.get(
      `https://secure.cardcom.co.il/Interface/CancelDeal.aspx?name=${userName}&pass=${userpassword}&terminalNumber=${TerminalNumber}&internalDealNumber=${internalDealNumber}`
    );
    const responseData = querystring.decode(response.data);
    
    if (responseData.ResponseCode && responseData.ResponseCode == "0") {
      // chack if InvoiceResponse_ResponseCode == 0 to see if invoice is ok
      // Save Invoice number and Type to DB :
      res.status(200).json({
        ResponseCode: responseData.ResponseCode,
        InternalDealNumber: responseData.InternalDealNumber,
      });
    } else {
      res.status(500).json({
        "Error Code": responseData.ResponseCode,
        Description: responseData.Description,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
