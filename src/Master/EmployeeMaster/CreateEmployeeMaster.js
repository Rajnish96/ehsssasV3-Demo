import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import {
  SelectBox,
  SelectBoxWithCheckbox,
} from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  GetAccessRightApproval,
  GetAccessRightMaster,
  getDepartment,
  getDesignationData,
  getTrimmedData,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import { EmployeeMasterSchema } from "../../ValidationSchema";

function CreateEmployeeMaster() {
  const location = useLocation();
  const { state } = location;
  const navigation = useNavigate();
  const [Title, setTitle] = useState([]);
  const [centreId, setCentreId] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [Designation, setDesigation] = useState([]);
  const [AccessRight, setAccessRight] = useState([]);
  const [ApprovalRight, setApprovalRight] = useState([]);
  const [EditData, setEditData] = useState(false);
  const [userData, setUserData] = useState({
    DesignationId: "",
    FirstName: "",
    Password: "",
    Username: "",
  });

  const [load, setLoad] = useState(false);

  const [EmployeeMaster, setEmployeeMaster] = useState({
    AccessRight: "",
    ApprovalRight: "",
    Centre: "",
    CentreID: "",
    City: "",
    Department: "",
    Designation: "",
    DesignationID: "",
    Email: "",
    HouseNo: "",
    Locality: "",
    Mobile: "",
    Name: "",
    PCity: "",
    PHouseNo: "",
    PLocality: "",
    PPincode: "",
    PStreetName: "",
    Pincode: "",
    StreetName: "",
    Title: "",
    isActive: 1,
    isLoginApprovel: 0,
  });

  const { values, errors, handleChange, handleBlur, touched, handleSubmit } =
    useFormik({
      initialValues: EmployeeMaster,
      enableReinitialize: state?.url2 ? true : false,
      validationSchema: EmployeeMasterSchema,
      onSubmit: (values) => {
        setLoad(true);
        axios
          .post(
            state?.url2 ? state?.url2 : "/api/v1/Employee/SaveNewEmployee",
            {
              EmployeeMaster: [
                getTrimmedData({
                  EmployeeID: state?.id,
                  AccessRight: EmployeeMaster?.AccessRight,
                  ApprovalRight: EmployeeMaster?.ApprovalRight,
                  Centre: EmployeeMaster?.Centre,
                  CentreID: EmployeeMaster?.CentreID,
                  City: values?.City,
                  Department: EmployeeMaster?.Department,
                  Designation: EmployeeMaster?.Designation,
                  DesignationID: EmployeeMaster?.DesignationID,
                  Email: values?.Email,
                  HouseNo: values?.HouseNo,
                  Locality: values?.Locality,
                  Mobile: values?.Mobile,
                  Name: values?.Name,
                  PCity: values?.PCity,
                  PHouseNo: values?.PHouseNo,
                  PLocality: values?.PLocality,
                  PPincode: values?.PPincode,
                  PStreetName: values?.PStreetName,
                  Pincode: values?.PPincode,
                  StreetName: values?.StreetName,
                  Title: EmployeeMaster?.Title,
                  isActive: EmployeeMaster?.isActive,
                  isLoginApprovel: EmployeeMaster?.isLoginApprovel,
                }),
              ],
              userData: [getTrimmedData(userData)],
            }
          )
          .then((res) => {
            toast.success(res?.data?.message);
            setLoad(false);
            navigation("/EmployeeMaster");
          })
          .catch((err) => {
            toast.error(
              err.response?.data?.message
                ? err.response?.data?.message
                : err.response?.data
            );
            setLoad(false);
          });
      },
    });

  const handleChanges = (select, name) => {
    let val = "";
    for (let i = 0; i < select.length; i++) {
      val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
    }
    setEmployeeMaster({ ...EmployeeMaster, [name]: val });
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    if (name === "Designation") {
      setEmployeeMaster({
        ...EmployeeMaster,
        [name]: event.label,
        DesignationID: event.value,
      });
    } else {
      setEmployeeMaster({ ...EmployeeMaster, [name]: event.value });
    }
  };

  const getGenderDropdown = (name) => {
    axios.post("/api/v1/Global/getGlobalData", { Type: name }).then((res) => {
      let data = res.data.message;
      let value = data.map((ele) => {
        return {
          value: ele.FieldDisplay,
          label: ele.FieldDisplay,
        };
      });
      setTitle(value);
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeMaster({
      ...EmployeeMaster,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  useEffect(() => {
    setUserData({
      ...userData,
      DesignationId: EmployeeMaster?.DesignationID,
    });
  }, [EmployeeMaster?.DesignationID]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    setUserData({ ...userData, FirstName: values?.Name });
  }, [values?.Name]);

  //Edit Logic

  const fetch = () => {
    setEditData(true);
    axios
      .post(state?.url1, {
        EmployeeID: state?.id,
      })
      .then((res) => {
        const data = res.data.message[0];

        setEmployeeMaster({ ...EmployeeMaster, data });
        setUserData({
          ...userData,
          DesignationId: data?.DesignationID,
          FirstName: data?.FirstName,
          Username: data?.Username,
          Password: data?.Password,
        });
        fetchDepartments(data);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchDepartments = (data) => {
    axios
      .post("/api/v1/Employee/getAccessDepartment", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].DepartmentID}`
              : `${val},${res.data.message[i].DepartmentID}`;
        }
        const data1 = { ...data, Department: val };

        setEmployeeMaster(data1);
        fetchAccessCenter(data1);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchAccessCenter = (data) => {
    axios
      .post("/api/v1/Employee/SearchAccessCentre", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].CentreID}`
              : `${val},${res.data.message[i].CentreID}`;
        }
        const data1 = { ...data, Centre: val };
        setEmployeeMaster(data1);
        fetchAccessRight(data1);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchAccessRight = (data) => {
    axios
      .post("/api/v1/Employee/SearchAccessRight", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].AccessRightID}`
              : `${val},${res.data.message[i].AccessRightID}`;
        }
        const data1 = { ...data, AccessRight: val };
        setEmployeeMaster(data1);
        fetchAccessApproval(data1);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchAccessApproval = (data) => {
    axios
      .post("/api/v1/Employee/SearchApprovalRight", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        console.log(res);
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].ApprovalRightID}`
              : `${val},${res.data.message[i].ApprovalRightID}`;
        }

        setEmployeeMaster({ ...data, ApprovalRight: val });
        setEditData(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  console.log(EmployeeMaster);

  useEffect(() => {
    getGenderDropdown("Title");
    getAccessCentres(setCentreId);
    getDepartment(setDepartment);
    getDesignationData(setDesigation);
    GetAccessRightMaster(setAccessRight);
    GetAccessRightApproval(setApprovalRight);
  }, []);

  useEffect(() => {
    if (!state) {
      setEmployeeMaster({
        ...EmployeeMaster,
        Title: Title[0]?.value,
        CentreID: centreId[0]?.value,
        DepartmentID: Department[0]?.value,
      });
    }
  }, [Title, centreId, Department]);

  useEffect(() => {
    if (state) {
      fetch();
    }
  }, []);

  const DuplicateUsername = (url) => {
    axios
      .post(
        url,
        state
          ? {
              UserName: userData?.Username,
              EmployeeID: state?.id,
            }
          : {
              UserName: userData?.Username,
              EmployeeID: "",
            }
      )
      .then((res) => console.log(res))
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "error Occured"
        );
        setUserData({
          ...userData,
          Username: "",
        });
      });
  };

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      {EditData ? (
        <div className="loading-center">
          <Loading />
        </div>
      ) : (
        <div className="container-fluid">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Employee Master</a>
            </li>
          </ol>
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Employee Detail
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    Title
                  </label>
                  <SelectBox
                    options={Title}
                    selectedValue={selectedValueCheck(
                      Title,
                      EmployeeMaster?.Title
                    )}
                    onChange={handleSelectChange}
                    name="Title"
                  />
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    Name
                  </label>
                  <div>
                    <Input
                      className="form-control pull-right reprint-date required"
                      name="Name"
                      type="text"
                      value={values?.Name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors?.Name && touched?.Name && (
                      <span className="golbal-Error">{errors?.Name}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    HouseNo
                  </label>
                  <div>
                    <Input
                      className="form-control pull-right reprint-date required"
                      name="HouseNo"
                      type="text"
                      value={values?.HouseNo}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {errors?.HouseNo && touched?.HouseNo && (
                      <span className="golbal-Error">{errors?.HouseNo}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    StreetName
                  </label>
                  <Input
                    className="form-control pull-right reprint-date"
                    name="StreetName"
                    type="text"
                    value={values?.StreetName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    Locality
                  </label>
                  <Input
                    name="Locality"
                    type="text"
                    value={values?.Locality}
                    onChange={handleChange}
                    className="form-control pull-right reprint-date"
                  />
                </div>

                <div className="col-sm-1 col-md-1 form-group">
                  <label className="control-label " htmlFor="DataType">
                    Pincode
                  </label>
                  <div>
                    <Input
                      name="Pincode"
                      type="number"
                      value={values?.Pincode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control pull-right reprint-date required"
                    />
                    {errors?.Pincode && touched?.Pincode && (
                      <span className="golbal-Error">{errors?.Pincode}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-1 col-md-1 form-group">
                  <label className="control-label " htmlFor="DataType">
                    City
                  </label>
                  <div>
                    <Input
                      name="City"
                      type="text"
                      value={values?.City}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control pull-right reprint-date required"
                    />
                    {errors?.City && touched?.City && (
                      <span className="golbal-Error">{errors?.City}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    Mobile
                  </label>
                  <div>
                    <Input
                      name="Mobile"
                      type="number"
                      value={values?.Mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control pull-right reprint-date required"
                    />

                    {errors?.Mobile && touched?.Mobile && (
                      <span className="golbal-Error">{errors?.Mobile}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    Email
                  </label>
                  <div>
                    <Input
                      name="Email"
                      value={values?.Email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control pull-right reprint-date required"
                      type="email"
                    />
                    {errors?.Email && touched?.Email && (
                      <span className="golbal-Error">{errors?.Email}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    UserName
                  </label>
                  <Input
                    name="Username"
                    value={userData?.Username}
                    onChange={handleUserChange}
                    onBlur={() => {
                      DuplicateUsername(
                        "/api/v1/Employee/checkDublicateUserName"
                      );
                    }}
                    type="text"
                    className="form-control pull-right reprint-date required"
                  />
                </div>
                {!state?.id && (
                  <div className="col-sm-2 col-md-2 form-group">
                    <label className="control-label " htmlFor="DataType">
                      Password
                    </label>
                    <Input
                      name="Password"
                      type="password"
                      value={userData?.Password}
                      onChange={handleUserChange}
                      className="form-control pull-right reprint-date"
                    />
                  </div>
                )}

                <div
                  className="col-sm-2 col-md-2 form-group"
                  style={{ alignSelf: "flex-end" }}
                >
                  <Input
                    name="isLoginApprovel"
                    type="checkbox"
                    checked={EmployeeMaster?.isLoginApprovel}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="IsLogin">IsLogin</label>
                </div>
              </div>
            </div>
          </div>
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <span className="m-0 font-weight-bold text-primary">
                Professional Details
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="CentreID">
                    CentreID
                  </label>
                  <SelectBox
                    name="CentreID"
                    options={centreId}
                    selectedValue={selectedValueCheck(
                      centreId,
                      EmployeeMaster?.CentreID
                    )}
                    onChange={handleSelectChange}
                  />
                </div>
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="Designation">
                    Designation
                  </label>
                  <SelectBox
                    name="Designation"
                    className="required"
                    options={Designation}
                    selectedValue={selectedValueCheck(
                      Designation,
                      EmployeeMaster?.DesignationID
                    )}
                    onChange={handleSelectChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <span className="m-0 font-weight-bold text-primary">
                Access Details
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="Department">
                    Department
                  </label>
                  <SelectBoxWithCheckbox
                    name="Department"
                    options={Department}
                    value={EmployeeMaster?.Department}
                    onChange={handleChanges}
                  />
                </div>
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="Centre">
                    Centre
                  </label>
                  <SelectBoxWithCheckbox
                    name="Centre"
                    options={centreId}
                    value={EmployeeMaster?.Centre}
                    onChange={handleChanges}
                  />
                </div>
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="AccessRight">
                    AccessRight
                  </label>
                  <SelectBoxWithCheckbox
                    name="AccessRight"
                    options={AccessRight}
                    value={EmployeeMaster?.AccessRight}
                    onChange={handleChanges}
                  />
                </div>
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="ApprovalRight">
                    ApprovalRight
                  </label>
                  <SelectBoxWithCheckbox
                    name="ApprovalRight"
                    options={ApprovalRight}
                    value={EmployeeMaster?.ApprovalRight}
                    onChange={handleChanges}
                  />
                </div>
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label ">Attach Signatures</label>
                  <Input
                    name="FileUpload"
                    className="form-control-file pull-right reprint-date"
                    type="file"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <span className="m-0 font-weight-bold text-primary">
                Permanent Detail
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label ">Permanent HouseNo</label>
                  <div>
                    <Input
                      name="PHouseNo"
                      type="text"
                      className="form-control pull-right reprint-date required"
                      value={values?.PHouseNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors?.PHouseNo && touched?.PHouseNo && (
                      <span className="golbal-Error">{errors?.PHouseNo}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label ">Permanent StreetName</label>
                  <Input
                    name="PStreetName"
                    value={values?.PStreetName}
                    type="text"
                    className="form-control pull-right reprint-date"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label ">Permanent Locality</label>
                  <Input
                    name="PLocality"
                    value={values?.PLocality}
                    type="text"
                    className="form-control pull-right reprint-date"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label "> Permanent PinCode</label>
                  <div>
                    <Input
                      name="PPincode"
                      value={values?.PPincode}
                      type="text"
                      className="form-control pull-right reprint-date required"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors?.PPincode && touched?.PPincode && (
                      <span className="golbal-Error">{errors?.PPincode}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label ">Permanent City</label>
                  <div>
                    <Input
                      name="PCity"
                      value={values?.PCity}
                      type="text"
                      className="form-control pull-right reprint-date required"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors?.PCity && touched?.PCity && (
                      <span className="golbal-Error">{errors?.PCity}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 d-flex align-items-end">
                <div className="mx-2" style={{ alignSelf: "flex-end" }}>
                  <Input
                    name="isActive"
                    type="checkbox"
                    checked={EmployeeMaster?.isActive}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="IsLogin">Active</label>
                </div>

                <div className="mx-2">
                  {load ? (
                    <Loading />
                  ) : (
                    <button className="btn btn-success" onClick={handleSubmit}>
                      {state?.button ? state?.button : "Submit"}
                    </button>
                  )}
                </div>

                <div className="mx-2" style={{ fontSize: "13px" }}>
                  <Link to="/EmployeeMaster">Back to List</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEmployeeMaster;
