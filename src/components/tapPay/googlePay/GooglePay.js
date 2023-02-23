import { Dialog } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { TAP_PAY } from "../../../config";

const PayWindow = ({ isOpen, onClose }) => {
  const windowClass = `tappay-window ${isOpen ? "" : "is-hide"}`;

  useEffect(() => {
    window.TPDirect.setupSDK(TAP_PAY.APP_ID, TAP_PAY.APP_KEY, "sandbox");

    var googlePaySetting = {
      // Optional in sandbox, Required in production
      googleMerchantId: "Come from google portal",

      allowedCardAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
      merchantName: "TapPay Test!",
      emailRequired: true, // optional
      shippingAddressRequired: true, // optional,
      billingAddressRequired: true, // optional
      billingAddressFormat: "MIN", // FULL, MIN

      allowPrepaidCards: true,
      allowedCountryCodes: ["TW"],

      phoneNumberRequired: true, // optional
    };
    window.TPDirect.googlePay.setupGooglePay(googlePaySetting);

    var paymentRequest = {
      allowedNetworks: ["AMEX", "JCB", "MASTERCARD", "VISA"],
      price: "123", // optional
      currency: "TWD", // optional
    };

    window.TPDirect.googlePay.setupPaymentRequest(
      paymentRequest,
      function (err, result) {
        if (result.canUseGooglePay) {
          //   window.TPDirect.googlePay.setupGooglePayButton({
          //     el: "#container",
          //     color: "black",
          //     type: "short",
          //     getPrimeCallback: function (err, prime) {
          //       if (err) {
          //         return;
          //       }
          //       console.log("prime", prime);
          //       // Send prime to your server, call pay by prime API.
          //     },
          //   });
        }
      }
    );
  }, []);

  const handleClickFakeButton = () => {
    window.TPDirect.googlePay.getPrime(function (err, prime) {
      // Get the prime, and send it to Server
      console.log("prime", prime);
    });
  };

  return (
    // <Dialog open={isOpen} onClose={onClose} maxWidth="md">
    <div className={windowClass}>
      <h4>Choose Online Payment</h4>
      <div id="container"></div>
      <button onClick={handleClickFakeButton}>Fake Button</button>
      <button onClick={() => onClose()}>Close</button>
    </div>
    // </Dialog>
  );
};

const TappayGooglePay = () => {
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  const handleClickSubmitButton = () => {
    const BASE_URL = "http://localhost:8080/pay-by-prime";

    window.TPDirect.googlePay.getPrime(async (err, prime) => {
      console.log("prime", prime);

      const res = await axios.post(BASE_URL, { prime: prime });
      console.log("res", res);
    });
  };

  return (
    <div>
      <h4>Google Pay</h4>
      <button onClick={() => setIsWindowOpen(true)}>Open Window</button>
      <button onClick={handleClickSubmitButton}>Pay By Prime</button>
      <PayWindow isOpen={isWindowOpen} onClose={() => setIsWindowOpen(false)} />
    </div>
  );
};

export default TappayGooglePay;
