import * as React from "react";
import "../asset/static/css/input_switch.css";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import add_1 from "../asset/pos_img/add_1.png";
import search_1 from "../asset/pos_img/search_1.png";
import save_1 from "../asset/pos_img/save_1.png";
import useAxios, { APIS } from "../../utils/useAxios";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import AlertWindow from "../common/AlertWindow";
import Table from "../common/table/Table";
import { TABLE_IMAGE } from "../../utils/Contant";

const DATA_KEY = {
  ID: "id",
  POS_NUMBER: "POS_PRDNO",
  NAME: "ADDL_NAM",
  DISPLAY_NAME: "ADDL_DSP_NAM",
  DATE: "UPD_DAT",
  ONSALE: "ADD_ONSALE_SW",
  CALORIES: "ADD_CAL_DOC",
  PRICE: "PRD_ADD_UPR",
  UBER_PRICE: "UB_ADD_UPR",
  FP_PRICE: "FP_ADD_UPR",
  GRP_SHOW: "ADD_ADDG_SW",
  GRP_NUMBER: "ADD_ADDG_NO",
  ADD_KING_NAME: "ADDK_NAM",
  ADD_GROUP_NAME: "ADDG_NAM",

  ADD_KIND_NAME: "ADDK_NAM",
  ADD_LIST_DATA: "wpaddlst",
  ADD_LIST_DATA_LIST: "wpaddlstupr",
};

const ALERT_MESSAGE = {
  EMPTY: "必填(*)欄位不可為空白",
  SAME: "選項明細名稱不可重複",
  NEGATIVE: "價格不可為負數！",
};

const REQUIRED_FIELD = [
  DATA_KEY.NAME,
  // DATA_KEY.PRICE, // 價格改為空白的話直接帶入0
  DATA_KEY.ONSALE,
  DATA_KEY.DISPLAY_NAME,
];

