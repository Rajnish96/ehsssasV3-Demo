import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { validationForSampleType } from "../../ChildComponents/validations";
import {
  getTrimmedData,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

const SampleTypeCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [Color, setColor] = useState([]);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [formData, setFormData] = useState({
    SampleName: state?.data?.SampleName ? state?.data?.SampleName : "",
    Container: state?.data?.Container ? state?.data?.Container : "",
    ColorName: state?.data?.ColorName ? state?.data?.ColorName : "red",
    isActive: state?.data?.isActive ? state?.data?.isActive : "",
    id: state?.data?.id ? state?.data?.id : "",
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

        switch (name) {
          case "Color":
            setColor(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  console.log(formData);

  const postData = () => {
    let generatedError = validationForSampleType(formData);
    if (generatedError === "") {
      setLoad(true);
      axios
        .post(state?.url, getTrimmedData(formData))
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            navigate("/SampleType");
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
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setFormData({ ...formData, [name]: event.value });
  };

  useEffect(() => {
    getDropDownData("Color");
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Sample Type Master</a>
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">
              {state?.other?.pageName ? state?.other?.pageName : "Create"}
            </span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form group">
                <label className="control-label">SampleName</label>
                <Input
                  className="form-control  pull-right reprint-date required"
                  name="SampleName"
                  type="text"
                  onChange={handleChange}
                  value={formData?.SampleName}
                />
                <div className="field-validation-valid text-danger">
                  {err?.SampleName}
                </div>
              </div>
              <div className="col-sm-2 form group">
                <label className="control-label">Container</label>

                <Input
                  className="form-control  pull-right reprint-date required"
                  name="Container"
                  onChange={handleChange}
                  value={formData?.Container}
                />
                <div className="field-validation-valid text-danger">
                  {err?.Container}
                </div>
              </div>
              <div className="col-sm-2 form group">
                <label className="control-label">ColorName</label>
                <SelectBox
                  options={Color}
                  name="ColorName"
                  selectedValue={selectedValueCheck(Color, formData?.ColorName)}
                  onChange={handleSelectChange}
                />
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
                  checked={formData?.isActive}
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
                <Link to="/SampleType" style={{ fontSize: "13px" }}>
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

export default SampleTypeCreate;
