const router = require("express").Router();

const querystring = require("querystring");
const axios = require("axios");

router.get("/:SuspendedDealID?", async (req, res) => {
  const TerminalNumber = process.env.TERMINAL_NUMBER;
  const UserName = process.env.USER_NAME;
  const userpassword = process.env.PASSWORD;
  const SuspendedDealID = req.params.SuspendedDealID;

  const url = `https://secure.cardcom.solutions/Interface/DeleteSuspendedDeal.aspx`;
  let params = `?username=${UserName}&userpassword=${userpassword}&terminalnumber=${TerminalNumber}&SuspendedDealId=${SuspendedDealID}`;

  try {
    const response = await axios.get(`${url}${params}`);

    const responseData = querystring.decode(response.data);
    console.log(responseData)
    if (responseData.ResponseCode && responseData.ResponseCode == "0") {
      // chack if InvoiceResponse_ResponseCode == 0 to see if invoice is ok
      // Save Invoice number and Type to DB :
      res
        .status(200)
        .json(responseData);
    } else {
      res.status(500).json({
        "Error Code": responseData.ResponseCode,
        Description: responseData.Description,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
