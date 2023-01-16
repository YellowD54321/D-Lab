import React, { useRef, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const SORT_WAY = {
  DEC: "decrease",
  ASC: "ascend",
};

export const SortArrow = ({ fieldIndex, callBackCurSort }) => {
  const initialSortKey = "id";
  const [curSort, setCurSort] = useState({
    key: initialSortKey,
    way: SORT_WAY.ASC,
  });

  React.useEffect(() => {
    console.log("SortArrow Render");
    // console.log("curSort");
    // console.log(curSort);
  }, []);

  const setCurSortBy = ({ key, way }) => {
    setCurSort({ key, way });
    callBackCurSort({ key, way });
  };

  // 取得排序欄位
  const getSortKey = () => {
    return curSort.key;
  };

  // 取得排序方法(升冪或降冪)
  const getSortWay = () => {
    return curSort.way;
  };

  // 更改排序箭頭的顏色
  const handleSwitchColor = (sortKey, sortWay) => {
    return sortKey === getSortKey() && !(sortWay === getSortWay())
      ? "grey"
      : "blue";
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <KeyboardArrowUpIcon
        style={{
          cursor: "pointer",
          color: handleSwitchColor(fieldIndex, SORT_WAY.ASC),
        }}
        onClick={() =>
          setCurSortBy({
            key: fieldIndex,
            way: SORT_WAY.ASC,
          })
        }
      />
      <KeyboardArrowDownIcon
        style={{
          cursor: "pointer",
          color: handleSwitchColor(fieldIndex, SORT_WAY.DEC),
        }}
        onClick={() =>
          setCurSortBy({
            key: fieldIndex,
            way: SORT_WAY.DEC,
          })
        }
      />
    </div>
  );
};

const MemoSortArrow = React.memo(SortArrow);

export default MemoSortArrow;
