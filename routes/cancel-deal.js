const router = require("express").Router();

const querystring = require("querystring");
const axios = require("axios");

const url = "https://secure.cardcom.co.il/Interface/CancelDeal.aspx";

router.get("/:internalDealNumber/:CancelOnly?/:PartialSum?", async (req, res) => {
  console.log('im here ==> ')
  let vars = [];
  const TerminalNumber = process.env.TERMINAL_NUMBER;
  const userName = process.env.USER_NAME;
  const userpassword = process.env.PASSWORD;
  const internalDealNumber = req.params.internalDealNumber || "84558494";

  //optinal
  const PartialSum = req.params.PartialSum || false;
  const CancelOnly = req.params.CancelOnly || false; //Only cancel in case the card not yet charged
  let params = `?name=${userName}&pass=${userpassword}&terminalNumber=${TerminalNumber}&internalDealNumber=${internalDealNumber}`;

  if (CancelOnly) {
    params += `&CancelOnly=${CancelOnly}`
  }
  if (PartialSum) {
    params += `&PartialSum=${PartialSum}`
  }

  try {
    const response = await axios.get(`${url}${params}`);
    const responseData = querystring.decode(response.data);

    if (responseData.ResponseCode && responseData.ResponseCode == "0") {
      // chack if InvoiceResponse_ResponseCode == 0 to see if invoice is ok
      // Save Invoice number and Type to DB :
      res.status(200).json(responseData);
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
