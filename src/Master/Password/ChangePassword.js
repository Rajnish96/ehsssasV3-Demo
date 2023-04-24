import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import Loading from "../../Frontend/util/Loading";
import { ChangePasswordSchema } from "../../ValidationSchema";

function ChangePassword() {
  const [state, setState] = useState({
    UserType: "",
    UserName: "",
    OldPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  });

  const [load, setLoad] = useState(false);

  const { values, errors, handleChange, handleBlur, touched, handleSubmit } =
    useFormik({
      initialValues: state,
      validationSchema: ChangePasswordSchema,
      onSubmit: (values, { resetForm }) => {
        setLoad(true);
        axios
          .post("/api/v1/changePassword/changeUserPassword", values)
          .then((res) => {
            toast.success(res?.data?.message);
            setLoad(false);
            resetForm();
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "error Occured"
            );
            setLoad(false);
            resetForm();
          });
      },
    });

  const fetchDetail = () => {
    axios
      .get("/api/v1/changePassword/getUserDetail")
      .then((res) => {
        const data = res?.data?.message[0];
        setState({
          ...state,
          UserType: data?.UserType,
          UserName: data?.Username,
          UserTypeName: data?.UserTypeName,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "error Occured"
        );
      });
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Change Password</a>
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Basic Information
              </h6>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    User Type:
                  </label>
                  <Input
                    disabled={true}
                    className="form-control"
                    value={state?.UserTypeName}
                  />
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    User Name:
                  </label>
                  <Input
                    disabled={true}
                    className="form-control"
                    value={state?.UserName}
                  />
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    Old Password:
                  </label>
                  <Input
                    className="form-control required"
                    type="password"
                    name="OldPassword"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.OldPassword}
                  />
                  {errors?.OldPassword && touched?.OldPassword && (
                    <span className="golbal-Error">{errors?.OldPassword}</span>
                  )}
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    New Password:
                  </label>
                  <Input
                    className="form-control required"
                    type="password"
                    onChange={handleChange}
                    name="NewPassword"
                    onBlur={handleBlur}
                    value={values?.NewPassword}
                  />
                  {errors?.NewPassword && touched?.NewPassword && (
                    <span className="golbal-Error">{errors?.NewPassword}</span>
                  )}
                </div>

                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    Confirm Password:
                  </label>
                  <Input
                    className="form-control required"
                    type="password"
                    name="ConfirmPassword"
                    onChange={handleChange}
                    value={values?.ConfirmPassword}
                    onBlur={handleBlur}
                  />
                  {errors?.ConfirmPassword && touched?.ConfirmPassword && (
                    <span className="golbal-Error">
                      {errors?.ConfirmPassword}
                    </span>
                  )}
                </div>
              </div>
              <div>
                {load ? (
                  <Loading />
                ) : (
                  <button className="btn btn-success" type="submit">
                    Save
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
