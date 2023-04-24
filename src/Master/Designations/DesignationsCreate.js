import React from "react";
import { validationForDesignations } from "../../ChildComponents/validations";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { number } from "../../Frontend/util/Commonservices/number";
import { useLocation } from "react-router-dom";
import { getTrimmedData } from "../../Frontend/util/Commonservices";
import Input from "../../ChildComponents/Input";
import Loading from "../../Frontend/util/Loading";

const DesignationsCreate = () => {
  const [err, setErr] = useState({});
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [formData, setFormData] = useState({
    Name: state?.data?.DesignationName ? state?.data?.DesignationName : "",
    SequenceNo: state?.data?.SequenceNo ? state?.data?.SequenceNo : "",
    IsDirectApprove: state?.data?.DirectApprove
      ? state?.data?.DirectApprove === "True"
        ? "1"
        : "0"
      : "",
    IsNewTestApprove: state?.data?.NewTestApproves
      ? state?.data?.NewTestApproves === "True"
        ? "1"
        : "0"
      : "",
    IsSales: state?.data?.IsSales ? state?.data?.IsSales : "",
    IsShowSpecialRate: state?.data?.ShowSpecialRate
      ? state?.data?.ShowSpecialRate === "True"
        ? "1"
        : "0"
      : "",
    isActive: state?.data?.ActiveStatus
      ? state?.data?.ActiveStatus === "True"
        ? "1"
        : "0"
      : "",
    DesignationID: state?.data?.DesignationID ? state?.data?.DesignationID : "",
  });

  console.log(formData);

  const postData = () => {
    let generatedError = validationForDesignations(formData);
    if (generatedError === "") {
      setLoad(true);
      axios
        .post(state?.url, getTrimmedData(formData))
        .then((res) => {
          if (res.data.message) {
            navigate("/Designations");
            setLoad(false);
            toast.success(res.data.message);
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
      setErr(generatedError);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(type);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Designations</a>
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">
              Search Criteria
            </span>
          </div>
          <div className="card-header">Designations</div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form group">
                <label className="control-label" htmlFor="Name">
                  Name
                </label>
                :
                <Input
                  className="form-control  pull-right reprint-date required"
                  name="Name"
                  type="text"
                  onChange={handleChange}
                  value={formData?.Name}
                />
                <span
                  className="field-validation-valid text-danger"
                  data-valmsg-for="DepartmentCode"
                  data-valmsg-replace="true"
                >
                  {err?.Name}
                </span>
              </div>
              <div className="col-sm-2 form group">
                <label className="control-label" htmlFor="Name">
                  Sequence No
                </label>
                :
                <Input
                  className="form-control  pull-right reprint-date required"
                  id="SequenceNo"
                  name="SequenceNo"
                  type="number"
                  onChange={handleChange}
                  value={formData?.SequenceNo}
                  onInput={(e) => number(e, 11)}
                />
                <span
                  className="field-validation-valid text-danger"
                  data-valmsg-for="DepartmentCode"
                  data-valmsg-replace="true"
                >
                  {err?.SequenceNo}
                </span>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-sm-10 col-md-10 form-group">
                <label className="control-label" htmlFor="IsSales">
                  Sales
                </label>
                :
                <Input
                  className="control-label mr-4"
                  name="IsSales"
                  type="checkbox"
                  onChange={handleChange}
                  checked={formData?.IsSales === "1" ? true : false}
                />
                <label className="control-label" htmlFor="IsNewTestApprove">
                  New Test Approve
                  <Input
                    className="control-label mr-4"
                    name="IsNewTestApprove"
                    type="checkbox"
                    onChange={handleChange}
                    checked={formData?.IsNewTestApprove === "1" ? true : false}
                  />
                </label>
                <label className="control-label" htmlFor="IsDirectApprove">
                  Direct Approve
                  <Input
                    className="control-label mr-4"
                    name="IsDirectApprove"
                    type="checkbox"
                    onChange={handleChange}
                    checked={formData?.IsDirectApprove === "1" ? true : false}
                  />
                </label>
                <label className="control-label" htmlFor="IsShowSpecialRate">
                  Show Special Rate
                  <Input
                    className="control-label mr-4"
                    name="IsShowSpecialRate"
                    type="checkbox"
                    onChange={handleChange}
                    checked={formData?.IsShowSpecialRate === "1" ? true : false}
                  />
                </label>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-sm-1 col-md-1 form-group">
                <label className="control-label" htmlFor="isActive">
                  Active
                </label>
                :
                <Input
                  className="control-label"
                  name="isActive"
                  type="checkbox"
                  checked={formData?.isActive === "1" ? true : false}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-1 form-group">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success "
                    title="Create"
                    onClick={postData}
                  >
                    {state?.other?.button ? state?.other?.button : "Save"}
                  </button>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <Link to="/Designations" style={{ fontSize: "13px" }}>
                  Back to List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignationsCreate;
