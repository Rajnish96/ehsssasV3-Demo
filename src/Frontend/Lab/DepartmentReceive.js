import React, { useEffect, useState } from "react";
import { DatePickers } from "../../ChildComponents/DatePicker";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import { SearchBy } from "../../ChildComponents/Constants";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import BootTable from "../../Table/DepartmentReceive";
import Loading from "../util/Loading";
import { toast } from "react-toastify";
import { stateIniti } from "../../ChildComponents/Constants";

const DepartmentReceive = () => {
  const [CentreData, setCentreData] = useState([]);
  const [RateData, setRateData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [toggleDate, setToggleDate] = useState({
    FromDate: false,
    ToDate: false,
  });
  const [drdata, setDrData] = useState([]);
  const [searchstatus, setSearchStatus] = useState([]);
  const [saveTestId, setSaveTestId] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState(stateIniti);
  const [collecteddataexist, SetCollectedDataExist] = useState([]);

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

  console.log(saveTestId);

  const validation = () => {
    let error = "";
    if (formData.SelectTypes === "Mobile") {
      if (formData.ItemValue.length !== 10) {
        error = { ...error, ItemValue: "Invalid Mobile Number" };
      }
    }
    // else if (formData.SelectTypes !== "") {
    //   error = { ...error, ItemValue: "This Field is Required" };
    // }

    if (formData.FromDate > moment(new Date()).format("DD/MMM/YYYY")) {
      error = { ...error, FromDate: "Date is Invalid" };
    }

    if (formData.ToDate > moment(new Date()).format("DD/MMM/YYYY")) {
      error = { ...error, ToDate: "Date is Invalid" };
    } else if (formData.ToDate < formData.FromDate) {
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

const handleBarcodeReceive=(e)=>{
  const keypress = [9, 13];
  if (keypress.includes(e.which)) {
    DirectReceivedByBarcode();
  }
}

const handleBarcodeNo=(e)=>{
  const { name, value } = e.target;
  setState({...state,[name]:value})
}
const DirectReceivedByBarcode=()=>{
  if(state.BarcodeNo.length>0)
  {
  axios
  .post("api/v1//DepartmentReceive/SampleReceiveBarcode",{
    BarcodeNo:state.BarcodeNo,
  }).then((res)=>{
    toast.success("Barcode Received Successfully");
    setState({...state,BarcodeNo:""});
    TableData("2");
  })
   .catch((err) => console.log(err));
 }
}

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

  const SaveSampleReceiveDepartment = (TestID) => {
    if(TestID.length>0)
    {
    axios
      .post("/api/v1/DepartmentReceive/SampleReceiveDepartment", {
        data: saveTestId,
      })
      .then((res) => {
        toast.success(res.data.message);
        TableData("2");
      })
      .catch((err) => {
        if (err.response.status === 504) {
          toast.error("Something went wrong");
        }
        if (err.response.status === 401) {
          toast.error(err.response.data.message);
        }
       
      });
    }
    else{
      toast.error("Please select atlease one item to continue...")
    }
  };

  const TableData = (status) => {
    setSearchStatus(status);
    console.log(searchstatus)
    const generatedError = validation();
    if (generatedError === "") {
      setLoading(true);
      axios
        .post("/api/v1/DepartmentReceive/DepartmentReceive", {
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
          setDrData(res?.data?.message);
          SetCollectedDataExist(res?.data?.message.some(v => (v.Status === 2)));
          setLoad(true);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
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
             Department Receive
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
                <label className="control-label">Barcode No</label>
                <Input
                  className="form-control"
                  name="BarcodeNo"
                  onKeyDown={handleBarcodeReceive}
                  value={state.BarcodeNo}
                  onChange={handleBarcodeNo}
                />
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
              <div className="col-sm-2">
                <a
                  href="javascript:void 0"
                  onClick={() => TableData("2")}
                  className="foreColor"
                >
                  <div className="form-group Status-0 center round">Search</div>
                </a>
              </div>
              <div className="col-sm-2 form-group col-xs-3 searchboxFontSize">
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
              <div className="col-sm-2 form-group col-xs-3 searchboxFontSize">
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
              <div className="col-sm-2 form-group col-xs-3 searchboxFontSize">
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

              <div className="col-sm-2 form-group col-xs-3 searchboxFontSize">
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

              <div className="col-sm-2 form-group col-xs-3 searchboxFontSize">
                <a
                  href="javascript:void;"
                  onClick={() => TableData("")}
                  className="foreColor"
                >
                  <div className="form-group Status-all center round">All</div>
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
                <BootTable
                  drdata={drdata}
                  setSaveTestId={setSaveTestId}
                  saveTestId={saveTestId}
                />
                 <div className="d-flex align-items-center justify-content-end">
                   {drdata.length>0 && (searchstatus=="2" || collecteddataexist) &&
                    (
                  <div className="m-3">
                    <button
                      className="btn btn-info"
                      onClick={() => SaveSampleReceiveDepartment(saveTestId)}
                    >
                      Receive
                    </button>
                    
                  </div>)}
                </div>
              </div>
             
            
             

              {/* <div className="card shadow mb-4">
                <button
                  className="btn btn-primary"
                  onClick={() => SaveSampleReceiveDepartment(saveTestId)}
                >
                  {" "}
                  Receive{" "}
                </button>
              </div> */}
            </div>
            
          )
          
        )}
         
      </div>
    </div>
  );
};

export default DepartmentReceive;
