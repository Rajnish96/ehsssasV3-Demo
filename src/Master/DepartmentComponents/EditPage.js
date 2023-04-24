import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import { validation } from "../../ChildComponents/validations";
import { getTrimmedData } from "../../Frontend/util/Commonservices";
import Input from "../../ChildComponents/Input";
import Loading from "../../Frontend/util/Loading";

const Edit = () => {
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const [err, setErr] = useState({});
  const { state } = location;
  const [formData, setFormData] = useState({
    Department: state?.data?.Department ? state?.data?.Department : "",
    DepartmentCode: state?.data?.DepartmentCode
      ? state?.data?.DepartmentCode
      : "",
    isActive: state?.data?.Status === "De-Active" ? false : true,
    DepartmentID: state?.data?.DepartmentID,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value.trim(),
    });
  };

  const navigate = useNavigate();

  const postData = () => {
    const generatedError = validation(formData);
    if (generatedError === "") {
      setLoading(true);
      axios
        .post(
          "/api/v1/Department/UpdateDepartmentData",
          getTrimmedData(formData)
        )
        .then((res) => {
          if (res.status === 200) {
            setLoading(false);
            navigate("/Departments");
            toast.success("This record Update Successfully");
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoading(false);
        });
    } else {
      setErr(generatedError);
    }
  };
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Department</a>
          </li>
          <li className="breadcrumb-item active">Edit</li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">Edit</span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="DepartmentCode">
                  Department Code
                </label>
                <Input
                  className="form-control pull-right reprint-date required"
                  maxLength={30}
                  name="DepartmentCode"
                  type="text"
                  onChange={handleChange}
                  value={formData.DepartmentCode}
                />

                <div
                  className="field-validation-valid text-danger"
                  data-valmsg-for="Department"
                  data-valmsg-replace="true"
                >
                  {err?.DepartmentCode}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="Department">
                  Department
                </label>
                <Input
                  className="form-control pull-right reprint-date required"
                  maxLength={30}
                  name="Department"
                  type="text"
                  onChange={handleChange}
                  value={formData.Department}
                />
                <div
                  className="field-validation-valid text-danger"
                  data-valmsg-for="Department"
                  data-valmsg-replace="true"
                >
                  {err?.Department}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-10 col-md-10">
                <div className="col-sm-1 form-group">
                  <SimpleCheckbox
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    onChange={handleChange}
                    className=" form-control "
                    value={formData?.isActive}
                  />
                  <label htmlFor="isActive">Active</label>
                </div>
                <div className="col-sm-1 form-group">
                  {loading ? (
                    <Loading />
                  ) : (
                    <>
                      <button
                        type="submit"
                        id="btnSave"
                        className="btn btn-success "
                        onClick={postData}
                      >
                        Update
                      </button>
                    </>
                  )}
                </div>
                <div className="col-sm-2 form-group">
                  <Link to="/Departments" style={{ fontSize: "13px" }}>
                    Back to List
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
