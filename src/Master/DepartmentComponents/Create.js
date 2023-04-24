import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import { validation } from "../../ChildComponents/validations";
import { getTrimmedData } from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

const Create = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    Department: "",
    DepartmentCode: "",
    isActive: true,
  });

  const [err, setErr] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const postData = () => {
    let generatedError = validation(formData);
    if (generatedError === "") {
      setLoading(true);
      axios
        .post(
          "/api/v1/Department/InsertDepartmentData",
          getTrimmedData(formData)
        )
        .then((res) => {
          if (res.data.message) {
            setLoading(false);
            navigate("/Departments");
            toast.success(res.data.message);
          } else {
            toast.error("Something went wrong");
            setLoading(false);
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
          <li className="breadcrumb-item active">Create</li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">Create</span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="DepartmentCode">
                  Department Code
                </label>
                <input
                  className="form-control pull-right reprint-date required"
                  maxLength={30}
                  name="DepartmentCode"
                  style={{ borderBottom: "1px solid #d62020" }}
                  type="text"
                  onChange={handleChange}
                  value={formData.DepartmentCode}
                />
                <div
                  className="field-validation-valid text-danger"
                  data-valmsg-for="DepartmentCode"
                  data-valmsg-replace="true"
                >
                  {err?.DepartmentCode}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="Department">
                  Department
                </label>
                <input
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
                  {err.Department}
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: "10px" }}>
              <div className="col-sm-12 col-md-12">
                <div className="col-sm-1 form-group">
                  <SimpleCheckbox
                    name="isActive"
                    type="checkbox"
                    value={formData?.isActive}
                    onChange={handleChange}
                    className="form-control pull-right reprint-date"
                  />
                  <label className="labels">Active</label>
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
                        title="Create"
                        onClick={postData}
                      >
                        Create
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

export default Create;
