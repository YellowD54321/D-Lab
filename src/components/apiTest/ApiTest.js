import React, { useEffect } from "react";
import axios from "axios";

// const BASE_URL = "http://192.57.140.250/QPay/BackendURL/";
const BASE_URL = "http://60.248.161.72:5000/QPayPayment/";
// const data = {
//   CMP_NO: "ODBC0000",
//   PUR_NO: "BU0A7030001",
//   SERVER: "60.248.161.72",
// };

// const BASE_URL = "http://localhost:8080/user/allen";

const ApiTest = () => {
  useEffect(() => {
    const initialData = async () => {
      // const data = {
      //   OrderNo: "OD20230120150004",
      // };
      const response = await axios.get(BASE_URL /* data */);
      console.log("response", response);
    };
    initialData();
  }, []);

  const handleClick = async () => {
    const data = {
      OrderNo: "OD20230120150004",
      Amount: 1234,
      PrdtName: "點餐測試",
      PayKind: "Card",
      CCToken: "fe35cea4-0170-4dba-9317-2e8b19e36cd8",
    };
    const response = await axios.post(BASE_URL, data);
    console.log("response", response);
  };

  return (
    <div>
      123
      <button onClick={handleClick}>Click</button>
    </div>
  );
};

export default ApiTest;
