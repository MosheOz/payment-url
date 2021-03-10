const TerminalNumber = 1000; // Company terminal
const UserName = process.env.USER_NAME; // API User
const CreateInvoice = true; // to Create Invoice (Need permissions to create invoice )
const Operation = 4;
const vars = [];

module.exports = {
  defineVarInvoice: () => {
    // article for invoice vars:  http://kb.cardcom.co.il/article/AA-00244/0
    vars["IsCreateInvoice"] = "true";
    // customer info :
    vars["InvoiceHead.CustName"] = "Moshe"; // customer name
    vars["InvoiceHead.SendByEmail"] = "true"; // will the invoice be send by email to the customer
    vars["InvoiceHead.Language"] = "he"; // he or en only
    vars["InvoiceHead.Email"] = "test@gmail.com";

    // products info

    const arr = [
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
    ];
    arr.forEach((data, index) => {
      vars[`InvoiceLines${index + 1}.Description`] = data.Description;
      vars[`InvoiceLines${index + 1}.Price`] = data.Price;
      vars[`InvoiceLines${index + 1}.Quantity`] = data.Quantity;
    });

    return vars;
    // ********   Sum of all Lines Price*Quantity  must be equals to SumToBill ***** //
  },

  defineVarsArr: () => {
    vars["TerminalNumber"] = TerminalNumber;
    vars["UserName"] = UserName;
    vars["APILevel"] = "10"; // req
    vars["codepage"] = "65001"; // unicode
    vars["Operation"] = Operation;

    vars["Language"] = "en"; // page languge he- hebrew , en - english , ru , ar
    vars["CoinID"] = "1"; // billing coin , 1- NIS , 2- USD other , article :  http://kb.cardcom.co.il/article/AA-00247/0
    vars["SumToBill"] = "79.4"; // Sum To Bill
    vars["ProductName"] = "Your Cart Details"; // Product Name , will how if no invoice will be created.

    vars["SuccessRedirectUrl"] = "https://payment-cardcom.herokuapp.com/success-page"; // Success Page
    vars["ErrorRedirectUrl"] =
      "https://secure.cardcom.solutions/DealWasUnSuccessful.aspx?customVar=1234"; // Error Page

    // Other Optional vars :

    vars["CancelType"] = "2"; // show Cancel button on start ,
    vars["CancelUrl"] = "https://payment-cardcom.herokuapp.com/";
    vars["IndicatorUrl"] = "https://payment-cardcom.herokuapp.com/NotifyURL"; // Indicator Url \ Notify URL . after use -  http://kb.cardcom.co.il/article/AA-00240/0

    vars["ReturnValue"] = "1234"; // Optional , ,recommended , value that will be return and save in CardCom system
    vars["MaxNumOfPayments"] = "12"; // max num of payments to show  to the user

    vars["ShowInvoiceHead"] = "true"; //  if show & edit Invoice Details on the page.
    vars["InvoiceHeadOperation"] = "1";

    return vars;
  }
};


