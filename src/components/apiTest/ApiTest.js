import React, { useEffect } from "react";
import axios from "axios";

// const BASE_URL = "http://192.57.140.250/QPay/BackendURL/";
// const BASE_URL = "http://60.248.161.72/QPay/BackendURL/";
// const data = {
//   CMP_NO: "ODBC0000",
//   PUR_NO: "BU0A7030001",
//   SERVER: "60.248.161.72",
// };

const BASE_URL = "http://localhost:8080/user/allen";

const ApiTest = () => {
  useEffect(() => {
    const initialData = async () => {
      const response = await axios.get(BASE_URL);
      console.log("response", response);
    };
    initialData();
  }, []);

  const handleClick = async () => {
    const response = await axios.post(BASE_URL, {
      answer: "game",
    });
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
