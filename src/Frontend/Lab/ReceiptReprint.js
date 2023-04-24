import React, { useEffect, useState } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import { RefundFilter, SearchBy } from "../../ChildComponents/Constants";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import BootTable from "../../Table/BootTable";
import Loading from "../util/Loading";
import {
  getAccessCentres,
  getAccessRateType,
  getDoctorSuggestion,
} from "../util/Commonservices";

const ReceiptReprint = () => {
  const [CentreData, setCentreData] = useState([]);
  const [RateData, setRateData] = useState([]);
  const [receiptData, setReceiptData] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [dropFalse, setDropFalse] = useState(true);

  const [formData, setFormData] = useState({
    FromDate: moment().format("YYYY-MM-DD"),
    ToDate: moment().format("YYYY-MM-DD"),
    CentreID: "",
    ItemValue: "",
    RateID: "",
    SelectTypes: "",
    RefundFilter: null,
    FromTime: "00:00:00",
    ToTime: "23:59:59",
    DoctorReferal: "",
    DoctorName: "",
  });



  const validation = () => {
    let error = "";
    if (formData.SelectTypes === "Mobile") {
      if (formData.ItemValue.length !== 10) {
        error = { ...error, ItemValue: "Invalid Mobile Number" };
      }
    } else if (formData.SelectTypes === "VisitNo") {
      if (formData.ItemValue === "") {
        error = { ...error, ItemValue: "Please Enter Visit Number" };
      }
    } else if (formData.SelectTypes !== "") {
      error = { ...error, ItemValue: "This Field is Required" };
    }

    if (formData.FromDate > moment(new Date()).format("YYYY-MM-DD")) {
      error = { ...error, FromDate: "Date is Invalid" };
    }

    if (formData.ToDate > moment(new Date()).format("YYYY-MM-DD")) {
      error = { ...error, ToDate: "Date is Invalid" };
    } else if (formData.ToDate < formData.FromDate) {
      error = {
        ...error,
        ToDate: "Date Must be Greater Then Or Equal to From Date",
      };
    }
    if (formData.FromDate === moment(new Date()).format("YYYY-MM-DD")) {
      if (formData.FromTime > moment(new Date()).format("HH:MM:SS")) {
        error = { ...error, FromTime: "Time is Invalid" };
      }
    }

    if (formData.ToDate === moment(new Date()).format("YYYY-MM-DD")) {
      if (formData.ToTime < formData.FromTime) {
        error = { ...error, ToTime: "Time Must be Less than From Time" };
      }
    }

    return error;
  };

  const handleListSearch = (data, name) => {
    switch (name) {
      case "DoctorName":
        setFormData({
          ...formData,
          [name]: data.Name,
          DoctorReferal: data.Name ? data.DoctorReferalID : "",
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      default:
        break;
    }
  };

  // const dateSelect = (date, name) => {
  //   setFormData({
  //     ...formData,
  //     [name]: moment(date).format("DD/MMM/YYYY"),
  //   });
  //   handleToggle(name);
  // };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setFormData({ ...formData, [name]: event.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "DoctorName") {
      setDropFalse(true);
    }
  };

  const TableData = () => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoading(true);
      axios
        .post("/api/v1/Lab/getReceiptReprint", {
          CentreID: formData.CentreID,
          SelectTypes: formData.SelectTypes,
          ItemValue: formData.ItemValue,
          RateTypeID: formData.RateID,
          DoctorReferal: formData.DoctorReferal,
          FromDate: formData.FromDate,
          ToDate: formData.ToDate,
          FromTime: formData.FromTime,
          ToTime: formData.ToTime,
        })
        .then((res) => {
          setReceiptData(res?.data?.message);
          setLoad(true);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
  };

  const handleIndex = (e) => {
    switch (e.which) {
      case 38:
        if (indexMatch !== 0) {
          setIndexMatch(indexMatch - 1);
        } else {
          setIndexMatch(doctorSuggestion.length - 1);
        }
        break;
      case 40:
        if (doctorSuggestion.length - 1 === indexMatch) {
          setIndexMatch(0);
        } else {
          setIndexMatch(indexMatch + 1);
        }
        break;
      case 13:
        handleListSearch(doctorSuggestion[indexMatch], "DoctorName");
        setIndexMatch(0);
        break;
      default:
        break;
    }
  };

 
  useEffect(() => {
    getAccessCentres(setCentreData);
    getAccessRateType(setRateData);
  }, []);

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
  }, [formData?.DoctorName]);

  return (
    <div
      className="content-wrapper"
      style={{ minHeight: "955.604px" }}
      data-select2-id="18"
    >
      <div className="container-fluid" style={{ padding: "10px" }}>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Receipt Reprint</a>
          </li>
          <li className="breadcrumb-item active"></li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">
              Receipt Reprint
            </span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-3 form-group">
                <label className="control-label" htmlFor="Title">
                  Search By
                </label>
                <div className="d-flex">
                  <div style={{ flexBasis: "50%" }}>
                    <SelectBox
                      options={SearchBy}
                      formdata={formData.SelectTypes}
                      name="SelectTypes"
                      onChange={handleSelectChange}
                    />
                  </div>
                  <div style={{ flexBasis: "50%" }}>
                    <Input
                      className="select-input-box form-control"
                      type="text"
                      name="ItemValue"
                      value={formData.ItemValue}
                      onChange={handleChange}
                    />
                    {errors?.ItemValue && (
                      <span className="golbal-Error">{errors?.ItemValue}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-sm-3  form-group">
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
              <div className="col-sm-3 form-group">
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

              <div className="col-sm-3  form-group">
                <label className="control-label">DoctorReferal</label>
                <input
                  className="form-control select-input-box ui-autocomplete-input"
                  type="text"
                  name="DoctorName"
                  value={formData.DoctorName}
                  onChange={handleChange}
                  onKeyDown={handleIndex}
                  autoComplete="off"
                />
                {dropFalse && doctorSuggestion.length > 0 && (
                  <ul
                    className="suggestion-data"
                    style={{ top: "47px", right: "20px" }}
                  >
                    {doctorSuggestion.map((data, index) => (
                      <li
                        onClick={() => handleListSearch(data, "DoctorName")}
                        className={`${index === indexMatch && "matchIndex"}`}
                        key={index}
                      >
                        {data?.Name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label">From Date:</label>
                <div>
                  <input
                    type="date"
                    className="form-control pull-right reprint-date"
                    id="reservation"
                    value={formData?.FromDate}
                    name="FromDate"
                    onChange={handleChange}
                    max={moment().format("YYYY-MM-DD")}
                  />
                  {errors?.FromDate && (
                    <span className="golbal-Error">{errors?.FromDate}</span>
                  )}
                </div>
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
                    type="date"
                    className="form-control pull-right reprint-date"
                    id="reservation"
                    value={formData?.ToDate}
                    onChange={handleChange}
                    name="ToDate"
                    min={formData?.FromDate}
                    max={moment().format("YYYY-MM-DD")}
                  />
                  {errors?.ToDate && (
                    <span className="golbal-Error">{errors?.ToDate}</span>
                  )}
                </div>
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

              <div className="col-sm-4 form-group">
                <label className="control-label" htmlFor="RefundFilter">
                  RefundFilter
                </label>
                :
                <SelectBox
                  options={RefundFilter}
                  formdata={formData.RefundFilter}
                  name="RefundFilter"
                  onChange={handleSelectChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2 form-group">
                <label className="control-label"></label>
                <input
                  type="button"
                  style={{ marginTop: "17px" }}
                  value="Search"
                  id="btnSearch"
                  className="btn  btn-success"
                  onClick={TableData}
                />
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
                <BootTable receiptData={receiptData} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ReceiptReprint;
