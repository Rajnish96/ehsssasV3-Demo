import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Status } from "../../ChildComponents/Constants";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  getCollectionBoy,
  selectedValueCheck,
} from "../util/Commonservices";
import Input from "../../ChildComponents/Input";
import { dateConfig } from "../util/DateConfig";
import Loading from "../util/Loading";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function SendSampleToLab() {
  const [Center, setCenter] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [ToCenter, setToCenter] = useState([]);
  const [CollectionBoy, setCollectionBoy] = useState([]);
  const [load, setLoad] = useState({
    searchLoad: false,
    saveLoad: false,
  });
  const [errors, setErrors] = useState({});

  const [payload, setPayload] = useState({
    FromCentre: "1",
    DATE: moment().format("YYYY-MM-DD"),
    ToDate: moment().format("YYYY-MM-DD"),
    ToTime: "23:59:59",
    FromTime: "00:00:00",
    Status: "1",
    ToCentre: "",
    FieldBoyID: "",
    FieldBoyName: "",
  });

  const handleSelection = (event, rest) => {
    const { name } = rest;
    if (name === "FieldBoyID") {
      setPayload({
        ...payload,
        [name]: event.value,
        FieldBoyName: event?.label,
      });
    } else {
      setPayload({ ...payload, [name]: event.value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const validationFields = () => {
    let errors = "";
    if (payload?.ToCentre === "") {
      errors = { ...errors, ToCenter: "Please Select Center" };
    }

    if (payload?.FieldBoyID === "") {
      errors = {
        ...errors,
        FieldBoyID: "Please Select Collection Boy",
      };
    }

    return errors;
  };

  const handleSave = () => {
    const generatedError = validationFields();
    if (generatedError === "") {
      setErrors({});
      let data = tableData.filter((ele) => ele.isSelected === true);
      if (data.length > 0) {
        setLoad({ ...load, saveLoad: true });

        data = data.map((ele) => {
          return {
            TestID: ele?.TestID,
            BarcodeNo: ele?.BarcodeNo,
            VisitID: ele?.VisitID,
            PatientCode: ele?.PatientCode,
            ItemName: ele?.ItemName,
            FromCentre: payload?.FromCentre,
            ToCentre: payload?.ToCentre,
            FieldBoyID: payload?.FieldBoyID,
            FieldBoyName: payload?.FieldBoyName,
          };
        });
        axios
          .post("/api/v1/SendSampleToLab/SendSampleToLab", data)
          .then((res) => {
            toast.success(res?.data?.message);
            setTableData([]);
            setPayload({
              FromCentre: "1",
              DATE: moment().format("YYYY-MM-DD"),
              ToDate: moment().format("YYYY-MM-DD"),
              ToTime: "23:59:59",
              FromTime: "00:00:00",
              Status: "1",
              ToCentre: "",
              FieldBoyID: "",
              FieldBoyName: "",
            });
            setLoad({ ...load, saveLoad: false });
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
            setLoad({ ...load, saveLoad: false });
          });
      } else {
        toast.error("Please Choose One Value");
      }
    } else {
      setErrors(generatedError);
    }
  };

  const getToAccessCenter = () => {
    axios
      .post("/api/v1/SendSampleToLab/TransferCentreList", {
        BookingCentreID: payload?.FromCentre,
      })
      .then((res) => {
        let data = res?.data?.message;
        data = data.filter((ele) => ele?.CentreID != payload?.FromCentre);
        const val = data.map((ele) => {
          return {
            value: ele?.CentreID,
            label: ele?.Centre,
          };
        });
        setToCenter(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getToAccessCenter();
  }, [payload?.FromCentre]);

  const handleSearch = () => {
    setLoad({ ...load, searchLoad: true });
    axios
      .post("/api/v1/SendSampleToLab/SearchDataToSendSample", payload)
      .then((res) => {
        const data = res.data.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              isSelected: false,
            };
          });
          setTableData(val);
        } else {
          toast.error("No Data Found");
        }
        setLoad({ ...load, searchLoad: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad({ ...load, searchLoad: false });
      });
  };

  const handleSelected = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked;
    setTableData(data);
  };

  console.log(tableData);

  useEffect(() => {
    getAccessCentres(setCenter);
    getCollectionBoy(setCollectionBoy);
    getToAccessCenter();
  }, []);
  return (
    <div
      className="content-wrapper"
      style={{ minHeight: "955.604px" }}
      data-select2-id="18"
    >
      <div className="container-fluid" style={{ padding: "10px" }}>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Patient Lab Search</a>
          </li>
          <li className="breadcrumb-item active"></li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">
              Patient Lab Search
            </span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Title">
                  FromCentre
                </label>
                <SelectBox
                  options={Center}
                  name="FromCentre"
                  selectedValue={selectedValueCheck(
                    Center,
                    payload?.FromCentre
                  )}
                  onChange={handleSelection}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Title">
                  From Date
                </label>
                <input
                  type="date"
                  className="form-control pull-right reprint-date"
                  value={payload?.DATE}
                  name="DATE"
                  max={moment().format("YYYY-MM-DD")}
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Title">
                  From Time
                </label>
                <input
                  type="time"
                  className="form-control pull-right reprint-date"
                  step={3}
                  value={payload?.FromTime}
                  name="FromTime"
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Title">
                  To Date :
                </label>
                <input
                  type="date"
                  className="form-control pull-right reprint-date"
                  value={payload?.ToDate}
                  name="ToDate"
                  min={moment(payload?.DATE).format("YYYY-MM-DD")}
                  max={moment().format("YYYY-MM-DD")}
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Title">
                  To Time :
                </label>
                <input
                  type="time"
                  className="form-control pull-right reprint-date"
                  value={payload?.ToTime}
                  name="ToTime"
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Title">
                  Status
                </label>
                <SelectBox
                  options={Status}
                  name="Status"
                  onChange={handleSelection}
                  selectedValue={selectedValueCheck(Status, payload?.Status)}
                />
              </div>

              <div
                className="col-sm-2 form-group"
                style={{ alignSelf: "flex-end" }}
              >
                {load?.searchLoad ? (
                  <Loading />
                ) : (
                  <button className="btn btn-success" onClick={handleSearch}>
                    Search
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {tableData.length > 0 && (
          <div className="card shadow mb-4">
            <div className="card-body">
              <div className=" row p-2 boottable">
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>S.no</th>
                      <th>Select</th>
                      <th>DispatchCode</th>
                      <th>SIN No.</th>
                      <th>VsitNo</th>
                      <th>PatientCode</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Test</th>
                      <th>Reg Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {data?.isActive ? (
                            <button className="btn btn-info">Print</button>
                          ) : (
                            <Input
                              type="checkbox"
                              checked={data?.isSelected}
                              name="isSelected"
                              onChange={(e) => handleSelected(e, index)}
                            />
                          )}
                        </td>
                        <td>{data?.DispatchCode ? data?.DispatchCode : "-"}</td>
                        <td>{data?.BarcodeNo}</td>
                        <td>{data?.VisitID}</td>
                        <td>{data?.PatientCode}</td>
                        <td>{data?.PName}</td>
                        <td>{data?.PatientInfo ? data?.PatientInfo : "-"}</td>
                        <td>{data?.ItemName}</td>
                        <td>{dateConfig(data?.RegDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Title">
                  ToCenter
                </label>

                <SelectBox
                  options={ToCenter}
                  name="ToCentre"
                  selectedValue={selectedValueCheck(
                    ToCenter,
                    payload?.ToCentre
                  )}
                  onChange={handleSelection}
                />
                {errors?.ToCenter && (
                  <span className="golbal-Error">{errors?.ToCenter}</span>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Title">
                  Collection Boy
                </label>
                <SelectBox
                  options={CollectionBoy}
                  name="FieldBoyID"
                  selectedValue={selectedValueCheck(
                    CollectionBoy,
                    payload?.FieldBoyID
                  )}
                  onChange={handleSelection}
                />
                {errors?.FieldBoyID && (
                  <span className="golbal-Error">{errors?.FieldBoyID}</span>
                )}
              </div>
              <div
                className="col-sm-1 form-group"
                style={{ alignSelf: "flex-end" }}
              >
                {load?.saveLoad ? (
                  <Loading />
                ) : (
                  <button className="btn btn-success mx-2" onClick={handleSave}>
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SendSampleToLab;
