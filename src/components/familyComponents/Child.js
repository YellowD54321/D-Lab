import React, { useState, useEffect } from "react";

const Child = ({ data }) => {
  const [childData, setChildData] = useState(data);

  useEffect(() => {
    console.log("Child First Render");
  }, []);

  useEffect(() => {
    console.log("Child childData Update");
  }, [childData]);

  return (
    <div>
      <button onClick={() => setChildData((pre) => pre - 1)}>
        Child Data {childData}
      </button>
    </div>
  );
};

export default Child;
