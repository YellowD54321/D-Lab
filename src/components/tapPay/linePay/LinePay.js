import { Dialog } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { TAP_PAY } from "../../../config";

const PayWindow = ({ isOpen, onClose }) => {
  const windowClass = `tappay-window ${isOpen ? "" : "is-hide"}`;

  useEffect(() => {
    window.TPDirect.setupSDK(TAP_PAY.APP_ID, TAP_PAY.APP_KEY, "sandbox");
  }, []);

  const handleClickFakeButton = () => {
    window.TPDirect.linePay.getPrime(function (result) {
      // Get the prime, and send it to Server
      console.log("result", result);
    });
  };

  return (
    // <Dialog open={isOpen} onClose={onClose} maxWidth="md">
    <div className={windowClass}>
      <h4>Choose Online Payment</h4>
      {/* <div id="container"></div> */}
      <button onClick={handleClickFakeButton}>Line Pay</button>
      <button onClick={() => onClose()}>Close</button>
    </div>
    // </Dialog>
  );
};

const TappayLinePay = () => {
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  const handleClickSubmitButton = () => {
    const BASE_URL = "http://localhost:8080/pay-by-line-pay";

    window.TPDirect.linePay.getPrime(async (result) => {
      console.log("result", result);

      const prime = result.prime;
      const res = await axios.post(BASE_URL, { prime: prime });
      console.log("res", res);
    });
  };

  return (
    <div>
      <h4>Line Pay</h4>
      <button onClick={() => setIsWindowOpen(true)}>Open Window</button>
      <br />
      <button onClick={handleClickSubmitButton}>Send Prime To Server</button>
      <PayWindow isOpen={isWindowOpen} onClose={() => setIsWindowOpen(false)} />
    </div>
  );
};

export default TappayLinePay;
