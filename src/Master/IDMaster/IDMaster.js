import React, { useState, useEffect } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import { Table } from "react-bootstrap";
import axios from "axios";
import Loading from "../../Frontend/util/Loading";
import { number } from "../../Frontend/util/Commonservices/number";
import { validationForIDMAster } from "../../ChildComponents/validations";
import { toast } from "react-toastify";
import { getTrimmedData } from "../../Frontend/util/Commonservices";
import Input from "../../ChildComponents/Input";

const IDMaster = () => {
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [TypeName, setTypeName] = useState([]);
  const [Separator, setSeparator] = useState([]);
  const [LengthList, setLengthList] = useState([]);
  const [formData, setFormData] = useState({
    TypeID: "",
    TypeName: "Lab No",
    InitialChar: "",
    Separator1: "",
    FinancialYearStart: moment().format("YYYY-MM-DD"),
    Separator2: "",
    TypeLength: "",
    Separator3: "",
    FormatPreview: "",
    ChkCentre: false,
    chkFinancialYear: false,
    isActive: false,
  });

  console.log(TypeName);

  const getDropDownData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            label: ele.FieldDisplay,
            value: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "IDMaster":
            setTypeName(value);
            break;
          case "Separator":
            setSeparator(value);
            break;
          case "LENGTH LIST":
            setLengthList(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const getIDMaster = () => {
    axios
      .get("/api/v1/IDMaster/getIDMasterData", formData)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setFormData({ ...formData, [name]: event.value });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  useEffect(() => {
    let data = moment(formData?.FinancialYearStart).format("YY");
    let val = Number(data) + 1;

    setFormData({
      ...formData,
      FormatPreview: `${formData?.InitialChar}${formData?.Separator1}${
        formData?.chkFinancialYear ? data + val : ""
      }${formData?.Separator2}${formData?.ChkCentre ? "CC" : ""}${
        formData?.Separator3
      }${formData?.TypeLength}`,
    });
  }, [
    formData?.InitialChar,
    formData?.Separator1,
    formData?.FinancialYearStart,
    formData?.chkFinancialYear,
    formData?.Separator2,
    formData?.ChkCentre,
    formData?.Separator3,
    formData?.TypeLength,
  ]);

  const editIDMaster = (id) => {
    axios
      .post("/api/v1/IDMaster/getIDMasterDataByID", {
        TypeID: id,
      })
      .then((res) => {
        const data = res.data.message[0];
        setFormData(data);
      })
      .catch((err) => console.log(err));
    getDropDownData("IDMaster");
  };

  const postData = () => {
    const generatedError = validationForIDMAster(formData);
    if (generatedError == "") {
      setLoad(true);
      if (update === true) {
        axios
          .post(
            "/api/v1/IDMaster/UpdateIDMasterData",
            getTrimmedData({
              ...formData,
              // chkCentre: formData?.ChkCentre ? "1" : "0",
              // chkFinancialYear: formData?.chkFinancialYear ? "1" : "0",
              // isActive: "0",
            })
          )
          .then((res) => {
            if (res.data.message) {
              setLoad(false);
              toast.success(res.data.message);
              getIDMaster();
              setFormData({
                TypeID: "",
                TypeName: "",
                InitialChar: "",
                Separator1: "",
                FinancialYearStart: moment().format("YYYY-MM-DD"),
                Separator2: "",
                TypeLength: "",
                Separator3: "",
                FormatPreview: "",
                ChkCentre: false,
                chkFinancialYear: false,
                isActive: false,
              });
            } else {
              toast.error("Something went wrong");
              setLoad(false);
            }
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
            setLoad(false);
          });
      } else {
        setLoad(true);

        axios
          .post(
            "/api/v1/IDMaster/InsertIDMasterDatas",
            getTrimmedData({
              ...formData,
              chkCentre: formData?.ChkCentre ? "1" : "0",
              chkFinancialYear: formData?.chkFinancialYear ? "1" : "0",
              isActive: "0",
            })
          )
          .then((res) => {
            if (res.data.message) {
              setLoad(false);
              toast.success(res.data.message);
              setFormData({
                TypeID: "",
                TypeName: "",
                InitialChar: "",
                Separator1: "",
                FinancialYearStart: moment().format("YYYY-MM-DD"),
                Separator2: "",
                TypeLength: "",
                Separator3: "",
                FormatPreview: "",
                ChkCentre: false,
                chkFinancialYear: false,
                isActive: false,
              });
              getIDMaster();
            } else {
              toast.error("Something went wrong");
            }
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setLoad(false);
          });
      }
    } else {
      setErr(generatedError);
    }
  };

  useEffect(() => {
    getDropDownData("IDMaster");
    getDropDownData("Separator");
    getDropDownData("LENGTH LIST");
    getIDMaster();
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">ID Master</a>
          </li>
          <li className="breadcrumb-item active"></li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Search Criteria
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Type
                </label>
                :
                <SelectBox
                  name="TypeName"
                  options={TypeName}
                  onChange={handleSelectChange}
                  selectedValue={
                    formData?.TypeName && {
                      value: formData?.TypeName,
                      label: formData?.TypeName,
                    }
                  }
                  value={{
                    value: formData?.TypeName,
                    label: formData?.TypeName,
                  }}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="InitialChar"
                  style={{ fontWeight: "bold" }}
                >
                  Initial Char
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date required"
                  onInput={(e) => number(e, 8)}
                  name="InitialChar"
                  type="text"
                  value={formData?.InitialChar}
                  onChange={handleChange}
                />
                {formData?.InitialChar === "" && (
                  <div className="field-validation-valid text-danger">
                    {err?.InitialChar}
                  </div>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="Separator2"
                  style={{ fontWeight: "bold" }}
                >
                  Separator
                </label>
                :
                <SelectBox
                  name="Separator1"
                  options={Separator}
                  onChange={handleSelectChange}
                  selectedValue={
                    formData.Separator1 && {
                      label: formData?.Separator1,
                      value: formData?.Separator1,
                    }
                  }
                  value={{
                    label: formData?.Separator1,
                    value: formData?.Separator1,
                  }}
                />
              </div>
              <div className="col-sm-3 form-group">
                <label
                  className="control-label"
                  htmlFor="FinancialYearStart"
                  style={{ fontWeight: "bold" }}
                >
                  Financial Year
                </label>
                :
                <div className="input-group">
                  <Input
                    className="control-label pull-right reprint-date"
                    name="chkFinancialYear"
                    type="checkbox"
                    checked={formData?.chkFinancialYear}
                    onChange={handleChange}
                    value={formData?.chkFinancialYear}
                  />

                  <Input
                    className="form-control pull-right reprint-date required"
                    type="Date"
                    max={moment().format("YYYY-MM-DD")}
                    value={moment(formData?.FinancialYearStart).format(
                      "YYYY-MM-DD"
                    )}
                    onChange={handleChange}
                  />
                  <div className="field-validation-valid text-danger">
                    {err?.FinancialYearStart}
                  </div>
                </div>
              </div>
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="Separator3"
                  style={{ fontWeight: "bold" }}
                >
                  Separator
                </label>
                :
                <SelectBox
                  name="Separator2"
                  options={Separator}
                  onChange={handleSelectChange}
                  selectedValue={
                    formData.Separator2 && {
                      label: formData?.Separator2,
                      value: formData?.Separator2,
                    }
                  }
                  value={{
                    label: formData?.Separator2,
                    value: formData?.Separator2,
                  }}
                />
              </div>
              <div className="col-sm-1 form-group">
                <label
                  className="control-label"
                  htmlFor="CentreCode"
                  style={{ fontWeight: "bold" }}
                >
                  Centre
                </label>
                :
                <div className="input-group">
                  <Input
                    className="control-label pull-right reprint-date"
                    name="ChkCentre"
                    type="checkbox"
                    onChange={handleChange}
                    checked={formData?.ChkCentre}
                  />
                </div>
              </div>
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="Separator1"
                  style={{ fontWeight: "bold" }}
                >
                  Separator
                </label>
                :
                <SelectBox
                  name="Separator3"
                  options={Separator}
                  onChange={handleSelectChange}
                  selectedValue={
                    formData.Separator3 && {
                      label: formData?.Separator3,
                      value: formData?.Separator3,
                    }
                  }
                  value={{
                    label: formData?.Separator3,
                    value: formData?.Separator3,
                  }}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeLength"
                  style={{ fontWeight: "bold" }}
                >
                  Length
                </label>
                :
                <SelectBox
                  name="TypeLength"
                  options={LengthList}
                  onChange={handleSelectChange}
                  selectedValue={
                    formData.TypeLength && {
                      label: formData?.TypeLength,
                      value: formData?.TypeLength,
                    }
                  }
                  value={{
                    label: formData?.TypeLength,
                    value: formData?.TypeLength,
                  }}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="FormatPreview"
                  style={{ fontWeight: "bold" }}
                >
                  Preview
                </label>
                :
                <Input
                  className="form-control required pull-right reprint-date"
                  name="FormatPreview"
                  type="text"
                  disabled
                  onChange={handleChange}
                  value={formData?.FormatPreview}
                />
                {err?.FormatPreview}
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-sm-10">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    id="btnSave"
                    className="btn btn-success "
                    onClick={postData}
                  >
                    {update ? "Update" : "Save"}
                  </button>
                )}
              </div>
            </div>
            <br />
            {loading ? (
              <Loading />
            ) : (
              <div className="row px-2 boottable">
                {data.length > 0 ? (
                  <Table bordered responsive hover>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Type Name</th>
                        <th>Initial Character</th>
                        <th>Separator</th>
                        <th>Financial Year</th>
                        <th>Separator</th>
                        <th>Type Length</th>
                        <th>Separator</th>
                        <th>Format Preview</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((data, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{data?.TypeName}</td>
                          <td>{data?.InitialChar}</td>
                          <td>{data?.Separator1}</td>
                          <td>
                            {data?.FinancialYearStart !== "0000-00-00 00:00:00"
                              ? moment(data?.FinancialYearStart).format(
                                  "DD MMM YYYY"
                                )
                              : "-"}
                          </td>
                          <td>{data?.Separator2}</td>
                          <td>{data?.TypeLength}</td>
                          <td>{data?.Separator3}</td>
                          <td>{data?.FormatPreview}</td>
                          <td>
                            <button
                              onClick={() => {
                                editIDMaster(data?.TypeID);
                                setUpdate(true);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  " No Data Found"
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDMaster;
