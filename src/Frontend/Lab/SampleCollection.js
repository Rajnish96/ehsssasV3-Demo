import React, { useEffect, useState } from "react";
import { DatePickers } from "../../ChildComponents/DatePicker";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import { SampleSource, SearchBy } from "../../ChildComponents/Constants";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import BootTable from "../../Table/DepartmentReceive";
import Loading from "../util/Loading";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import SamleCollectionTable from "./SamleCollectionTable";

const SampleCollection = () => {
  const [CentreData, setCentreData] = useState([]);
  const [toggleTable, setToggleTable] = useState(true);
  const [RateData, setRateData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [payload, setPayload] = useState([]);
  const [toggleDate, setToggleDate] = useState({
    FromDate: false,
    ToDate: false,
  });
  const [scdata, setScData] = useState([]);
  const [searchInvdata, setSearchInvdata] = useState([]);
  const [newdata, setNewData] = useState([]);
  const [saveTestId, setSaveTestId] = useState([]);
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

  console.log(payload);

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

  const SaveSampleCollection = () => {
    if(payload?.length>0)
    {
    axios
      .post("/api/v1/SC/SampleCollection", {
        data: payload,
      })
      .then((res) => {
        toast.success(res.data.message);
        setPayload([]);
        if (payload.length === searchInvdata.length) {
          TableData("");
        } else {
          // SearchInvestigationData(payload[0]?.LedgerTransactionID);
          TableData("");
        }
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
    else
    {
      toast.error("Please select atlease one test to continue...")
    }
  };

  const TableData = (status) => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoading(true);
      axios
        .post("/api/v1/SC/GetSampleCollection", {
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
          setScData(res?.data?.message);
          setLoad(true);
          setLoading(false);
          setToggleTable(true);
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
  };

  const SearchInvestigationData = (LedgerTransactionID) => {
    const generatedError = validation();

    axios
      .post("/api/v1/SC/SearchInvestigation", {
        LedgerTransactionID: LedgerTransactionID,
      })
      .then((res) => {
        setSearchInvdata(res?.data?.message);
        setNewData(res?.data?.message.some(x=>x.Status=="1" || x.Status=="4"));
        setToggleTable(false);
        setLoad(true);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
    setErrors(generatedError);
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
              Sample Collection
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
                  onClick={() => TableData(1)}
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
              {toggleTable ? (
                <div className="boottable">
                  {scdata.length > 0 ? (
                    <Table responsive bordered hover>
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Sin No</th>
                          <th>Reg Date</th>
                          <th>Visit No</th>
                          <th>Pat Code</th>
                          <th>Name </th>
                          <th>Age</th>

                          <th>SampleType</th>
                          <th>Department</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scdata.map((data, index) => (
                          <tr key={index}  onClick={() =>
                            SearchInvestigationData(
                              data.LedgerTransactionID
                            )
                          }>
                            <td className={`color-Status-${data.Status}`}
                             
                            >
                              <div>{index + 1}</div>
                              <i className="fa fa-search" />
                            </td>

                            <td>{data?.SinNo}</td>
                            <td>
                              <div>
                                {moment(data.Date).format("DD/MMM/YYYY")}
                              </div>
                              <div>
                                {moment(data?.Date).format("hh:mm:ss a")}
                              </div>
                            </td>
                            <td>{data?.VisitNo}</td>
                            <td>{data?.PatientCode}</td>
                            <td>{data?.PName}</td>
                            <td>
                              <div>{data?.Age}</div>
                              <div>{data?.Gender}</div>
                            </td>
                            <td>{data?.SampleName}</td>
                            <td>{data?.Department}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    "No Data Found"
                  )}
                </div>
              ) : (
                <div className="">
                  {searchInvdata.length > 0 ? (
                    <Table responsive bordered hover>
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <td>
                            <div>RegDate</div>
                          </td>
                          <td>VisitNo</td>
                          <td>PName</td>

                          <td>Test</td>
                          <td>SinNo</td>
                          <td>Source</td>
                          <td>SampleQty</td>
                          <td>SampleTypeName</td>
                          <td>Reject</td>
                          <td>Action</td>
                        </tr>
                      </thead>
                      <tbody>
                        {searchInvdata.map((data, index) => (
                          <tr key={index}>
                            <SamleCollectionTable
                              data={data}
                              index={index}
                              payload={payload}
                              setPayload={setPayload}
                              setSearchInvdata={setSearchInvdata}
                              searchInvdata={searchInvdata}
                              TableData={TableData}
                            />
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    "No Data Found"
                  )}
                  <div className="d-flex align-items-center justify-content-end">
                    <div className="m-3">
                      <button
                        className="btn btn-info"
                        onClick={() => {
                          setToggleTable(true);
                        }}
                      >
                        Main List
                      </button>
                    </div>

                    {newdata &&(
                    <div className="m-3">
                      <button
                        className="btn btn-info"
                        onClick={() => {
                          SaveSampleCollection();
                        }}
                      >
                        Collect
                      </button>
                    </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SampleCollection;
