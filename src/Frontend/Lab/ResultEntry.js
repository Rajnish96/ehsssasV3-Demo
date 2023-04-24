import React, { useEffect, useRef, useState } from "react";
import { DatePickers } from "../../ChildComponents/DatePicker";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import { SearchBy } from "../../ChildComponents/Constants";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import BootTable from "../../Table/RETable";
import Loading from "../util/Loading";
import { Table } from "react-bootstrap";
import { isChecked } from "../util/Commonservices";
import InvestigationRange from "./../../Master/Investigations Master/InvestigationRange";
import { toast } from "react-toastify";
import ResultEntryEditModal from "../util/ResultEntryEditModal";
import ResultEditAddModal from "../util/ResultEditAddModal";
import { dateConfig } from "../util/DateConfig";
import TemplateMasterModal from "../util/TemplateMasterModal";

const ResultEntry = () => {
  const [CentreData, setCentreData] = useState([]);
  const [RateData, setRateData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [ResultTestData, setResultTestData] = useState([]);
  const [ResultData, setResultData] = useState([]);
  const [HiddenDropDownHelpMenu, setHiddenDropDownHelpMenu] = useState(false);
  const [indexMatch, setIndexMatch] = useState(0);
  const [helpmenu, setHelpMenu] = useState([]);
  const [DlcCheckChecked, setDlcCheckChecked] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [show, setShow] = useState({
    moadal: false,
    data: {},
  });
  const [PreviousTestResult, setPreviousTestResult] = useState([]);
  const [show2, setShow2] = useState({
    moadal: false,
    data: {},
  });

  const [show3, setShow3] = useState({
    modal: false,
    data: {},
  });

  console.log(show3);
  const [mouseHover, setMouseHover] = useState({
    index: -1,
    data: [],
  });

  const [toggleDate, setToggleDate] = useState({
    FromDate: false,
    ToDate: false,
  });
  const [redata, SetReData] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    FromDate: moment(new Date()).format("DD/MMM/YYYY"),
    ToDate: moment(new Date()).format("DD/MMM/YYYY"),
    CentreID: "",
    ItemValue: "",
    RateID: "",
    SelectTypes: "",
    RefundFilter: null,
    FromTime: "00:00:00",
    ToTime: "23:59:59",
    DoctorReferal: "",
    DepartmentID: "",
  });

  const validation = () => {
    let error = "";
    if (formData.SelectTypes === "Mobile") {
      if (formData.ItemValue.length !== 10) {
        error = { ...error, ItemValue: "Invalid Mobile Number" };
      }
    }

    if (
      moment(formData.FromDate).isAfter(
        moment(new Date()).format("DD/MMM/YYYY")
      )
    ) {
      error = { ...error, FromDate: "Date is Invalid" };
    }

    if (
      moment(formData.ToDate).isAfter(moment(new Date()).format("DD/MMM/YYYY"))
    ) {
      error = { ...error, ToDate: "Date is Invalid" };
    } else if (moment(formData.FromDate).isAfter(moment(formData.FromDate))) {
      error = {
        ...error,
        ToDate: "Date Must be Greater Then Or Equal to From Date",
      };
    }
    if (formData.FromDate === moment(new Date()).format("DD/MMM/YYYY")) {
      if (formData.FromTime > moment(new Date()).format("hh:mm:ss ")) {
        error = { ...error, FromTime: "Time is Invalid" };
      }
    }

    if (formData.ToDate === moment(new Date()).format("DD/MMM/YYYY")) {
      if (formData.ToTime < formData.FromTime) {
        error = { ...error, ToTime: "Time Must be Less than From Time" };
      }
    }

    return error;
  };

  const myRefs = useRef([]);

  const handleKeyUp = (e, targetElem) => {
    if (e.key === "Enter" && targetElem) {
      targetElem.focus();
    }
  };

  const handleToggle = (name) => {
    setToggleDate({ ...toggleDate, [name]: !toggleDate[name] });
  };

  const dateSelect = (date, name) => {
    setFormData({
      ...formData,
      [name]: moment(date).format("DD/MMM/YYYY"),
    });
    handleToggle(name);
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setFormData({ ...formData, [name]: event.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getAccessCentres = () => {
    axios
      .get("/api/v1/Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const getAccessRateType = () => {
    axios
      .get("/api/v1/RateType/getAccessRateType")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.RateTypeID,
            label: ele.Rate,
          };
        });
        setRateData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const handleSave = (data, modal) => {
    if (modal === "Edit") {
      if (Number(data?.MinValue) >= Number(data?.MaxValue)) {
        toast.error("Please Enter Correct Min and Max Value");
      } else {
        let val = ResultData.map((ele) => {
          if (ele.labObservationID == data?.labObservationID) {
            return {
              ...ele,
              DisplayReading: data?.DisplayReading,
              MinValue: data?.MinValue,
              MaxValue: data?.MaxValue,
              ReadingFormat: data?.ReadingFormat,
              SaveRangeStatus: 1,
            };
          } else {
            return ele;
          }
        });
        setResultData(val);
        setShow({ moadal: false, data: {} });
      }
    }

    if (modal === "AddComment") {
      let val = ResultData.map((ele) => {
        if (ele.InvestigationID == data?.InvestigationID) {
          return {
            ...ele,
            COMMENT: data?.COMMENT,
            SaveRangeStatus: 1,
          };
        } else {
          return ele;
        }
      });
      setResultData(val);
      setShow2({ moadal: false, data: {} });
    }

    if (modal === "TemplateMaster") {
      let val = ResultData.map((ele) => {
        if (ele.InvestigationID == data?.InvestigationID) {
          return {
            ...ele,
            COMMENT: data?.COMMENT,
          };
        } else {
          return ele;
        }
      });
      setResultData(val);
      setShow3({ moadal: false, data: {} });
    }
  };

  console.log(ResultData);

  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartmentData")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  const TableData = (status) => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoading(true);
      axios
        .post("/api/v1/RE/GetResultEntry", {
          CentreID: formData.CentreID,
          SelectTypes: formData.SelectTypes,
          ItemValue: formData.ItemValue,
          RateTypeID: formData.RateID,
          DoctorReferal: formData.DoctorReferal,
          FromDate: formData.FromDate,
          ToDate: formData.ToDate,
          FromTime: formData.FromTime,
          ToTime: formData.ToTime,
          DepartmentID: formData.DepartmentID,
          SampleStatus: status,
        })
        .then((res) => {
          SetReData(res?.data?.message);
          setStatusValue(status);
          setLoad(true);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
  };

  const GetResultEntry = (LedgerTransactionID, loading) => {
    if (loading) {
      loading(true);
    }
    axios
      .post("/api/v1/RE/GetResultEntryData", {
        LedgerTransactionID: LedgerTransactionID,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              isChecked: ele?.Status === 5 ? false : true,
              RerunIscheck: false,
              SaveRangeStatus: 0,
            };
          });
          setResultData(val);
          const dataTestHeader = res?.data?.TestHeader;
          const valTestHeader = dataTestHeader?.map((ele) => {
            return {
              ...ele,
              isChecked: ele?.Status === 5 ? false : true,
            };
          });

          setResultTestData(valTestHeader);

          if (loading) {
            loading(false);
          }
        } else {
          toast.error("No Data Found");
          if (loading) {
            loading(false);
          }
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        if (loading) {
          loading(false);
        }
      });
  };

  console.log(ResultTestData);

  const ApplyFormula = () => {
    if (ResultData.length) {
      for (let i = 0; i < ResultData.length; i++) {
        var Formula = "";
        Formula = ResultData[i].Formula;
        if (Formula != "") {
          for (var j = 0; j < ResultData.length; j++) {
            try {
              var aa = ResultData[j].Value;
              if (aa == "") {
                aa = "0";
              }
              if (ResultData[i].ReportType == "1")
                console.log(ResultData[j].labObservationID + "&");
              Formula = Formula.replace(
                ResultData[j].labObservationID + "&",
                aa
              );
            } catch (e) {}
          }

          try {
            var vv = Math.round(eval(Formula) * 100) / 100;
            if (vv == "0") {
              ResultData[i].Value = "";
            } else {
              ResultData[i].Value = vv;
            }
          } catch (e) {
            ResultData[i].Value = "";
          }
          var ans = ResultData[i].Value;
          if (
            parseFloat(ResultData[i].Value) >
            parseFloat(ResultData[i]["MaxValue"])
          ) {
            ResultData[i]["Flag"] = "High";
          }
          if (
            parseFloat(ResultData[i].Value) <
            parseFloat(ResultData[i]["MinValue"])
          ) {
            ResultData[i]["Flag"] = "Low";
          }

          if (
            parseFloat(ResultData[i].Value) >=
              parseFloat(ResultData[i]["MinValue"]) &&
            parseFloat(ResultData[i].Value) <=
              parseFloat(ResultData[i]["MaxValue"])
          ) {
            ResultData[i]["Flag"] = "Normal";
          }

          if (ResultData[i].Value === "") {
            ResultData[i]["Flag"] = "";
          }

          if (isNaN(ans) || ans == "Infinity") {
            ResultData[i].Value = "";
          }
        }
      }
    }
  };

  const handleCheckbox = (e, index, testid) => {
    const data = [...ResultData];
    const dataTestHeader = [...ResultTestData];
    const { value, checked, type, name } = e.target;
    if (index >= 0) {
      data[index][name] = type === "checkbox" ? checked : value;
      if (name === "Value" && type === "text") {
        if (parseFloat(value) > parseFloat(data[index]["MaxValue"])) {
          data[index]["Flag"] = "High";
        }
        if (parseFloat(value) < parseFloat(data[index]["MinValue"])) {
          data[index]["Flag"] = "Low";
        }

        if (
          parseFloat(value) >= parseFloat(data[index]["MinValue"]) &&
          parseFloat(value) <= parseFloat(data[index]["MaxValue"])
        ) {
          data[index]["Flag"] = "Normal";
        }

        if (value === "") {
          data[index]["Flag"] = "";
        }
      }
      setResultData(data);
    } else {
      const val = data.map((ele) => {
        if (testid === ele?.TestID) {
          return {
            ...ele,
            [name]: checked,
          };
        } else {
          return ele;
        }
      });

      const valTestHeader = dataTestHeader?.map((ele) => {
        if (testid === ele?.TestID) {
          return {
            ...ele,
            isChecked: checked,
          };
        } else {
          return ele;
        }
      });
      setResultTestData(valTestHeader);
      setResultData(val);
    }
    ApplyFormula();
  };

  const getHelpMenuData = (e, labObservationId) => {
    setHiddenDropDownHelpMenu(true);
    axios
      .post("/api/v1/RE/getHelpMenuInvestigationWise", {
        InvestigationID: labObservationId,
      })
      .then((res) => {
        setHelpMenu(res.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleIndex = (e, index) => {
    const { name } = e.target;
    switch (name) {
      case "Value":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(helpmenu.length - 1);
            }
            break;
          case 40:
            if (helpmenu.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            handleListSearch(helpmenu[indexMatch], name, index);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;

      default:
        break;
    }
  };

  const handleListSearch = (data, name, index) => {
    const val = [...ResultData];
    val[index][name] = data.label;
    setResultData(val);
    setHelpMenu([]);
    setHiddenDropDownHelpMenu(false);
  };

  const fetchApi = (field, payload) => {
    const val = ResultTestData.filter((ele) => ele.isChecked === true);
    setLoading(true);
    axios
      .post("/api/v1/RE/SaveResultEntry", {
        data: payload,
        ResultStatus: field,
        HeaderInfo: val,
      })
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message);
        setResultData([]);
      })
      .catch((err) => {
        if (err.response.status === 504) {
          toast.error("Something went wrong");
        }
        if (err.response.status === 401) {
          toast.error(err.response.data.message);
        }
        setLoading(false);
        setResultData([]);
      });
  };

  const handleResultSubmit = (field) => {
    const payload = ResultData.filter((ele) => ele.isChecked === true);
    if (payload?.length > 0) {
      let showMessage = "All Required fields are mandatory...";
      let flag = 1;
      let DlcSum = 0;
      for (var i = 0; i < payload.length > 0; i++) {
        if (
          payload[i].dlcCheck == "1" &&
          DlcCheckChecked &&
          payload[i].InvestigationID === 370
        ) {
          DlcSum =
            parseFloat(DlcSum) +
            parseFloat(payload[i].Value === "" ? 0 : payload[i].Value);
        }
        if (payload[i].isMandatory === 1 && payload[i].Value == "") {
          flag = 0;
        }
      }

      if (flag == 1) {
        if (DlcCheckChecked) {
          if (DlcSum !== 100) {
            toast.error("please Enter Valid Value");
          } else {
            fetchApi(field, payload);
          }
        } else {
          fetchApi(field, payload);
        }
      } else {
        toast.error(showMessage);
      }
    } else {
      toast.error("Please select atlease one test to continue...");
    }
  };

  const DeltaResponse = (data) => {
    axios
      .post("/api/v1/RE/DeltaCheck", {
        TestID: data?.TestID,
        LabObservation_ID: data?.labObservationID,
      })
      .then((res) => {
        const data = res.data.message;
        if (data.length > 0) {
          setPreviousTestResult(data);
        } else {
          setPreviousTestResult([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAccessCentres();
    getAccessRateType();
    getDepartment();
  }, []);

  return (
    <div
      className="content-wrapper"
      style={{ minHeight: "955.604px" }}
      data-select2-id="18"
    >
      {ResultData.length === 0 ? (
        <div className="container-fluid" style={{ padding: "10px" }}>
          {/* <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Patient Lab Search</a>
            </li>
            <li className="breadcrumb-item active"></li>
          </ol> */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <span className="m-0 font-weight-bold text-primary">
                Result Entry
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-4 form-group">
                  <label className="control-label" htmlFor="Title">
                    Search By
                  </label>
                  <div className="d-flex">
                    <div style={{ flexBasis: "70%" }}>
                      <SelectBox
                        options={SearchBy}
                        formdata={formData.SelectTypes}
                        name="SelectTypes"
                        onChange={handleSelectChange}
                      />
                    </div>
                    <div>
                      <div style={{ flexBasis: "50%" }}>
                        <Input
                          className="select-input-box form-control"
                          type="text"
                          name="ItemValue"
                          value={formData.ItemValue}
                          onChange={handleChange}
                        />
                        {errors?.ItemValue && (
                          <span className="golbal-Error">
                            {errors?.ItemValue}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-2  form-group">
                  <label className="control-label" htmlFor="CentreID">
                    Centre
                  </label>
                  :
                  <SelectBox
                    options={CentreData}
                    formdata={formData.CentreID}
                    name="CentreID"
                    onChange={handleSelectChange}
                  />
                  <span
                    className="text-danger field-validation-valid"
                    data-valmsg-for="CentreID"
                    data-valmsg-replace="true"
                  ></span>
                </div>
                <div className="col-sm-2 form-group">
                  <label className="control-label" htmlFor="RateTypeID">
                    Rate Type
                  </label>
                  :
                  <SelectBox
                    options={RateData}
                    formdata={formData.RateID}
                    name="RateID"
                    onChange={handleSelectChange}
                  />
                </div>

                <div className="col-sm-2  form-group">
                  <label className="control-label" htmlFor="DepartmentId">
                    Department
                  </label>
                  :
                  <SelectBox
                    options={DepartmentData}
                    formdata={formData.DepartmentID}
                    name="DepartmentID"
                    onChange={handleSelectChange}
                  />
                  <span
                    className="text-danger field-validation-valid"
                    data-valmsg-for="CentreID"
                    data-valmsg-replace="true"
                  ></span>
                </div>

                <div className="col-sm-2  form-group">
                  <label className="control-label">DoctorReferal</label>
                  <Input
                    className="form-control ui-autocomplete-input"
                    type="text"
                    name="DoctorReferal"
                    value={formData.DoctorReferal}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-sm-2  form-group">
                  <label className="control-label">Search Test</label>
                  <Input
                    className="form-control ui-autocomplete-input"
                    type="text"
                    name="DoctorReferal"
                    value={formData.DoctorReferal}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-sm-2  form-group">
                  <label className="control-label" htmlFor="DepartmentId">
                    Date Type Search
                  </label>
                  :
                  <SelectBox
                    options={DepartmentData}
                    formdata={formData.DepartmentID}
                    name="DepartmentID"
                    onChange={handleSelectChange}
                  />
                  <span
                    className="text-danger field-validation-valid"
                    data-valmsg-for="CentreID"
                    data-valmsg-replace="true"
                  ></span>
                </div>
                <div className="col-sm-2 form-group">
                  <label className="control-label">From Date:</label>
                  <div>
                    <input
                      type="text"
                      className="form-control pull-right reprint-date"
                      id="reservation"
                      onClick={() => {
                        handleToggle("FromDate");
                      }}
                      value={formData?.FromDate}
                      name="FromDate"
                      onChange={handleChange}
                    />
                    {errors?.FromDate && (
                      <span className="golbal-Error">{errors?.FromDate}</span>
                    )}
                  </div>

                  {toggleDate.FromDate && (
                    <div className="calendra-new">
                      <DatePickers
                        dateSelect={dateSelect}
                        select={formData.FromDate}
                        name="FromDate"
                      />
                    </div>
                  )}
                </div>
                <div className="col-sm-2 form-group">
                  <label className="control-label">From Time:</label>
                  <div>
                    <Input
                      className="form-control pull-right  reprint-date"
                      type="time"
                      name="FromTime"
                      value={formData.FromTime}
                      onChange={handleChange}
                      step="2"
                    />
                    {errors?.FromTime && (
                      <span className="golbal-Error">{errors?.FromTime}</span>
                    )}
                  </div>
                </div>
                <div className="col-sm-2 form-group">
                  <label className="control-label">To Date:</label>
                  <div>
                    <input
                      type="text"
                      className="form-control pull-right reprint-date"
                      id="reservation"
                      onClick={() => {
                        handleToggle("ToDate");
                      }}
                      value={formData?.ToDate}
                      onChange={handleChange}
                      name="ToDate"
                    />{" "}
                    {errors?.ToDate && (
                      <span className="golbal-Error">{errors?.ToDate}</span>
                    )}
                  </div>

                  {toggleDate.ToDate && (
                    <div className="calendra-new">
                      <DatePickers
                        dateSelect={dateSelect}
                        select={formData.ToDate}
                        name="ToDate"
                        minDate={formData.FromDate}
                      />
                    </div>
                  )}
                </div>
                <div className="col-sm-2 form-group">
                  <label className="control-label">To Time:</label>
                  <div>
                    <Input
                      className="form-control pull-right  reprint-date"
                      type="time"
                      name="ToTime"
                      value={formData.ToTime}
                      onChange={handleChange}
                      step="2"
                    />
                    {errors?.ToTime && (
                      <span className="golbal-Error">{errors?.ToTime}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="row" style={{ marginTop: "5px" }}>
                <div className="col-sm-1">
                  <a
                    href="javascript:void 0"
                    onClick={() => TableData("")}
                    className="foreColor"
                  >
                    <div className="form-group Status-0 center round">
                      Search
                    </div>
                  </a>
                </div>
                <div className="col-sm-1 form-group col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void 0"
                    onClick={() => TableData(1)}
                    className="foreColor"
                  >
                    <div className="form-group Status-1 center round">
                      Not Collected
                    </div>
                  </a>
                </div>
                <div className="col-sm-1 form-group col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void 0"
                    onClick={() => TableData(2)}
                    className="foreColor"
                  >
                    <div className="form-group Status-2 center round">
                      Collected
                    </div>
                  </a>
                </div>
                <div className="col-sm-1 form-group col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void 0"
                    onClick={() => TableData(3)}
                    className="foreColor"
                  >
                    <div className="form-group Status-3 center round">
                      Receive
                    </div>
                  </a>
                </div>

                <div className="col-sm-1 form-group col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void 0"
                    onClick={() => TableData(4)}
                    className="foreColor"
                  >
                    <div className="form-group Status-4 center round">
                      Rejected
                    </div>
                  </a>
                </div>
                <div className="col-sm-1 form-group col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void"
                    onClick={() => TableData(10)}
                    className="foreColor"
                  >
                    <div className="form-group Status-10 center round">
                      Result Done
                    </div>
                  </a>
                </div>
                <div className="col-sm-1 form-group col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void;"
                    onClick={() => TableData(5)}
                    className="foreColor"
                  >
                    <div className="form-group Status-5 center round">
                      Approved
                    </div>
                  </a>
                </div>
                <div className="col-sm-1 form-group col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void;"
                    onClick={() => TableData(11)}
                    className="foreColor"
                  >
                    <div className="form-group Status-11 center round">
                      Hold
                    </div>
                  </a>
                </div>
                <div className="col-sm-1 form-group col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void;"
                    onClick={() => TableData(14)}
                    className="foreColor"
                  >
                    <div className="form-group Status-14 center round">
                      Re-Run
                    </div>
                  </a>
                </div>
                <div className="col-sm-1 form-group col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void;"
                    onClick={() => TableData(13)}
                    className="foreColor"
                  >
                    <div className="form-group Status-13 center round">
                      Mac Data1
                    </div>
                  </a>
                </div>
                <div className="col-sm-1 form-group col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void;"
                    onClick={() => TableData(15)}
                    className="foreColor"
                  >
                    <div className="form-group Status-15 center round">
                      Dispatched
                    </div>
                  </a>
                </div>

                <div className="col-sm-1 form-group col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void;"
                    onClick={() => TableData(99)}
                    className="foreColor"
                  >
                    <div className="form-group Status-all center round">
                      All
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            load && (
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <span className="m-0 font-weight-bold text-primary">
                    Search Results
                  </span>
                </div>
                <div className="card-body">
                  <BootTable redata={redata} GetResultEntry={GetResultEntry} />
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        //  result
        <div className="container-fluid" style={{ padding: "10px" }}>
          {show.moadal && (
            <ResultEntryEditModal
              show={show}
              handleClose={() => {
                setShow({ moadal: false, data: {} });
              }}
              handleSave={handleSave}
            />
          )}

          {show2.moadal && (
            <ResultEditAddModal
              show={show2}
              handleClose={() => {
                setShow2({ moadal: false, data: {} });
              }}
              handleSave={handleSave}
            />
          )}

          {show3?.modal && (
            <TemplateMasterModal
              show={show3}
              handleClose={() => {
                setShow3({ modal: false, data: {} });
              }}
              handleSave={handleSave}
            />
          )}

          <div className="card shadow mb-4">
            <div className="card-header py-3 mb-4">
              <span className="m-0 font-weight-bold text-primary">
                Result Entry
              </span>
            </div>

            <div className="card-header py-3 mx-3">
              <span className="m-0 font-weight-bold ">
                <div className="d-flex mb-2">
                  <div className="mx-2">
                    <span className="text-black"> SIN NO:</span>
                    <span className="mx-2" style={{ color: "#9a9797 " }}>
                      {ResultData[0]?.SINNo}
                    </span>
                  </div>

                  <div className="mx-2">
                    <span className="text-black"> Patient Name:</span>
                    <span className="mx-2" style={{ color: "#9a9797 " }}>
                      {" "}
                      {ResultData[0]?.PName}
                    </span>
                  </div>

                  <div className="mx-2">
                    <span className="text-black"> Patient Code: </span>
                    <span className="mx-2" style={{ color: "#9a9797 " }}>
                      {ResultData[0]?.PatientCode}
                    </span>
                  </div>

                  <div className="mx-2">
                    <span className="text-black"> Age / Gender: </span>
                    <span className="mx-2" style={{ color: "#9a9797 " }}>
                      {ResultData[0]?.Age}
                    </span>
                  </div>
                </div>
              </span>
            </div>
            <div className="d-flex mx-4 my-2">
              {ResultTestData?.map((data, index) => (
                <div
                  key={index}
                  className="font-weight-bold mx-2  px-3 py-2 "
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "#00BFFF",
                  }}
                >
                  {data?.PackageName}
                </div>
              ))}
            </div>
            <div className="card-body boottable">
              <Table responsive bordered>
                <thead className="text-center" style={{ zIndex: "99" }}>
                  <tr>
                    <th>#</th>
                    <th>TestName</th>
                    <th>Value</th>
                    <th>Comment</th>
                    <th>Flag</th>
                    <th>Mac Reading</th>
                    <th>MachineName</th>
                    <th>Method Name</th>
                    <th>Ref Range</th>
                    <th>Unit</th>
                    <th>Action</th>
                    <th>Rerun</th>
                  </tr>
                </thead>
                <tbody>
                  {ResultTestData?.map((Hdata, Hindex) => (
                    <>
                      <tr key={Hindex} style={{ backgroundColor: "#dddfeb" }}>
                        <td colSpan={11}>
                          <div className="d-flex align-items-center mx-2 p-2">
                            <Input
                              type="checkbox"
                              onChange={(e) =>
                                handleCheckbox(e, -1, Hdata.TestID)
                              }
                              checked={
                                ResultData?.length > 0
                                  ? isChecked(
                                      "isChecked",
                                      ResultData,
                                      true,
                                      Hdata.TestID
                                    ).includes(false)
                                    ? false
                                    : true
                                  : false
                              }
                              disabled={Hdata?.Status === 5 && true}
                              name="isChecked"
                            />
                            <p className="m-0">{Hdata?.PackageName}</p>

                            {(Hdata?.Status === 3 ||
                              Hdata.Status === 10 ||
                              Hdata?.Status === 14) && (
                              <>
                                <button className="btn btn-primary mx-4">
                                  Add Report
                                </button>
                                <button className="btn btn-primary mx-4">
                                  Add Attachment
                                </button>
                                <button className="btn btn-primary mx-4">
                                  Add Comment
                                </button>
                              </>
                            )}
                            {Hdata?.PackageName ===
                              "CBC, Complete blood count" && (
                              <>
                                <Input
                                  type="checkbox"
                                  checked={DlcCheckChecked}
                                  onChange={(e) => {
                                    setDlcCheckChecked(e?.target?.checked);
                                  }}
                                />
                                <label style={{ alignSelf: "flex-end" }}>
                                  Delta Check
                                </label>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <Input
                            type="checkbox"
                            onChange={(e) =>
                              handleCheckbox(e, -1, Hdata.TestID)
                            }
                            checked={
                              ResultData?.length > 0
                                ? isChecked(
                                    "RerunIscheck",
                                    ResultData,
                                    true,
                                    Hdata.TestID
                                  ).includes(false)
                                  ? false
                                  : true
                                : false
                            }
                            name="RerunIscheck"
                          />
                        </td>
                      </tr>
                      {ResultData?.map((datanew, index) => (
                        <>
                          {Hdata.TestID === datanew.TestID && (
                            <tr key={index}>
                              <td>
                                <Input
                                  type="checkbox"
                                  checked={datanew?.isChecked}
                                  onChange={(e) => handleCheckbox(e, index)}
                                  name="isChecked"
                                  disabled={true}
                                />
                              </td>
                              <td>
                                <span
                                  className={`${
                                    datanew?.isMandatory === 1 ? "required" : ""
                                  } `}
                                >
                                  {datanew?.TestName}
                                </span>
                              </td>

                              {datanew?.Header === 0 ? (
                                <>
                                  {datanew?.ReportType === "2" ? (
                                    <td
                                      style={{
                                        fontSize: "15px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        setShow3({
                                          modal: true,
                                          data: datanew,
                                        })
                                      }
                                    >
                                      +
                                    </td>
                                  ) : datanew?.dlcCheck === 1 ? (
                                    datanew?.IsHelpMenu === 0 ? (
                                      <td>
                                        <input
                                          type="text"
                                          className={`form-control ${
                                            parseFloat(datanew?.Value) >
                                            parseFloat(datanew?.MaxValue)
                                              ? "high"
                                              : parseFloat(datanew?.Value) <
                                                parseFloat(datanew?.MinValue)
                                              ? "low"
                                              : ""
                                          } ${
                                            datanew?.dlcCheck === 1
                                              ? "bg-warning"
                                              : ""
                                          }`}
                                          name="Value"
                                          value={datanew?.Value}
                                          onChange={(e) =>
                                            handleCheckbox(
                                              e,
                                              index,
                                              "",
                                              datanew?.MinValue,
                                              datanew?.MaxValue
                                            )
                                          }
                                          onKeyUp={(e) =>
                                            handleKeyUp(
                                              e,
                                              myRefs.current[
                                                index === ResultData.length - 1
                                                  ? 0
                                                  : index + 1
                                              ]
                                            )
                                          }
                                          ref={(el) =>
                                            (myRefs.current[index] = el)
                                          }
                                        />
                                      </td>
                                    ) : (
                                      <td>
                                        <input
                                          type="text"
                                          className={`form-control ${
                                            parseFloat(datanew?.Value) >
                                            parseFloat(datanew?.MaxValue)
                                              ? "high"
                                              : parseFloat(datanew?.Value) <
                                                parseFloat(datanew?.MinValue)
                                              ? "low"
                                              : ""
                                          }`}
                                          name="Value"
                                          value={datanew?.Value}
                                          onChange={(e) =>
                                            handleCheckbox(
                                              e,
                                              index,
                                              "",
                                              datanew?.MinValue,
                                              datanew?.MaxValue
                                            )
                                          }
                                          onKeyUp={(e) =>
                                            handleKeyUp(
                                              e,
                                              myRefs.current[
                                                index === ResultData.length - 1
                                                  ? 0
                                                  : index + 1
                                              ]
                                            )
                                          }
                                          ref={(el) =>
                                            (myRefs.current[index] = el)
                                          }
                                        />
                                      </td>
                                    )
                                  ) : datanew?.IsHelpMenu === 0 ? (
                                    <td>
                                      <input
                                        type="text"
                                        className={`form-control ${
                                          parseFloat(datanew?.Value) >
                                          parseFloat(datanew?.MaxValue)
                                            ? "high"
                                            : parseFloat(datanew?.Value) <
                                              parseFloat(datanew?.MinValue)
                                            ? "low"
                                            : ""
                                        }`}
                                        name="Value"
                                        value={datanew?.Value}
                                        onChange={(e) =>
                                          handleCheckbox(
                                            e,
                                            index,
                                            "",
                                            datanew?.MinValue,
                                            datanew?.MaxValue
                                          )
                                        }
                                        onKeyUp={(e) =>
                                          handleKeyUp(
                                            e,
                                            myRefs.current[
                                              index === ResultData.length - 1
                                                ? 0
                                                : index + 1
                                            ]
                                          )
                                        }
                                        ref={(el) =>
                                          (myRefs.current[index] = el)
                                        }
                                      />
                                    </td>
                                  ) : (
                                    <td>
                                      <div style={{ position: "relative" }}>
                                        <input
                                          type="text"
                                          className={`form-control ${
                                            parseFloat(datanew?.Value) >
                                            parseFloat(datanew?.MaxValue)
                                              ? "high"
                                              : parseFloat(datanew?.Value) <
                                                parseFloat(datanew?.MinValue)
                                              ? "low"
                                              : ""
                                          }`}
                                          name="Value"
                                          value={datanew?.Value}
                                          onChange={(e) =>
                                            handleCheckbox(
                                              e,
                                              index,
                                              "",
                                              datanew?.MinValue,
                                              datanew?.MaxValue
                                            )
                                          }
                                          onKeyDown={(e) => {
                                            getHelpMenuData(
                                              e,
                                              datanew?.labObservationID
                                            );
                                            handleIndex(e, index);
                                          }}
                                          onKeyUp={(e) =>
                                            handleKeyUp(
                                              e,
                                              myRefs.current[
                                                index === ResultData.length - 1
                                                  ? 0
                                                  : index + 1
                                              ]
                                            )
                                          }
                                          ref={(el) =>
                                            (myRefs.current[index] = el)
                                          }
                                        />

                                        {helpmenu.length > 0 &&
                                          helpmenu[0]?.Value ==
                                            datanew?.labObservationID &&
                                          HiddenDropDownHelpMenu && (
                                            <ul
                                              className="suggestion-data"
                                              style={{
                                                width: "100%",
                                                right: "0px",
                                                border: "1px solid #dddfeb",
                                              }}
                                            >
                                              {helpmenu.map(
                                                (data, helpmenuindex) => (
                                                  <li
                                                    onClick={() =>
                                                      handleListSearch(
                                                        data,
                                                        "Value",
                                                        index
                                                      )
                                                    }
                                                    key={helpmenuindex}
                                                    className={`${
                                                      helpmenuindex ===
                                                        indexMatch &&
                                                      "matchIndex"
                                                    }`}
                                                  >
                                                    {data?.label}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          )}
                                      </div>
                                    </td>
                                  )}
                                  {datanew?.ReportType === "2" ? (
                                    <td></td>
                                  ) : (
                                    <td style={{ position: "relative" }}>
                                      <div className="d-flex align-items-center">
                                        <div
                                          className="mx-2"
                                          style={{
                                            cursor: "pointer",
                                            fontSize: "15px",
                                          }}
                                          onClick={() =>
                                            setShow2({
                                              moadal: true,
                                              data: datanew,
                                            })
                                          }
                                        >
                                          {" "}
                                          +
                                        </div>
                                        <span
                                          class="fa fa-exclamation-triangle mx-2"
                                          aria-hidden="true"
                                          style={{
                                            cursor: "pointer",
                                            fontSize: "15px",
                                            width: "35px",
                                            padding: "5px 10px",
                                          }}
                                          onMouseEnter={() => {
                                            setMouseHover({
                                              index: index,
                                              data: [],
                                            });
                                            DeltaResponse(datanew);
                                          }}
                                          onMouseLeave={() => {
                                            setMouseHover({
                                              index: -1,
                                              data: [],
                                            });
                                          }}
                                        >
                                          {mouseHover?.index === index &&
                                            PreviousTestResult.length > 0 && (
                                              <div
                                                style={{
                                                  position: "absolute",
                                                  width: "650px",
                                                  left: "60px",
                                                }}
                                                className="resultEntryCssTable"
                                              >
                                                <Table striped>
                                                  <thead>
                                                    <tr>
                                                      <th>Booking Date</th>
                                                      <th>Test</th>
                                                      <th>Value</th>
                                                      <th>Unit</th>
                                                      <th>Min</th>
                                                      <th>Max</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {PreviousTestResult.map(
                                                      (ele, index) => (
                                                        <tr key={index}>
                                                          <td>
                                                            {dateConfig(
                                                              ele?.BookingDate
                                                            )}
                                                          </td>
                                                          <td>
                                                            {ele?.LabObservationName
                                                              ? ele?.LabObservationName
                                                              : "-"}
                                                          </td>
                                                          <td>
                                                            {ele?.Value
                                                              ? ele?.Value
                                                              : "-"}
                                                          </td>
                                                          <td>
                                                            {ele?.ReadingFormat
                                                              ? ele?.ReadingFormat
                                                              : "-"}
                                                          </td>
                                                          <td>
                                                            {ele?.MinValue
                                                              ? ele?.MinValue
                                                              : "-"}
                                                          </td>
                                                          <td>
                                                            {ele?.MaxValue
                                                              ? ele?.MaxValue
                                                              : "-"}
                                                          </td>
                                                        </tr>
                                                      )
                                                    )}
                                                  </tbody>
                                                </Table>
                                              </div>
                                            )}
                                        </span>
                                      </div>
                                    </td>
                                  )}
                                  {datanew?.ReportType === "2" ? (
                                    <td></td>
                                  ) : (
                                    <td>
                                      <select value={datanew?.Flag}>
                                        <option hidden></option>
                                        <option value="Normal">Normal</option>
                                        <option value="High">High</option>
                                        <option value="Low">Low</option>
                                      </select>
                                    </td>
                                  )}
                                  <td></td>
                                  <td></td>
                                  {datanew?.ReportType === "2" ? (
                                    <td></td>
                                  ) : (
                                    <td>{datanew?.MethodName}</td>
                                  )}
                                  {datanew?.ReportType === "2" ? (
                                    <td></td>
                                  ) : (
                                    <td>{datanew?.DisplayReading}</td>
                                  )}
                                  {datanew?.ReportType === "2" ? (
                                    <td></td>
                                  ) : (
                                    <td>{datanew?.ReadingFormat}</td>
                                  )}
                                  {datanew?.ReportType === "2" ? (
                                    <td></td>
                                  ) : (
                                    <td>
                                      <div
                                        className="text-primary"
                                        style={{
                                          cursor: "pointer",
                                          textDecoration: "underline",
                                        }}
                                        onClick={() =>
                                          setShow({
                                            moadal: true,
                                            data: datanew,
                                          })
                                        }
                                      >
                                        Edit
                                      </div>
                                    </td>
                                  )}
                                  <td>
                                    <Input
                                      type="checkbox"
                                      checked={datanew?.RerunIscheck}
                                      onChange={(e) => handleCheckbox(e, index)}
                                      name="RerunIscheck"
                                    />
                                  </td>
                                </>
                              ) : (
                                <td colSpan="10"></td>
                              )}
                            </tr>
                          )}
                        </>
                      ))}
                    </>
                  ))}
                </tbody>
              </Table>

              <div className="row mt-3" style={{ textWrap: "avoid" }}>
                {loading ? (
                  <div className="mx-3">
                    <Loading />
                  </div>
                ) : (
                  <div className="col-sm-12 col-xs-12">
                    <button
                      className="previous roundarrow btn-success mx-2"
                      onClick={() => {
                        ResultData.length > 0 &&
                          GetResultEntry(
                            ResultData[0]?.LedgerTransactionID - 1
                          );
                      }}
                    >
                      ‹
                    </button>
                    <button
                      className="next roundarrow btn-success mx-2"
                      onClick={() => {
                        ResultData.length > 0 &&
                          GetResultEntry(
                            ResultData[0]?.LedgerTransactionID + 1
                          );
                      }}
                    >
                      ›
                    </button>
                    {["", 3, 10, 11, 13, 14, 15].includes(statusValue) && (
                      <button
                        className="btn btn-primary mx-2 my-1"
                        onClick={() => handleResultSubmit("Save")}
                      >
                        Save
                      </button>
                    )}

                    <button
                      className="btn btn-primary mx-2 my-1"
                      type="button"
                      id="btnMainList"
                      onClick={() => {
                        setResultData([]);
                      }}
                    >
                      MainList
                    </button>
                    <select
                      className="my-1 mx-2"
                      id="ApprovalDoctor"
                      name="ApprovalDoctor"
                    >
                      <option value={1}>Admin</option>
                    </select>

                    <button
                      className="btn btn-success mx-2 my-1"
                      type="button"
                      id="btnMainList"
                    >
                      PrintReport
                    </button>

                    <button
                      className="btn btn-success mx-2 my-1"
                      type="button"
                      id="btnMainList"
                      onClick={() => handleResultSubmit("Approved")}
                    >
                      Approved
                    </button>

                    <button
                      className="btn btn-success mx-2 my-1"
                      type="button"
                      id="btnMainList"
                    >
                      Hold
                    </button>

                    <button
                      className="btn btn-success mx-2 my-1 "
                      type="button"
                      id="btnMainList"
                    >
                      Unhold
                    </button>

                    <button
                      className="btn btn-success mx-2 my-1"
                      type="button"
                      id="btnMainList"
                    >
                      Not approved
                    </button>

                    <button
                      className="btn btn-success mx-2 my-1"
                      type="button"
                      id="btnMainList"
                    >
                      Forward
                    </button>

                    <button
                      className="btn btn-success mx-2 my-1"
                      type="button"
                      id="btnMainList"
                    >
                      Preview
                    </button>
                    <button
                      className="btn btn-success mx-2 my-1"
                      type="button"
                      id="btnMainList"
                    >
                      Deltacheck
                    </button>
                    {/* <a className="btn btn-sm btn-outline-info" id="btnInnerUpload">
                  <span
                    title="Click Here To Upload the Document."
                    className="fas fa-paperclip"
                  >
                    (0)
                  </span>
                </a>
                <a
                  className="btn btn-sm btn-outline-info"
                  id="btnInnerHistory"
                />
                <a href="javacsript:void">See Medical History</a>
                (0)
                <a
                  className="btn btn-sm btn-outline-info btnControl"
                  id="btnRerun"
                  href="javascript:void(0);"
                  style={{ display: "none" }}
                >
                  Rerun Test
                </a> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultEntry;
