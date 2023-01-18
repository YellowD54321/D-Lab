import React, { useEffect } from "react";
import "./tapPay.css";
import axios from "axios";

const BASE_URL = "http://localhost:8080/pay-by-prime";

const TapPay = () => {
  useEffect(() => {
    window.TPDirect.setupSDK(
      126903,
      "app_A2Tc5Hb6sekIkziqXsZf9fit0C7X7shLeuc0onPTeW8f9ZvFmAoFCk8QhjpL",
      "sandbox"
    );
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

  const handleClickSubmitButton = () => {
    // 取得 TapPay Fields 的 status
    const tappayStatus = window.TPDirect.card.getTappayFieldsStatus();
    console.log("tappayStatus", tappayStatus);

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
      alert("can not get prime");
      return;
    }

    window.TPDirect.card.getPrime(async (response) => {
      console.log("response", response);

      const res = await axios.post(BASE_URL, { prime: response.card.prime });
      console.log("res", res);
    });
  };

  const handleClickPayByCardTokenButton = async () => {
    const url = "http://localhost:8080/pay-by-card-token";
    const res = await axios.post(url);
    console.log("res", res);
  };

  // const handleClickTestButton = async () => {
  //   const corsURL = "https://cors-anywhere.herokuapp.com/";
  //   const apiUrl = "http://60.248.161.72/QPay/BackendURL/";
  //   const res = await axios.post(corsURL + apiUrl, {});
  //   console.log("res", res);
  // };

  return (
    <div className="tappay-page">
      <div className="tpfield" id="card-number"></div>
      <div className="tpfield" id="card-expiration-date"></div>
      <div className="tpfield" id="card-ccv"></div>
      <button onClick={handleClickSubmitButton}>Submit</button>
      <button onClick={handleClickPayByCardTokenButton}>
        Pay By Card Token
      </button>
      {/* <button onClick={handleClickTestButton}>test</button> */}
    </div>
  );
};

export default TapPay;
