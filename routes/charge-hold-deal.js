const router = require("express").Router();

const querystring = require("querystring");
const axios = require("axios");

router.get('/', async (req, res) => {
    let vars = [];
    vars['TerminalNumber'] = req.body.termainalNumber || 1000;
    vars['UserName'] = req.body.userName || 'barak9611';
    vars['SuspendedDealID'] = req.body.suspendedDealID || '83678740';
    const str = querystring.encode(vars);

    try {
        const response = await axios.post(
        "https://secure.cardcom.solutions/interface/SuspendedDealActivate.aspx",
        str
        );

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
})

module.exports = router;