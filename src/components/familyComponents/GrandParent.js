import React, { useState, useEffect } from "react";
import Parent from "./Parent";

const GrandParent = () => {
  const [outerNumber, setOuterNumber] = useState(0);
  const [innerNumber, setInnerNumber] = useState(0);

  const mainDataTable = () => {
    return <Parent innerNumber={innerNumber} />;
  };

  useEffect(() => {
    console.log("Grand First Render");
  }, []);

  useEffect(() => {
    console.log("Grand outerNumber Update");
  }, [outerNumber]);

  useEffect(() => {
    console.log("Grand innerNumber Update");
  }, [innerNumber]);

  return (
    <div>
      <button onClick={() => setOuterNumber((pre) => pre + 1)}>
        Create Outer Number {outerNumber}
      </button>
      <button onClick={() => setInnerNumber((pre) => pre + 1)}>
        Create Inner Number {innerNumber}
      </button>
      <br />
      {mainDataTable()}
      {/* <MainDataTable /> */}
    </div>
  );
};

export default GrandParent;
