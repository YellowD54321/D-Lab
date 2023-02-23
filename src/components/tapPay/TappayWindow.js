import { Dialog } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { TAP_PAY } from "../../config";

const hideClass = "is-hide";

const TappayWindow = ({ isWindowOpen, setIsWindowOpen }) => {
  const windowRef = useRef();

  useEffect(() => {
    console.log("window first render");
    window.TPDirect.setupSDK(TAP_PAY.APP_ID, TAP_PAY.APP_KEY, "sandbox");
    const fields = {
      number: {
        // css selector
        element: "#card-number",
        placeholder: "**** **** **** ****",
      },
      expirationDate: {
        // DOM object
        element: document.getElementById("card-expiration-date"),
        placeholder: "MM / YY",
      },
      ccv: {
        element: "#card-ccv",
        placeholder: "後三碼",
      },
    };
    window.TPDirect.card.setup({
      fields: fields,
      styles: {
        // Style all elements
        input: {
          color: "gray",
        },
        // Styling ccv field
        "input.ccv": {
          "font-size": "16px",
        },
        // Styling expiration-date field
        "input.expiration-date": {
          "font-size": "16px",
        },
        // Styling card-number field
        "input.card-number": {
          "font-size": "16px",
        },
        // style focus state
        ":focus": {
          color: "black",
        },
        // style valid state
        ".valid": {
          color: "green",
        },
        // style invalid state
        ".invalid": {
          color: "red",
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        "@media screen and (max-width: 400px)": {
          input: {
            color: "orange",
          },
        },
      },
      // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
      isMaskCreditCardNumber: true,
      maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11,
      },
    });

    window.TPDirect.card.onUpdate(function (update) {
      // update.canGetPrime === true
      // --> you can call TPDirect.card.getPrime()
      if (update.canGetPrime) {
        console.log("update.canGetPrime");
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')
      } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
      }

      // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
      if (update.cardType === "visa") {
        // Handle card type visa.
      }

      // number 欄位是錯誤的
      if (update.status.number === 2) {
        // setNumberFormGroupToError()
      } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
      } else {
        // setNumberFormGroupToNormal()
      }

      if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
      } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
      } else {
        // setNumberFormGroupToNormal()
      }

      if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
      } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
      } else {
        // setNumberFormGroupToNormal()
      }
    });
  }, []);

  useEffect(() => {
    const isHide = !isWindowOpen;
    if (!windowRef.current) {
      return;
    }
    if (isHide) {
      windowRef.current.classList.add(hideClass);
    } else {
      windowRef.current.classList.remove(hideClass);
    }
  }, [isWindowOpen]);

  return (
    <div className="tappay-window" ref={windowRef}>
      <div className="tpfield" id="card-number"></div>
      <div className="tpfield" id="card-expiration-date"></div>
      <div className="tpfield" id="card-ccv"></div>
    </div>
  );
};

export default TappayWindow;