const AddList = () => {
  const { store } = useSelector((state) => state);
  const addKindFilterInitialValue = -1;
  const [tableDataList, setTableDataList] = useState([]);
  const [addKindDataList, setAddKindDataList] = useState([]);
  const addGroupDataList = useRef([]);
  const [addKindFilter, setAddKindFilter] = useState(addKindFilterInitialValue); // addKindFilter儲存addKindDataList的index
  const [searchBarValue, setSearchBarValue] = useState("");
  const [isDataModifyWindowOpen, setIsDataModifyWindowOpen] = useState(false);
  const modifyDataIdRef = useRef(null);
  let api = useAxios();

  const setAddGroupDataList = (data) => {
    addGroupDataList.current = data;
  };

  const getAddGroupDataList = () => {
    return addGroupDataList.current;
  };

  // 從API抓取資料
  const getApiData = async () => {
    let response = await api.get(APIS.GET_ADD_LIST_SETTING, {
      params: {
        wpcmpstr__id: store.selectedStore.id,
      },
    });
    let data = response.data;
    if (data !== undefined) {
      // 新增一個欄位hide，用來判定該列(row)內容是否要顯示在畫面中
      data.results.map((result) => (result.hide = false));
      setTableDataList(data.results);
    }
  };

  // 在資料庫中新增單項出單屬性資料
  const addApiData = async (value) => {
    let response = await api.post(APIS.GET_ADD_LIST_SETTING, value);
    let data = response.data;
    if (data !== undefined) {
      getApiData();
    }
  };

  // 在資料庫中修改單項出單屬性資料
  const changeApiData = async (id, value) => {
    let response = await api.patch(APIS.GET_ADD_LIST_SETTING + "/" + id, value);
    let data = response.data;
    if (data !== undefined) {
      getApiData();
    }
  };

  // 在資料庫中刪除單項出單屬性資料
  const deleteApiData = async (id) => {
    let response = await api.delete(APIS.GET_ADD_LIST_SETTING + "/" + id);
    let data = response.data;
    if (data !== undefined) {
      getApiData();
    }
  };

  // 取得AddKind資料庫的資料
  const getAddKindApiData = async () => {
    let response = await api.get(APIS.GET_ADD_KIND_SETTING, {
      params: {
        wpcmpstr__id: store.selectedStore.id,
        AS_DEFAULT: "true",
      },
    });
    let data = response.data;
    if (data !== undefined) {
      setAddKindDataList(data.results);
    }
  };

  // 取得AddGroup資料庫的資料
  const getAddGroupApiData = async () => {
    let response = await api.get(APIS.GET_ADD_GROUP_SETTING, {
      params: {
        wpcmpstr__id: store.selectedStore.id,
      },
    });
    let data = response.data;
    if (data !== undefined) {
      setAddGroupDataList(data.results);
    }
  };

  // 設定需要修改資料的ID
  const setModifyDataId = (id) => {
    modifyDataIdRef.current = id;
  };

  //取得需要修改資料的ID
  const getModifyDataId = () => {
    return modifyDataIdRef.current;
  };

  // 點擊刪除按鈕
  function handleDelete(id) {
    deleteApiData(id);
  }

  // 開啟資料增修畫面
  const handleOpenModifyWindow = (id = null) => {
    setModifyDataId(id);
    setIsDataModifyWindowOpen(true);
    getAddGroupApiData();
  };

  // 關閉資料增修畫面
  const handleDataModifyWindowClose = () => {
    setIsDataModifyWindowOpen(false);
  };

  // 儲存新增或修改的資料
  const handleSaveData = (data) => {
    if (!data) return;
    const dataId = getModifyDataId();
    if (dataId) {
      changeApiData(dataId, data);
    } else {
      addApiData(data);
    }
  };

  // 選擇選項類別
  const handleSelectAddKind = (e) => {
    const value = e.target.value;
    setAddKindFilter(value);
  };

  // 儲存搜尋文字
  const handleChangeSearchBarValue = (e) => {
    const value = e.target.value;
    setSearchBarValue(value);
  };

  // 過濾需要顯示的表格內容
  const filterDisplayData = () => {
    if (!tableDataList || tableDataList.length <= 0) return;
    return tableDataList.filter((rowData) => !rowData.hide);
  };

  const addKindOptionList = () => {
    return (
      <>
        {addKindDataList.map((data) => {
          return (
            <option key={data.id} value={data.id}>
              {data[DATA_KEY.ADD_KING_NAME]}
            </option>
          );
        })}
      </>
    );
  };

  // 剛進畫面時從API讀取資料
  useEffect(() => {
    getApiData();
    getAddKindApiData();
  }, []);

  // 當選項類別選查或文字搜尋更動時
  // 判定選項明細是否顯示
  useEffect(() => {
    if (!tableDataList || tableDataList.length <= 0) return;

    // 判定選項明細是否在選項類別中
    const isFilteredByAddKind = (addListId) => {
      // 讀取目前選查中的選項類別資料
      const curFilterAddKindData = addKindDataList.find(
        (data) => Number(data.id) === Number(addKindFilter)
      );
      // 如果選項明細有在此選項類別中，回傳true
      const isIncludedInAddKindData = curFilterAddKindData[
        DATA_KEY.ADD_LIST_DATA_LIST
      ].some((obj) => obj[DATA_KEY.ADD_LIST_DATA].id === addListId);

      return isIncludedInAddKindData;
    };

    const filteredList = tableDataList.map((rowData) => {
      let isInAddKind = false;
      // 判定是否存在於當前選項類別選查中
      if (Number(addKindFilter) === addKindFilterInitialValue) {
        // 當選查為<全部>時，顯示全部
        isInAddKind = true;
      } else {
        // 當明細有在選查的選項類別中時，顯示該明細
        isInAddKind = isFilteredByAddKind(rowData.id);
      }
      let isFilteredByTextSearch = false;
      // 搜尋欄位沒有文字時，表格全部顯示
      if (searchBarValue === "") {
        isFilteredByTextSearch = true;
      } else {
        // 將符合搜尋欄位文字的表格內容的hide設定為false、不符合的設定為true
        isFilteredByTextSearch =
          rowData[DATA_KEY.NAME].includes(searchBarValue);
      }
      // 當選項類別相符、且文字搜尋相符時才顯示
      rowData.hide = !(isInAddKind && isFilteredByTextSearch);
      return rowData;
    });

    setTableDataList(filteredList);
  }, [searchBarValue, addKindFilter]);

  // 繪製主要表格資料
  const MainTableList = () => {
    const displayTableList = filterDisplayData();

    const header = [
      {
        content: "選項明細",
        style: { width: "20%", height: "32px" },
      },
      {
        content: "上架",
        style: { width: "12%", height: "32px" },
      },
      {
        content: "價格",
        style: { width: "12%", height: "32px" },
      },
      {
        content: "異動日期",
        style: { width: "31%", height: "32px" },
      },
      {
        content: "操作",
        style: { width: "25%", height: "32px" },
      },
    ];

    if (!displayTableList || displayTableList.length <= 0)
      return <Table header={header} body={[]} />;

    const body = displayTableList.map((rowData, index) => {
      const originDate = new Date(rowData[DATA_KEY.DATE]);
      const year = originDate.getFullYear();
      const month = String(originDate.getMonth() + 1).padStart(2, "0");
      const day = String(originDate.getDate()).padStart(2, "0");
      const hour = String(originDate.getHours()).padStart(2, "0");
      const minute = String(originDate.getMinutes()).padStart(2, "0");
      const second = String(originDate.getSeconds()).padStart(2, "0");
      const formatDate =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second;
      return {
        id: rowData.id,
        data: [
          {
            content: rowData[DATA_KEY.NAME],
          },
          {
            content: rowData[DATA_KEY.ONSALE] ? "V" : "X",
          },
          {
            content: parseInt(rowData[DATA_KEY.PRICE]),
          },
          {
            content: formatDate,
          },
          {
            content: [
              {
                name: TABLE_IMAGE.MODIFY,
                handleFunction: handleOpenModifyWindow,
              },
              {
                name: TABLE_IMAGE.DELETE,
                handleFunction: handleDelete,
              },
            ],
          },
        ],
      };
    });

    return <Table header={header} body={body} />;
  };

  const DataModifyWindow = ({ handleSaveData, onClose }) => {
    const curDataList = tableDataList;
    const curData = curDataList.find((data) => data.id === getModifyDataId());
    const DefaultValue = {
      [DATA_KEY.ID]: curData ? curData.id : null,
      [DATA_KEY.NAME]: curData ? curData[DATA_KEY.NAME] : "",
      [DATA_KEY.DISPLAY_NAME]: curData ? curData[DATA_KEY.DISPLAY_NAME] : "",
      [DATA_KEY.ONSALE]: curData ? curData[DATA_KEY.ONSALE] : true,
      [DATA_KEY.CALORIES]: curData ? curData[DATA_KEY.CALORIES] : 0,
      [DATA_KEY.PRICE]: curData ? handlePrice(curData[DATA_KEY.PRICE]) : "",
      [DATA_KEY.UBER_PRICE]: curData
        ? handlePrice(curData[DATA_KEY.UBER_PRICE])
        : "",
      [DATA_KEY.FP_PRICE]: curData
        ? handlePrice(curData[DATA_KEY.FP_PRICE])
        : "",
      [DATA_KEY.GRP_SHOW]: curData ? curData[DATA_KEY.GRP_SHOW] : false,
      [DATA_KEY.GRP_NUMBER]: curData ? curData[DATA_KEY.GRP_NUMBER] : 1,
      [DATA_KEY.POS_NUMBER]: curData ? curData[DATA_KEY.POS_NUMBER] : "",
    };
    const [newData, setNewData] = useState(DefaultValue);
    const [alertMessage, setAlertMessage] = useState(ALERT_MESSAGE.EMPTY);
    const [isMessageWindowOpen, setIsMessageWindowOpen] = useState(false);

    // 處理各種價格欄位的顯示
    function handlePrice(value) {
      let price = "";

      if (value !== "") {
        // 顯示為整數
        price = Number(value).toFixed(0);
      }
      return price;
    }

    // 修改資料後各欄位更新顯示
    const handleValueChange = (e) => {
      const value = e.target.value;
      const field = e.target.name;

      setNewData((preValue) => ({
        ...preValue,
        [field]: value,
      }));
    };

    // check box欄位修改後更新顯示
    const handleCheckboxChange = (e) => {
      const value = e.target.checked;
      const field = e.target.name;

      setNewData((preValue) => ({
        ...preValue,
        [field]: value,
      }));
    };

    const handlePriceChange = (e) => {
      const value = handlePrice(e.target.value);
      const field = e.target.name;

      setNewData((preValue) => ({
        ...preValue,
        [field]: value,
      }));
    };

    // 點擊儲存按鈕
    const handleClickSaveButton = () => {
      const curDataList = tableDataList;
      if (!curDataList || curDataList.length <= 0) return;
      // 判定選項明細名稱是否重複
      if (
        curDataList.filter(
          (data) =>
            data.id !== newData.id &&
            data[DATA_KEY.NAME] === newData[DATA_KEY.NAME]
        ).length > 0
      ) {
        setAlertMessage(ALERT_MESSAGE.SAME);
        handleMessageWindowOpen(true);
        return;
      }
      // 判定必填欄位是否為空白
      if (
        REQUIRED_FIELD.some((field) => {
          return newData[field] === "";
        })
      ) {
        setAlertMessage(ALERT_MESSAGE.EMPTY);
        handleMessageWindowOpen(true);
        return;
      }

      const modifyData = { ...newData };
      // 判定價格是否為空白，若空白則帶入0
      if (modifyData[DATA_KEY.PRICE] === "") {
        modifyData[DATA_KEY.PRICE] = 0;
      }
      // 判定外送平台價格是否為空白，若空白則該平台價格與原價格相同
      if (modifyData[DATA_KEY.UBER_PRICE] === "") {
        modifyData[DATA_KEY.UBER_PRICE] = modifyData[DATA_KEY.PRICE];
      }
      if (modifyData[DATA_KEY.FP_PRICE] === "") {
        modifyData[DATA_KEY.FP_PRICE] = modifyData[DATA_KEY.PRICE];
      }
      // 判定「價格」、「UberEat價格」、「FoodPanda價格」是否為負值
      if (
        newData[DATA_KEY.PRICE] < 0 ||
        newData[DATA_KEY.UBER_PRICE] < 0 ||
        newData[DATA_KEY.FP_PRICE] < 0
      ) {
        setAlertMessage(ALERT_MESSAGE.NEGATIVE);
        handleMessageWindowOpen(true);
        return;
      }
      // 判定選項組合(子選項)是否啟用，若不啟用則將ADD_ADDG_NO欄位設定為null
      if (!modifyData[DATA_KEY.GRP_SHOW]) {
        modifyData[DATA_KEY.GRP_NUMBER] = null;
      }

      handleSaveData(modifyData);
      onClose();
    };

    // 關閉提醒畫面
    const handleMessageWindowOpen = (isOpen) => {
      setIsMessageWindowOpen(isOpen);
    };

    // 讀取選項組合(子選單)內容
    const addGroupOptionList = () => {
      const addGroupDataList = getAddGroupDataList();
      return (
        <>
          {addGroupDataList.map((data, index) => {
            return (
              <option key={data.id} value={data.id}>
                {data[DATA_KEY.ADD_GROUP_NAME]}
              </option>
            );
          })}
        </>
      );
    };

    return (
      <div>
        <table width="100%">
          <tr>
            <td width="5%" height="60"></td>
            <td width="20%" style={{ color: "#F90" }}>
              <h4>[2B1.選項明細]</h4>
            </td>
            <td width="30%"></td>
            <td width="15%">
              <img
                src={save_1}
                alt="save"
                style={{ width: "118", height: "46", cursor: "pointer" }}
                onClick={handleClickSaveButton}
              />
            </td>
            <td width="10%"></td>
            <td width="20%"></td>
          </tr>
        </table>
        <table width="100%">
          <tr>
            <td width="5%" height="50"></td>
            <td width="13%">
              <h5>選項明細名稱*</h5>
            </td>
            <td width="37%">
              <h5>
                <input
                  type="text"
                  name={DATA_KEY.NAME}
                  size="30"
                  value={newData[DATA_KEY.NAME]}
                  onChange={handleValueChange}
                />
              </h5>
            </td>
            <td width="10%">
              <h5>商品代號</h5>
            </td>
            <td width="35%">
              <h5>
                <input
                  type="text"
                  name={DATA_KEY.POS_NUMBER}
                  size="20"
                  value={newData[DATA_KEY.POS_NUMBER] || ""}
                  onChange={handleValueChange}
                />
              </h5>
            </td>
          </tr>
        </table>
        <table width="100%">
          <tr>
            <td width="5%" height="50"></td>
            <td width="13%">
              <h5>價格*</h5>
            </td>
            <td width="13%">
              <h5>
                <input
                  type="number"
                  step="1"
                  min="0"
                  name={DATA_KEY.PRICE}
                  style={{ width: "5em" }}
                  value={newData[DATA_KEY.PRICE]}
                  onChange={handlePriceChange}
                />
              </h5>
            </td>
            <td width="12%" align="right">
              <h5>銷售上架*</h5>
            </td>
            <td width="12%">
              <div className="onoffswitch">
                <input
                  type="checkbox"
                  name={DATA_KEY.ONSALE}
                  className="onoffswitch-checkbox"
                  id="myonoffswitch"
                  tabIndex="0"
                  checked={newData[DATA_KEY.ONSALE]}
                  onChange={handleCheckboxChange}
                />
                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                  <span className="onoffswitch-inner"></span>
                  <span className="onoffswitch-switch"></span>
                </label>
              </div>
            </td>
            <td width="10%">
              <h5>卡路里cal</h5>
            </td>
            <td width="35%">
              <h5>
                <input
                  type="text"
                  name={DATA_KEY.CALORIES}
                  size="14"
                  value={newData[DATA_KEY.CALORIES]}
                  onChange={handleValueChange}
                />
              </h5>
            </td>
          </tr>
        </table>

        <table width="100%">
          <tr>
            <td width="5%" height="50"></td>
            <td width="13%">
              <div>
                <h5>
                  <input
                    type="checkbox"
                    name={DATA_KEY.GRP_SHOW}
                    checked={newData[DATA_KEY.GRP_SHOW]}
                    onChange={handleCheckboxChange}
                    style={{ zoom: "1.5" }}
                  />
                  顯示子選單
                </h5>
              </div>
            </td>
            <td width="35%">
              {newData[DATA_KEY.GRP_SHOW] && (
                <div className="d-flex ms-5">
                  <h5>選項組合(子選單)</h5>
                  <h5>
                    <select
                      name={DATA_KEY.GRP_NUMBER}
                      style={{ width: "150px" }}
                      value={newData[DATA_KEY.GRP_NUMBER]}
                      onChange={handleValueChange}
                    >
                      <option disabled defaultValue>
                        -- 選擇組合 --
                      </option>
                      {addGroupOptionList()}
                    </select>
                  </h5>
                </div>
              )}
            </td>
            <td width="15%"></td>
            <td width="32%"></td>
          </tr>
        </table>
        <table width="100%">
          <tr>
            <td width="5%" height="50"></td>
            <td width="18%">
              <h5>選項明細顯示名稱*</h5>
            </td>
            <td width="77%">
              <h5>
                <input
                  type="text"
                  name={DATA_KEY.DISPLAY_NAME}
                  size="30"
                  value={newData[DATA_KEY.DISPLAY_NAME]}
                  onChange={handleValueChange}
                />
              </h5>
            </td>
          </tr>
          <tr>
            <td height="15"></td>
          </tr>
        </table>

        <table width="100%">
          <tr>
            <td width="5%" height="30"></td>
            <td width="15%">
              <h5>
                <strong>第三方平台設定</strong>
              </h5>
            </td>
            <td width="80%">
              <h6>
                <strong>(空白依原定價格)</strong>
              </h6>
            </td>
          </tr>
        </table>

        <table width="100%">
          <tr>
            <td width="5%" height="32"></td>
            <td width="8%" height="32">
              <h5>Ubereats</h5>
            </td>
            <td width="6%" height="32" align="right">
              <h5>價格</h5>
            </td>
            <td width="18%" height="32">
              <h5>
                <input
                  type="number"
                  step="1"
                  name={DATA_KEY.UBER_PRICE}
                  min="0"
                  style={{ width: "5em" }}
                  value={newData[DATA_KEY.UBER_PRICE]}
                  onChange={handlePriceChange}
                />
              </h5>
            </td>
            <td width="8%" height="32">
              <h5>Foodpanda</h5>
            </td>
            <td width="6%" height="32" align="right">
              <h5>價格</h5>
            </td>
            <td width="49%" height="32">
              <h5>
                <input
                  type="number"
                  step="1"
                  name={DATA_KEY.FP_PRICE}
                  min="0"
                  style={{ width: "5em" }}
                  value={newData[DATA_KEY.FP_PRICE]}
                  onChange={handlePriceChange}
                />
              </h5>
            </td>
          </tr>
        </table>
        {/* 訊息提示框*/}
        <AlertWindow
          isOpen={isMessageWindowOpen}
          onClose={() => setIsMessageWindowOpen(false)}
        >
          {alertMessage}
        </AlertWindow>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xs-12 col-md-12" align="center">
          <table width="100%">
            <tr>
              <td width="5%" height="60"></td>
              <td width="25%" style={{ color: "#F90" }}>
                <h4>[2B.選項明細資料]</h4>
              </td>
              <td width="35%"></td>
              <td width="15%">
                <img
                  src={add_1}
                  alt="add_item"
                  style={{ width: "118", height: "46" }}
                  onClick={() => handleOpenModifyWindow(null)}
                />
              </td>
              <td width="20%"></td>
            </tr>
          </table>
          <table width="100%">
            <tr>
              <td width="5%" height="50"></td>
              <td width="50%" height="50">
                <h5>
                  <span className="mr-1" style={{ backgroundColor: "#C9C" }}>
                    選項類別選查
                  </span>
                  <select
                    className="select"
                    name="addk_no"
                    value={addKindFilter}
                    onChange={handleSelectAddKind}
                  >
                    <option
                      value={addKindFilterInitialValue}
                    >{`<全部>`}</option>
                    {addKindOptionList()}
                  </select>
                </h5>
              </td>

              <td width="25%">
                <div className="d-flex align-items-center justify-content-end">
                  <img
                    src={search_1}
                    alt="search"
                    style={{ width: "30", height: "30" }}
                    className="mr-1"
                  />
                  <h5 className="my-0">
                    <input
                      type="text"
                      name="ser_txt"
                      size="20"
                      placeholder="搜尋"
                      vaelue={searchBarValue}
                      onChange={handleChangeSearchBarValue}
                    />
                  </h5>
                </div>
              </td>
              <td width="20%"></td>
            </tr>
            <tr>
              <td height="10"></td>
            </tr>
          </table>
          <table width="100%">
            <tr>
              <td width="5%"></td>
              <td width="75%">
                <MainTableList />
              </td>
              <td width="20%"></td>
            </tr>
          </table>
        </div>
      </div>
      <Dialog
        open={isDataModifyWindowOpen}
        onClose={handleDataModifyWindowClose}
        maxWidth="lg"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              padding: "50px",
            },
          },
        }}
      >
        <DataModifyWindow
          handleSaveData={handleSaveData}
          onClose={handleDataModifyWindowClose}
        />
        <IconButton
          aria-label="close"
          onClick={handleDataModifyWindowClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Dialog>
    </div>
  );
};

export default AddList;
