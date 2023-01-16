import React, { useState, useEffect } from "react";
import Child from "./Child";

const Parent = ({ innerNumber }) => {
  const [parentInnerData, setParentInnerData] = useState(innerNumber);
  const [data, setData] = useState(100);

  useEffect(() => {
    console.log("Parent First Render");
  }, []);

  useEffect(() => {
    console.log("Parent parentInnerData Update");
  }, [parentInnerData]);

  useEffect(() => {
    console.log("Parent data Update");
  }, [data]);

  useEffect(() => {
    setParentInnerData(innerNumber);
  }, [innerNumber]);

  return (
    <div>
      <button onClick={() => setParentInnerData((pre) => pre + 2)}>
        Parent Data {parentInnerData}
      </button>
      <Child data={data} />
    </div>
  );
};

export default Parent;
