import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CreateSpecialization,
  Degree,
  Locality,
  Specialization,
  Zone,
} from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getTrimmedData,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import { number } from "../../Frontend/util/Commonservices/number";
import Loading from "../../Frontend/util/Loading";
import { ChangePasswordSchema, DocotorReferal } from "../../ValidationSchema";

function DoctorReferalCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [Title, setTitle] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    DoctorCode: "",
    Title: "Dr.",
    Name: "",
    ClinicName: "",
    Email: "",
    Address: "",
    Phone: "",
    Mobile: "",
    Specialization: CreateSpecialization[0]?.value,
    Degree: Degree[0]?.value,
    Zone: Zone[0]?.value,
    Locality: Locality[0]?.value,
    isActive: 1,
  });

  const { values, errors, handleChange, handleBlur, touched, handleSubmit } =
    useFormik({
      initialValues: payload,
      enableReinitialize: state?.url ? true : false,
      validationSchema: DocotorReferal,
      onSubmit: (values) => {
        setLoad(true);
        axios
          .post(
            state?.url1
              ? state?.url1
              : "/api/v1/DoctorReferal/SaveDoctorReferal",
            getTrimmedData(values)
          )
          .then((res) => {
            setLoad(false);
            toast.success(res?.data?.message);
            navigate("/DoctorReferal");
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "error occured"
            );
            setLoad(false);
          });
      },
    });
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
        setTitle(value);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  useEffect(() => {
    getDropDownData("Title");
  }, []);

  const handleChanges = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const fetch = () => {
    axios
      .post(state?.url, {
        DoctorReferalID: state?.id,
      })
      .then((res) => {
        setPayload(res?.data?.message[0]);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "error occured"
        );
      });
  };

  useEffect(() => {
    if (state) {
      fetch();
    }
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">DoctorReferal Create</a>
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                DoctorReferal Detail
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  DoctorCode
                </label>
                <div>
                  <Input
                    type="text"
                    className="form-control pull-right reprint-date required"
                    value={values?.DoctorCode}
                    name="DoctorCode"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors?.DoctorCode && touched?.DoctorCode && (
                    <span className="golbal-Error">{errors?.DoctorCode}</span>
                  )}
                </div>
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Title
                </label>
                <SelectBox
                  options={Title}
                  name="Title"
                  selectedValue={selectedValueCheck(Title, payload?.Title)}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Name
                </label>
                <div>
                  <Input
                    type="text"
                    className="form-control pull-right reprint-date required"
                    name="Name"
                    value={values?.Name}
                    onChange={handleChange}
                  />
                  {errors?.Name && touched?.Name && (
                    <span className="golbal-Error">{errors?.Name}</span>
                  )}
                </div>
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  ClinicName
                </label>
                <div>
                  <Input
                    type="text"
                    className="form-control pull-right reprint-date required"
                    name="ClinicName"
                    value={values?.ClinicName}
                    onChange={handleChange}
                  />
                  {errors?.ClinicName && touched?.ClinicName && (
                    <span className="golbal-Error">{errors?.ClinicName}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Email
                </label>
                <div>
                  <Input
                    type="email"
                    className="form-control pull-right reprint-date required"
                    name="Email"
                    value={values?.Email}
                    onChange={handleChange}
                  />
                  {errors?.Email && touched?.Email && (
                    <span className="golbal-Error">{errors?.Email}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Address
                </label>
                <Input
                  type="text"
                  className="form-control pull-right reprint-date"
                  name="Address"
                  value={values?.Address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Phone
                </label>
                <Input
                  type="number"
                  className="form-control pull-right reprint-date"
                  name="Phone"
                  onInput={(e) => number(e, 10)}
                  value={payload?.Phone}
                  onChange={handleChanges}
                />
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Mobile
                </label>
                <div>
                  <Input
                    type="number"
                    className="form-control pull-right reprint-date required"
                    name="Mobile"
                    onInput={(e) => number(e, 10)}
                    value={values?.Mobile}
                    onChange={handleChange}
                  />
                  {errors?.Mobile && touched?.Mobile && (
                    <span className="golbal-Error">{errors?.Mobile}</span>
                  )}
                </div>
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Specialization
                </label>
                <div>
                  <SelectBox
                    className="required"
                    name="Specialization"
                    options={CreateSpecialization}
                    selectedValue={selectedValueCheck(
                      CreateSpecialization,
                      payload?.Specialization
                    )}
                    onChange={handleSelectChange}
                  />
                </div>
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Degree
                </label>
                <SelectBox
                  options={Degree}
                  name="Degree"
                  selectedValue={selectedValueCheck(Degree, payload?.Degree)}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Zone
                </label>
                <SelectBox
                  options={Zone}
                  name="Zone"
                  selectedValue={selectedValueCheck(Zone, payload?.Zone)}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Locality
                </label>
                <SelectBox
                  options={Locality}
                  name="Locality"
                  selectedValue={selectedValueCheck(
                    Locality,
                    payload?.Locality
                  )}
                  onChange={handleSelectChange}
                />
              </div>
            </div>

            <div className="d-flex align-items-center">
              <div>
                <Input
                  type="checkbox"
                  checked={payload?.isActive}
                  onChange={handleChanges}
                  name="isActive"
                />
                <label>Active</label>
              </div>

              <div className="mx-3">
                {load ? (
                  <Loading />
                ) : (
                  <button className="btn btn-success" onClick={handleSubmit}>
                    {state?.url1 ? "Update" : "Save"}
                  </button>
                )}
              </div>

              <div className="mx-3">
                <Link to="/DoctorReferal">Back To List</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorReferalCreate;
