const router = require("express").Router();

const querystring = require("querystring");
const axios = require("axios");

router.get('/:terNum/:userName/:SuspendedDealID/:userpassword', async (req, res) => {
    let vars = [];
    const TerminalNumber = req.params.terNum || 1000;
    const UserName = req.params.userName || 'barak9611';
    const SuspendedDealID = req.params.SuspendedDealID || '83678740';
    const userpassword = req.params.userpassword || '83678740';
    const str = querystring.encode(vars);

    try {
        const response = await axios.get(
        `https://secure.cardcom.solutions/Interface/DeleteSuspendedDeal.aspx?
        username=${UserName}&userpassword=${userpassword}&$TerminalNumber=${TerminalNumber}&SuspendedDealId=${SuspendedDealID}`
        );

        if (response.ResponseCode && response.ResponseCode == "0") {
        // chack if InvoiceResponse_ResponseCode == 0 to see if invoice is ok
        // Save Invoice number and Type to DB :
        res.status(200).json({ InternalDealNumber: obj.InternalDealNumber });
        } else {
        res
            .status(500)
            .json({ "Error Code": response.ResponseCode, Description: response.Description });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
})

module.exports = router;