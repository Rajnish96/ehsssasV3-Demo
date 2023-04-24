import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  BindFieldType,
  getTrimmedData,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

function GlobalTypeMaster() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  console.log(state);
  const [FieldType, setFieldType] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    FieldType: "",
    FieldDisplay: "",
    IsActive: "1",
  });

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  const handleChange = (e) => {
    const { checked } = e.target;
    setPayload({ ...payload, IsActive: checked ? "1" : "0" });
  };

  const validations = (payload) => {
    let err = "";
    if (payload?.FieldType === "") {
      err = "please Choose Field Type";
    } else if (payload?.FieldDisplay === "") {
      err = "please Enter Field Display";
    }

    return err;
  };

  const handleSubmit = () => {
    const generated = validations(getTrimmedData(payload));
    if (generated === "") {
      setLoad(true);
      axios
        .post(
          state?.url ? state?.url : "/api/v1/Global/InsertGlobalData",
          getTrimmedData(payload)
        )
        .then((res) => {
          toast.success(res.data?.message);
          setLoad(false);
          if (payload?.FieldType === "SelectType") {
            setPayload({
              FieldType: "",
              FieldDisplay: "",
              IsActive: "1",
            });
            BindFieldType(setFieldType);
          } else {
            navigate("/ViewGlobalMaster");
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
      toast.error(generated);
    }
  };

  useEffect(() => {
    if (state?.data) {
      setPayload({
        FieldId: state?.data?.FieldId,
        FieldType: state?.data?.FieldType,
        FieldDisplay: state?.data?.FieldDisplay,
        IsActive: state?.data?.IsActive === 1 ? "1" : "0",
      });
    }
  }, []);

  useEffect(() => {
    BindFieldType(setFieldType);
  }, []);
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Global Type Master</a>
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Create
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  FieldType
                </label>
                <SelectBox
                  options={FieldType}
                  name="FieldType"
                  selectedValue={selectedValueCheck(
                    FieldType,
                    payload?.FieldType
                  )}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  FieldDisplay
                </label>
                <Input
                  className="form-control required pull-right reprint-date"
                  value={payload?.FieldDisplay}
                  onChange={(e) => {
                    setPayload({ ...payload, FieldDisplay: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-start">
              <div className="mx-2">
                <Input
                  type="checkbox"
                  checked={payload?.IsActive === "1" ? true : false}
                  onChange={handleChange}
                />
                <label className="control-label " htmlFor="DataType">
                  Active
                </label>
              </div>

              <div className="mx-2">
                {load ? (
                  <Loading />
                ) : (
                  <button className="btn btn-success" onClick={handleSubmit}>
                    {state?.url ? "Update" : "Create"}
                  </button>
                )}
              </div>

              <div className="mx-2">
                <Link to="/ViewGlobalMaster">Back to List</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalTypeMaster;
