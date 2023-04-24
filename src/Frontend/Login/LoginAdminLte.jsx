import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import Input from "../../ChildComponents/Input";
import { LoginSchema } from "../../ValidationSchema";
import Loading from "../util/Loading";

const initialValues = {
  username: "",
  password: "",
};



const LoginForm = () => {
  const [load, setLoad] = useState(false);
  const { values, errors, handleChange, touched, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { resetForm }) => {
      setLoad(true);
      axios
        .post("http://apis-dev.ehssasdigitech.com/v1/user/login", values)
        .then((res) => {
          console.log('res', res);
          if (res.data.success) {
            window.sessionStorage.setItem("user_Token", res.data.token);
            window.location.replace("/advancedelements");
            toast.success("Login Successfully");
            setLoad(false);
            resetForm();
          }
        })
        .catch((err) => {
          toast.error(
            err.response.data.message
              ? err.response.data.message
              : "error occured"
          );
          setLoad(false);
          resetForm();
        });
    },
  });

  return (
    <div className="login-box">
      <div className="login-logo">
        <Link to="/login">
          <b>Admin</b>LTE
        </Link>
      </div>

      <div className="login-box-body">
        <p className="login-box-msg">Sign in to start your session</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group has-feedback">
            <Input
              type="text"
              className="form-control"
              placeholder="Email"
              name="username"
              value={values.username}
              onChange={handleChange}
              text="hello"
            />

            <i
              className="fa fa-user form-control-feedback"
              aria-hidden="true"
            ></i>
            {errors?.username && touched?.username && (
              <span className="golbal-Error">{errors?.username}</span>
            )}
          </div>
          <div className="form-group has-feedback">
            <Input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            <i
              className="fa fa-key form-control-feedback"
              aria-hidden="true"
            ></i>

            {errors?.password && touched?.password && (
              <span className="golbal-Error">{errors?.password}</span>
            )}
          </div>
          <div className="row">
            <div className="col-xs-8">
              <div className="form-group">
                <SimpleCheckbox type={"checkbox"} />
                <label className="labels">Remember Me</label>
              </div>
            </div>

            <div className="col-xs-4">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  className="btn btn-custom-01 btn-block btn-flat"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </form>
        <div className="social-auth-links text-center">
          <p>- OR -</p>
          <a
            href="#"
            className="btn btn-block btn-social btn-facebook btn-flat"
          >
            <i className="fa fa-facebook"></i> Sign in using Facebook
          </a>
          <a href="#" className="btn btn-block btn-social btn-google btn-flat">
            <i className="fa fa-google-plus"></i> Sign in using Google+
          </a>
        </div>

        <a href="#">I forgot my password</a>
        <br />
        <a href="register.html" className="text-center">
          Register a new membership
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
