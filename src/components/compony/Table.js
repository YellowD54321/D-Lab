import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import edit_col from "../../asset/pos_img/edit_col.png";
import delete_col from "../../asset/pos_img/delete_col.png";
import sort_2 from "../../asset/pos_img/sort_2.png";
import adjmenu_1 from "../../asset/pos_img/adjmenu_1.png";
import SortArrow, { SORT_WAY } from "./SortArrow";
import PageFooter, { PAGE_FIELD, PAGE_SIZE } from "../PageFooter";
import { TABLE_IMAGE } from "../../../utils/Contant";

// 以欄位名稱來判定是否為特殊欄位，因此需確認欄位名稱是否正確
const OPERATION_STRING = "操作";
const DRAG_STRING = "排序";

const ROW_COLOR = {
  DEFAULT: "default",
  WHITE: "white",
};

const Table = ({
  header = [],
  body = [],
  isDragable = false,
  hasPage = true,
  getTableList = null,
  rowColor = ROW_COLOR.DEFAULT,
}) => {
  // const [tableDataList, setTableDataList] = useState({
  //   header,
  //   body,
  // });
  const [tableDataList, setTableDataList] = useState(firstRender());
  console.log("tableDataList in table");
  console.log(tableDataList);
  // 取得並設定操作欄位的index
  const operationIndex = useRef(setOperationIndex(header));
  // 取得並設定排序欄位的index
  const dragFieldIndex = useRef(setDragFieldIndex(header));
  const [pageValue, setPageValue] = useState({
    [PAGE_FIELD.CURRENT]: 0,
    [PAGE_FIELD.TOTAL]: 0,
    [PAGE_FIELD.SIZE]: PAGE_SIZE[1],
  });
  const initialSortKey = "id";
  const curSortRef = useRef({
    key: initialSortKey,
    way: SORT_WAY.ASC,
  });

  function firstRender() {
    console.log("first render");
    console.log(header);
    console.log(body);

    return {
      header,
      tbody: body,
    };
  }

  // 設定操作欄位的index
  function setOperationIndex(headerArray) {
    const operIndex = headerArray.findIndex(
      (field) => field.content === OPERATION_STRING
    );
    return operIndex;
  }

  // 取得操作欄位的index
  const getOperationIndex = () => {
    return operationIndex.current;
  };

  // 設定排序欄位的index
  function setDragFieldIndex(headerArray) {
    const dragIndex = headerArray.findIndex(
      (field) => field.content === DRAG_STRING
    );
    return dragIndex;
  }

  // 取得排序欄位的index
  const getDragFieldIndex = () => {
    return dragFieldIndex.current;
  };

  // 取得操作欄位的圖片
  const getOperationImage = (str) => {
    switch (str) {
      case TABLE_IMAGE.MODIFY:
        return edit_col;
      case TABLE_IMAGE.DELETE:
        return delete_col;
      case TABLE_IMAGE.SEQUENCE:
        return sort_2;
      case TABLE_IMAGE.MENU_MODIFY:
        return adjmenu_1;
      default:
        return "";
    }
  };

  // 單純文字或數字放進h5中
  const formatStringCell = (str) => {
    return <h5 className="m-0">{str}</h5>;
  };

  // 設定排序欄位與升降冪
  const getCurSort = React.useCallback(({ key, way }) => {
    console.log({ key, way });
    curSortRef.current = {
      key,
      way,
    };
    // 當排序方法改變時重新排序資料
    const sortedList = handleSortData(tableDataList.tbody);
    setTableDataList({
      header: [...header],
      body: [...sortedList],
    });
  }, []);

  // 取得排序欄位
  const getSortKey = () => {
    return curSortRef.current.key;
  };

  // 取得排序方法(升冪或降冪)
  const getSortWay = () => {
    return curSortRef.current.way;
  };

  // 以文字進行排序
  const sortString = (a, b) => {
    return a.localeCompare(b, undefined, { numeric: true });
  };

  // 排序表格內容
  const handleSortData = (dataList) => {
    // 沒有資料時不須排序
    if (dataList?.length <= 0) {
      return dataList;
    }

    console.log("dataList ");
    console.log(dataList);

    const curSortKey = getSortKey();
    const curSortWay = getSortWay();

    // 若sort key為非數字(例如id)，不重新排序
    if (typeof curSortKey !== "number") return dataList;

    const sortedList = [...dataList];
    const dataType = typeof sortedList[0].data[curSortKey].content;
    let compareData = [];

    sortedList.sort((a, b) => {
      // 判定升冪或降冪
      if (curSortWay === SORT_WAY.ASC) {
        compareData[0] = a.data[curSortKey].content;
        compareData[1] = b.data[curSortKey].content;
      } else {
        compareData[0] = b.data[curSortKey].content;
        compareData[1] = a.data[curSortKey].content;
      }
      // 依表格的資料類型排序
      switch (dataType) {
        case "string":
          return sortString(compareData[0], compareData[1]);
        case "number":
          return compareData[0] - compareData[1];
        default:
          return compareData[0] - compareData[1];
      }
    });
    returnTableList(sortedList);
    return sortedList;
  };

  // 回傳表格內容到前一層component
  const returnTableList = (bodyList) => {
    if (!getTableList) return;
    getTableList({
      header: [...header],
      tbody: [...bodyList],
    });
  };

  // useEffect(() => {
  //   console.log("table is re-render");
  //   console.log(tableDataList);
  //   const sortedList = handleSortData(tableDataList.body);
  //   setTableDataList({
  //     header: [...header],
  //     body: [...sortedList],
  //   });
  // }, []);

  // 放開拖動時將資料重新排序
  const onDragEnd = (result) => {
    const { destination, source } = result;

    // 拖動到表格外方開時，不須重新排序
    if (!destination) {
      return;
    }
    // 拖動位置不變時，不須重新排序
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // 將表格資料移除後，在拖動放開的位置插入該資料
    const dataList = [...tableDataList.tbody];
    const dropedData = dataList.splice(source.index, 1);
    dataList.splice(destination.index, 0, ...dropedData);
    //將排序方法設為special 'DROP'，讓排序箭頭顏色恢復預設
    // setCurSortBy({ key: "DROP", way: SORT_WAY.ASC });
    returnTableList(dataList);
    setTableDataList((preValue) => {
      return {
        ...preValue,
        tbody: [...dataList],
      };
    });
  };

  // 產生表頭的欄位內容
  const createHeader = () => {
    return (
      <thead>
        <tr>
          {tableDataList.header.map((field, index) => {
            const isSortable = field.isSortable ?? true;
            const isOperationField = index === getOperationIndex();
            const thStyle = {
              color: "#06F",
              ...field.style,
            };

            return (
              <th style={thStyle} key={index}>
                <div className="d-flex align-items-center ">
                  {formatStringCell(field.content)}
                  {isSortable && !isOperationField && (
                    <SortArrow
                      fieldIndex={index}
                      callBackCurSort={getCurSort}
                    />
                  )}
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
    );
  };

  // 產生表身的欄位內容
  const createBody = () => {
    const pageSize = pageValue[PAGE_FIELD.SIZE];
    const curPage = pageValue[PAGE_FIELD.CURRENT];
    if (!tableDataList.tbody || tableDataList.tbody.length <= 0) return null;
    // 判定是否顯示頁數
    // 若不需要頁數，則不分頁，顯示完整表格內容
    let tableDataArray;
    let curPageTableData;
    if (!!hasPage) {
      tableDataArray = _.chunk(tableDataList.tbody, pageSize);
      curPageTableData = tableDataArray[curPage];
    } else {
      tableDataArray = tableDataList.tbody;
      curPageTableData = tableDataArray;
    }
    if (!tableDataArray || tableDataArray.length <= 0 || !curPageTableData) {
      return null;
    }

    // 依照表格內容整理為相關顯示內容
    const formatCellContent = ({ index, content, rowId, dragProps }) => {
      // 操作欄位內容
      if (index === getOperationIndex()) {
        return content.map(({ name, handleFunction }, index) => {
          const imgSrc = getOperationImage(name);
          return (
            <img
              key={index}
              src={imgSrc}
              alt={name}
              width="77"
              height="30"
              onClick={() => handleFunction(rowId)}
            />
          );
        });
        // 排序欄位內容
      } else if (index === getDragFieldIndex()) {
        const imgSrc = sort_2;
        return (
          <img
            key={index}
            src={imgSrc}
            alt="drag"
            width="30"
            height="30"
            {...dragProps}
          />
        );
        // 單純文字或數字內容
      } else if (typeof content === "string" || typeof content === "number") {
        return formatStringCell(content);
      }
      // 其他內容
      return content;
    };

    return (
      <Droppable
        droppableId="table-droppable-area"
        isDropDisabled={!isDragable}
      >
        {(provided) => (
          <tbody ref={provided.innerRef} {...provided.droppableProps}>
            {curPageTableData.map((row, index) => {
              const rowId = row.id;
              const rowData = row.data;
              return (
                <Draggable
                  draggableId={rowId.toString()}
                  index={index}
                  key={rowId}
                  isDragDisabled={!isDragable}
                >
                  {(provided, snapshot) => {
                    // 依需求調整各row顏色
                    let color;
                    switch (rowColor) {
                      case ROW_COLOR.DEFAULT:
                        color = `${index % 2 === 0 ? "#D8D8D8" : "#FFFFFF"}`;
                        break;
                      case ROW_COLOR.WHITE:
                        color = "#FFFFFF";
                        break;
                      default:
                        color = `${index % 2 === 0 ? "#D8D8D8" : "#FFFFFF"}`;
                        break;
                    }
                    return (
                      <tr
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        style={{
                          ...provided.draggableProps.style,
                          backgroundColor: color,
                          height: "35",
                          display: snapshot.isDragging ? "table" : "",
                        }}
                      >
                        {rowData.map((cell, index) => {
                          const tdStyle = {
                            ...cell.style,
                            // 拉動時調整各欄位與header同寬
                            width: snapshot.isDragging
                              ? tableDataList.header[index].style.width
                              : "",
                          };
                          return (
                            <td key={index} style={tdStyle}>
                              {formatCellContent({
                                index,
                                content: cell.content,
                                rowId,
                                dragProps: provided.dragHandleProps,
                              })}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  }}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </tbody>
        )}
      </Droppable>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <table border="2" style={{ width: "100%" }}>
        {createHeader()}
        {createBody()}
      </table>
      {hasPage && (
        <PageFooter
          dataListLength={tableDataList.tbody?.length}
          pageValue={pageValue}
          setPageValue={setPageValue}
        />
      )}
    </DragDropContext>
  );
};

Table.propTypes = {
  header: PropTypes.array,
  body: PropTypes.array,
  hasModifyButton: PropTypes.bool,
  handleModifyButtonClick: PropTypes.func,
  hasDeleteButton: PropTypes.bool,
  handleDeleteButtonClick: PropTypes.func,
  isDragable: PropTypes.bool,
  hasPage: PropTypes.bool,
  returnTableList: PropTypes.func,
  rowColor: PropTypes.string,
};

// const isNeedToRender = (preProps, nextProps) => {
//   const preHeaderJSON = JSON.stringify(preProps.header);
//   const nextHeaderJSON = JSON.stringify(nextProps.header);
//   const preBodyJSON = JSON.stringify(preProps.body);
//   const nextBodyJSON = JSON.stringify(nextProps.body);
//   if (preHeaderJSON === nextHeaderJSON && preBodyJSON === nextBodyJSON) {
//     return true;
//   }
//   return false;
// };

// const MemoTable = React.memo(Table, isNeedToRender);

export default Table;
