import React from "react";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { InestigationRange, RoundOff } from "../../ChildComponents/Constants";
import { selectedValueCheck } from "../../Frontend/util/Commonservices";
import { toast } from "react-toastify";
import Loading from "../../Frontend/util/Loading";
import { number } from "../../Frontend/util/Commonservices/number";

const InvestigationRange = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [CentreData, setCentreData] = useState([]);
  const [Machine, setMachine] = useState([]);
  const [Gender, setGender] = useState([]);
  const [RangeType, setRangeType] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [load, setLoad] = useState(false);
  const [valid, setValid] = useState({});

  const [payload, setPayload] = useState({
    CentreID: "",
    Gender: "",
    MacID: "",
    RangeType: "",
    InvestigationID: state?.InvestigationID,
    MethodName: "",
    LabObservationID: state?.InvestigationID,
    SaveToBothGender: 0,
    RoundOff: "",
  });

  useEffect(() => {
    if (CentreData.length > 0) {
      setPayload({
        ...payload,
        CentreID: CentreData[0]?.value ? CentreData[0]?.value : "",
        Gender: Gender[0]?.value ? Gender[0]?.value : "",
        MacID: Machine[0]?.value ? Machine[0]?.value : "",
        RangeType: RangeType[0]?.value ? RangeType[0]?.value : "",
      });
    }
  }, [CentreData, Gender, Machine, RangeType]);

  const handleDelete = (ind) => {
    const data = tableData?.filter((ele, index) => index !== ind);
    setTableData(data);
    toast.success("Removed Successfully");
  };

  const fetch = () => {
    axios
      .post("/api/v1/Investigations/GetRangeData", payload)
      .then((res) => {
        if (res?.data?.message.length === 0) {
          toast.success("No Data Found");
        } else {
          setPayload({
            ...payload,
            LabObservationID: res?.data?.message[0]?.LabObservationID,
          });
        }

        const data = res?.data?.message;
        let val = data.map((ele) => {
          return {
            ...ele,
            ReflexMin: ele?.reflexmin,
            ReflexMax: ele?.reflexmax,
          };
        });

        setTableData(
          res?.data?.message.length > 0
            ? val
            : [
                {
                  ...InestigationRange,
                  InvestigationID: payload?.InvestigationID,
                  LabObservationID: payload?.InvestigationID,
                  Gender: payload?.Gender,
                  MacID: payload?.MacID,
                  RangeType: payload?.RangeType,
                  CentreID: payload?.CentreID,
                  FromAge: "0",
                },
              ]
        );
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  console.log(payload);

  useEffect(() => {
    if (
      payload?.CentreID !== "" &&
      payload?.Gender !== "" &&
      payload?.MacID !== "" &&
      payload?.RangeType !== "" 
    ) {
      fetch();
    }
  }, [payload?.CentreID, payload?.Gender, payload?.MacID, payload?.RangeType]);

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
  const getMachine = () => {
    axios
      .get("/api/v1/Investigations/BindMachineList")
      .then((res) => {
        let data = res.data.message;
        let Machine = data.map((ele) => {
          return {
            value: ele.MachineId,
            label: ele.MachineName,
          };
        });
        setMachine(Machine);
      })
      .catch((err) => console.log(err));
  };
  const getRangeType = () => {
    axios
      .get("/api/v1/Investigations/BindRangeType")
      .then((res) => {
        let data = res.data.message;
        let RangeType = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        setRangeType(RangeType);
      })
      .catch((err) => console.log(err));
  };
  const getDropDownData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "Gender":
            setGender(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const Match = () => {
    let match = false;
    let FieldError = {
      index: "",
      minValue: "",
      maxValue: "",
    };
    for (var i = 0; i < tableData.length; i++) {
      if (
        parseFloat(tableData[i].ToAge) <= parseFloat(tableData[i].FromAge) ||
        tableData[i].ToAge === ""
      ) {
        match = true;
        FieldError = { index: i, minValue: "ToAge", maxValue: "" };
        break;
      } else if (
        parseFloat(tableData[i].MaxReading) <=
          parseFloat(tableData[i].MinReading) ||
        tableData[i].MaxReading === tableData[i].MinReading
      ) {
        match = true;
        FieldError = {
          index: i,
          minValue: "MinReading",
          maxValue: "MaxReading",
        };
        break;
      } else if (
        parseFloat(tableData[i].MaxCritical) <=
        parseFloat(tableData[i].MinCritical)
      ) {
        match = true;
        FieldError = {
          index: i,
          minValue: "MinCritical",
          maxValue: "MaxCritical",
        };
        break;
      } else if (
        parseFloat(tableData[i].AutoApprovedMax) <=
        parseFloat(tableData[i].AutoApprovedMin)
      ) {
        match = true;
        FieldError = {
          index: i,
          minValue: "AutoApprovedMin",
          maxValue: "AutoApprovedMax",
        };
        break;
      }
    }
    setValid(FieldError);
    return match;
  };

  const handleAddRow = (data) => {
    const match = Match();
    if (!match) {
      setTableData([
        ...tableData,
        {
          ...InestigationRange,
          InvestigationID: payload?.InvestigationID,
          LabObservationID: payload?.InvestigationID,
          Gender: payload?.Gender,
          MacID: payload?.MacID,
          RangeType: payload?.RangeType,
          CentreID: payload?.CentreID,
          FromAge: Number(data?.ToAge) + 1,
        },
      ]);
    } else {
      toast.error("please Enter Valid Values");
    }
  };

  const handleChangeTableData = (e, index) => {
    const { name, value } = e.target;
    const data = [...tableData];
    data[index][name] = value;
    setTableData(data);
  };

  const handleSubmit = () => {
    const valid = Match();
    if (valid) {
      toast.error("please Enter Valid Values");
    } else {
      setLoad(true);
      axios
        .post("/api/v1/Investigations/SaveRanges", {
          CentreID: payload?.CentreID,
          Gender: payload?.Gender,
          InvestigationID: payload?.InvestigationID,
          MacID: payload?.MacID,
          MethodName: payload?.MethodName,
          SaveToBothGender: payload?.SaveToBothGender,
          labobservation_rangeVM: tableData,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad(false);
          fetch();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    }
  };

  useEffect(() => {
    getAccessCentres();
    getMachine();
    getRangeType();
    getDropDownData("Gender");
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">LabObservationRange</a>
          </li>
          <li className="breadcrumb-item active">
            {/* {state?.other?.pageName ? state?.other?.pageName : "Create"} */}
            Create
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            {/* {state?.other?.pageName ? state?.other?.pageName : "Create"} */}
            <span className="m-0 font-weight-bold text-primary"> Create</span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form-group">
                <label className="control-label">Centre Name</label>
                <SelectBox
                  options={CentreData}
                  onChange={handleSelectChange}
                  name="CentreID"
                  selectedValue={selectedValueCheck(
                    CentreData,
                    payload?.CentreID
                  )}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label">Machine</label>
                <SelectBox
                  options={Machine}
                  onChange={handleSelectChange}
                  name="MacID"
                  selectedValue={selectedValueCheck(Machine, payload?.MacID)}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label">Gender</label>
                <SelectBox
                  options={Gender.filter((ele) => ele.value !== "Both")}
                  onChange={handleSelectChange}
                  name="Gender"
                  selectedValue={selectedValueCheck(Gender, payload?.Gender)}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label">RangeType</label>
                <SelectBox
                  options={RangeType}
                  onChange={handleSelectChange}
                  name="RangeType"
                  selectedValue={selectedValueCheck(
                    RangeType,
                    payload?.RangeType
                  )}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2 form-group">
                <label className="control-label">MethodName</label>
                <Input
                  className="form-control pull-right reprint-date"
                  name="MethodName"
                  value={payload?.MethodName}
                  type="text"
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label">RoundOff</label>
                <SelectBox
                  options={RoundOff}
                  name="RoundOff"
                  onChange={handleSelectChange}
                  selectedValue={selectedValueCheck(
                    RoundOff,
                    payload?.RoundOff
                  )}
                />
              </div>
              <div className="col-sm-3  form-group">
                <br />
                <Input
                  name="SaveToBothGender"
                  type="checkbox"
                  checked={payload?.SaveToBothGender ? true : false}
                  onChange={handleChange}
                />
                <label>SaveToBothGender</label>
              </div>
            </div>
            <div className="card-body">
              <div className="px-2">
                <Table bordered responsive hover>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Delete</th>
                      <th>FromAge(days)</th>
                      <th>ToAge(days)</th>
                      <th>MinReading</th>
                      <th>MaxReading</th>
                      <th>MinCritical</th>
                      <th>Maxcritical</th>
                      <th>AutoAppMin</th>
                      <th>AutoAppMax</th>
                      <th>Unit</th>
                      <th>DisplayReading</th>
                      <th>DefaultReading</th>
                      <th>AbnormalReading</th>
                      <th>AddRow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {index + 1 === tableData?.length && index !== 0 && (
                            <button
                              className="form-control Input-sm btn-danger"
                              name="disableData"
                              onClick={() => handleDelete(index)}
                            >
                              X
                            </button>
                          )}
                        </td>
                        <td>
                          <Input
                            type="number"
                            className="form-control Input-sm "
                            value={data?.FromAge}
                            readOnly
                            name="FromAge"
                            onInput={(e) => number(e, 5)}
                            onChange={(e) => handleChangeTableData(e, index)}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            className={`form-control Input-sm  ${
                              valid?.index === index &&
                              valid?.minValue === "ToAge"
                                ? "error-occured-input"
                                : ""
                            }`}
                            readOnly={
                              index + 1 === tableData?.length ? false : true
                            }
                            value={data?.ToAge}
                            onInput={(e) => number(e, 5)}
                            name="ToAge"
                            onChange={(e) => handleChangeTableData(e, index)}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            className={`form-control Input-sm  ${
                              valid?.index === index &&
                              valid?.minValue === "MinReading"
                                ? "error-occured-input"
                                : ""
                            }`}
                            value={data?.MinReading}
                            onInput={(e) => number(e, 4)}
                            name="MinReading"
                            onChange={(e) => handleChangeTableData(e, index)}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            className={`form-control Input-sm  ${
                              valid?.index === index &&
                              valid?.maxValue === "MaxReading"
                                ? "error-occured-input"
                                : ""
                            }`}
                            value={data?.MaxReading}
                            onInput={(e) => number(e, 4)}
                            name="MaxReading"
                            onChange={(e) => handleChangeTableData(e, index)}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            className={`form-control Input-sm  ${
                              valid?.index === index &&
                              valid?.minValue === "MinCritical"
                                ? "error-occured-input"
                                : ""
                            }`}
                            value={data?.MinCritical}
                            onInput={(e) => number(e, 4)}
                            name="MinCritical"
                            onChange={(e) => handleChangeTableData(e, index)}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            className={`form-control Input-sm  ${
                              valid?.index === index &&
                              valid?.maxValue === "MaxCritical"
                                ? "error-occured-input"
                                : ""
                            }`}
                            value={data?.MaxCritical}
                            onInput={(e) => number(e, 4)}
                            name="MaxCritical"
                            onChange={(e) => handleChangeTableData(e, index)}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            className={`form-control Input-sm  ${
                              valid?.index === index &&
                              valid?.minValue === "AutoApprovedMin"
                                ? "error-occured-input"
                                : ""
                            }`}
                            value={data?.AutoApprovedMin}
                            onInput={(e) => number(e, 4)}
                            name="AutoApprovedMin"
                            onChange={(e) => handleChangeTableData(e, index)}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            className={`form-control Input-sm  ${
                              valid?.index === index &&
                              valid?.maxValue === "AutoApprovedMax"
                                ? "error-occured-input"
                                : ""
                            }`}
                            value={data?.AutoApprovedMax}
                            onInput={(e) => number(e, 4)}
                            name="AutoApprovedMax"
                            onChange={(e) => handleChangeTableData(e, index)}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            className=""
                            value={data?.ReadingFormat}
                            name="ReadingFormat"
                            onChange={(e) => handleChangeTableData(e, index)}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            className="form-control Input-sm "
                            value={data?.DisplayReading}
                            name="DisplayReading"
                            onChange={(e) => handleChangeTableData(e, index)}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            className="form-control Input-sm "
                            value={data?.DefaultReading}
                            name="DefaultReading"
                            onChange={(e) => handleChangeTableData(e, index)}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            className="form-control Input-sm "
                            value={data?.AbnormalValue}
                            name="AbnormalValue"
                            onChange={(e) => handleChangeTableData(e, index)}
                          />
                        </td>
                        <td>
                          {index + 1 === tableData?.length && (
                            <button
                              className="btn btn-info"
                              onClick={() => handleAddRow(data)}
                            >
                              AddRow
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {load ? (
                <Loading />
              ) : (
                <button
                  className="margin btn btn-success"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              )}
              <button
                className="margin btn btn-primary"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationRange;
