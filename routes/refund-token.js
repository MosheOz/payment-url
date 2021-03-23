const router = require("express").Router();

const querystring = require("querystring");
const axios = require("axios");

router.get("/", async (req, res) => {
  const tokenDetails = {
    token: "4cf8e168-261e-4613-8d20-000332986b24",
    mountExp: 09,
    yearExp: 25,
    approvalNumber: 1234,
    IdentityNumber: 303456789,
    CardOwnerName: "Moshe",
    CardOwnerPhone: 0540000000,
    CardOwnerEmail: "test@test.com",
  };

  let vars = [];
  vars["TerminalNumber"] = process.env.TERMINAL_NUMBER;
  vars["UserName"] = process.env.USER_NAME;
  vars["TokenToCharge.RefundInsteadOfCharge"] = true; //// =====> for refund!! <======
  vars["TokenToCharge.UserPassword"] = process.env.PASSWORD; //// =====> for refund!! <=====
  vars["TokenToCharge.APILevel"] = process.env.API_LEVEL;
  vars["codepage"] = process.env.UNICODE; //UNICODE

  // token details from DataBase
  vars["TokenToCharge.Token"] = tokenDetails.token;
  vars["TokenToCharge.CardValidityMonth"] = tokenDetails.mountExp;
  vars["TokenToCharge.CardValidityYear"] = tokenDetails.yearExp;
  vars["TokenToCharge.ApprovalNumber"] = tokenDetails.approvalNumber; // ====> TO DO <====
  vars["TokenToCharge.IdentityNumber"] = tokenDetails.IdentityNumber;
  vars["TokenToCharge.CardOwnerName"] = tokenDetails.CardOwnerName;
  vars["TokenToCharge.CardOwnerPhone"] = tokenDetails.CardOwnerPhone;
  vars["TokenToCharge.CardOwnerEmail"] = tokenDetails.CardOwnerEmail;

  const body = {
    SumToBill: 250.5,
    coinID: 1,
    NumOfPayments: 1,
    IsAutoRecurringPayment: false,
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
          Price: "12.25",
          Quantity: "2",
        },
        {
          Description: "Orange",
          Price: "7.3",
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

  vars["TokenToCharge.SumToBill"] = body.SumToBill;
  vars["TokenToCharge.CoinID"] = body.coinID;
  vars["TokenToCharge.NumOfPayments"] = body.NumOfPayments;
  vars["TokenToCharge.IsAutoRecurringPayment"] = body.IsAutoRecurringPayment; // For oraa't keva

  // invoice Option - optinal
  vars["InvoiceHead.CustName"] = body.invoice.CustName;
  vars["InvoiceHead.CustAddresLine1"] = body.invoice.CustAddresLine1;
  vars["InvoiceHead.CustAddresLine2"] = body.invoice.CustAddresLine2;
  vars["InvoiceHead.CustCity"] = body.invoice.CustCity;
  vars["InvoiceHead.CustLinePH"] = body.invoice.CustLinePH;
  vars["InvoiceHead.CustMobilePH"] = body.invoice.CustMobilePH;
  vars["InvoiceHead.Language"] = body.invoice.Language;
  vars["InvoiceHead.Email"] = body.invoice.Email;
  vars["InvoiceHead.SendByEmail"] = body.invoice.SendByEmail;

  body.invoice.items.forEach((data, index) => {
    vars[`InvoiceLines${index + 1}.Description`] = data.Description;
    vars[`InvoiceLines${index + 1}.Price`] = data.Price;
    vars[`InvoiceLines${index + 1}.Quantity`] = data.Quantity;
  });

  const str = querystring.encode(vars);

  try {
    const response = await axios.post(
      "https://secure.cardcom.solutions/Interface/ChargeToken.aspx",
      str
    );

    //ResponseCode={0}&Description={1}&InternalDealNumber={2}&InvoiceResponse.ResponseCode={3}&InvoiceResponse.Description={4}&InvoiceResponse.InvoiceNumber={5}&InvoiceResponse.InvoiceType={6}
    const obj = querystring.decode(response.data);

    console.log(obj);

    if (obj.ResponseCode && obj.ResponseCode == "0") {
      // chack if InvoiceResponse_ResponseCode == 0 to see if invoice is ok
      // Save Invoice number and Type to DB :
      res.status(200).json(
        obj
        // ResponseCode: obj.ResponseCode,
        // InternalDealNumber: obj.InternalDealNumber,
        // ApprovalNumber: obj.ApprovalNumber,
        // Description: obj.Description,
        // invoiceResponseCode: obj["InvoiceResponse.ResponseCode"],
        // invoiceDescription: obj["InvoiceResponse.Description"],
        // invoiceNumber: obj["InvoiceResponse.InvoiceNumber"],
        // invoiceType: obj["InvoiceResponse.InvoiceType"],
        // token: obj.Token,
        // Mutag_24: obj.Mutag_24,
        // Sulac_25: obj.Sulac_25,
        // First_Payment_Sum_78: obj.First_Payment_Sum_78,
        // Const_Patment_86: obj.Const_Patment_86,
        // IsEMV: obj.IsEMV,
        // BinId: obj.BinId,
        // IsJ2ChackIsValid: obj.IsJ2ChackIsValid,
        // Tokef_30: obj.Tokef_30,
        // CardNumStart: obj.CardNumStart,
        // CardNumEnd: obj.CardNumEnd,
      );
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
