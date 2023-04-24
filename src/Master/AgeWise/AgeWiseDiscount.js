import React, { useState, useEffect } from "react";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import { validationForAgeWise } from "../../ChildComponents/validations";
import { number } from "../../Frontend/util/Commonservices/number";
import {
  getTrimmedData,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Input from "../../ChildComponents/Input";
import Loading from "../../Frontend/util/Loading";

const AgeWiseDiscount = () => {
  const [Gender, setGender] = useState([]);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [DiscountShareType, setDiscountShareType] = useState([]);

  const location = useLocation();
  const { state } = location;

  const [formData, setFormData] = useState({
    DiscountType: state?.data?.DiscountType ? state?.data?.DiscountType : "",
    DiscountPer: state?.data?.DiscountPer ? state?.data?.DiscountPer : "",
    FromValidityDate: state?.data?.FromValidityDate
      ? moment(state?.data?.FromValidityDate).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD"),
    ToValidityDate: state?.data?.ToValidityDate
      ? moment(state?.data?.ToValidityDate).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD"),
    Gender: state?.data?.Gender ? state?.data?.Gender : "Both",
    DiscountShareType: state?.data?.DiscountShareType
      ? state?.data?.DiscountShareType
      : "Client Share",
    ApplicableForAll: state?.data?.ApplicableForAll
      ? state?.data?.ApplicableForAll
      : "1",
    IsCouponRequired: state?.data?.IsCouponRequired
      ? state?.data?.IsCouponRequired
      : "",
    RateTypeId: "0",
    DiscountId: state?.data?.DiscountId ? state?.data?.DiscountId : "",
    ID: state?.data?.Id ? state?.data?.Id : "",
    isActive: state?.data?.isActiveStatus ? state?.data?.isActive : 1,
    FromAge: state?.data?.FromAge ? state?.data?.FromAge : "",
    ToAge: state?.data?.ToAge ? state?.data?.ToAge : "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setFormData({ ...formData, [name]: event.value });
  };

  const navigate = useNavigate();

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
          case "Gender":
            setGender(value);
            break;
          case "DiscountShareType":
            setDiscountShareType(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const Api = () => {
    let generatedError = validationForAgeWise(formData);
    if (generatedError === "") {
      setLoad(true);
      axios
        .post(
          state?.url
            ? state?.url
            : "/api/v1/AgeWiseDiscount/InsertAgeWiseDiscountData",
          getTrimmedData({
            ...formData,
            IsCouponRequired: formData?.IsCouponRequired ? 1 : 0,
            isActive: formData?.isActive ? 1 : 0,
            ApplicableForAll: formData?.ApplicableForAll ? 1 : 0,
          })
        )
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            navigate("/AgeWiseDiscountList");
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

  useEffect(() => {
    getDropDownData("Gender");
    getDropDownData("DiscountShareType");
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Discount Master</a>
          </li>
          <li className="breadcrumb-item active">
            {state?.other?.pageName ? state?.other?.pageName : "Create"}
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">
              Manage Discount
            </span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="DiscountType">
                  Discount Type
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date required"
                  maxLength={20}
                  name="DiscountType"
                  type="text"
                  value={formData.DiscountType}
                  onChange={handleChange}
                />
                {formData.DiscountType === "" && (
                  <div className="field-validation-valid text-danger">
                    {err?.DiscountType}
                  </div>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="DiscountType">
                  Discount Per.(%)
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date required"
                  name="DiscountPer"
                  type="number"
                  value={formData.DiscountPer}
                  onChange={handleChange}
                  onInput={(e) => number(e, 3)}
                />
                {formData.DiscountPer === "" && (
                  <div className="field-validation-valid text-danger">
                    {err?.DiscountPer}
                  </div>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label " htmlFor="FromValidityDate">
                  From Validity Date
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date required"
                  name="FromValidityDate"
                  type="date"
                  value={formData?.FromValidityDate}
                  onChange={handleChange}
                  min={moment().format("YYYY-MM-DD")}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label " htmlFor="FromValidityDate">
                  To Validity Date
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date required"
                  name="ToValidityDate"
                  type="date"
                  value={formData?.ToValidityDate}
                  onChange={handleChange}
                  min={moment(formData?.FromValidityDate).format("YYYY-MM-DD")}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="FromAge">
                  From Age (In Years)
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date required"
                  id="FromAge"
                  onInput={(e) => number(e, 3)}
                  name="FromAge"
                  value={formData?.FromAge}
                  type="number"
                  onChange={handleChange}
                />
                {formData?.FromAge === "" && (
                  <div className="field-validation-valid text-danger">
                    {err?.FromAge}
                  </div>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="ToAge">
                  To Age (In Years)
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date required"
                  onInput={(e) => number(e, 3)}
                  name="ToAge"
                  value={formData?.ToAge}
                  type="number"
                  onChange={handleChange}
                />
                {formData?.ToAge === "" && (
                  <div className="field-validation-valid text-danger">
                    {err?.ToAge}
                  </div>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Gender">
                  Gender
                </label>
                :
                <SelectBox
                  options={Gender}
                  selectedValue={selectedValueCheck(Gender, formData?.Gender)}
                  onChange={handleSelectChange}
                  name="Gender"
                />
                {formData.Gender === "" && (
                  <div className="field-validation-valid text-danger">
                    {err?.Gender}
                  </div>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="DiscountShareType">
                  Discount Share Type
                </label>
                :
                <SelectBox
                  options={DiscountShareType}
                  selectedValue={selectedValueCheck(
                    DiscountShareType,
                    formData?.DiscountShareType
                  )}
                  onChange={handleSelectChange}
                  name="DiscountShareType"
                />
                {formData.DiscountShareType === "" && (
                  <div className="field-validation-valid text-danger">
                    {err?.DiscountShareType}
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="ApplicableForAll">
                  Applicable For All
                </label>
                :
                <SimpleCheckbox
                  type="checkbox"
                  name="ApplicableForAll"
                  checked={formData?.ApplicableForAll}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="IsCouponRequired">
                  Is Coupon Required
                </label>
                :
                <SimpleCheckbox
                  type="checkbox"
                  name="IsCouponRequired"
                  checked={formData?.IsCouponRequired}
                  onChange={handleChange}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-sm-12 col-md-12">
                <div className="col-sm-1 form-group">
                  <SimpleCheckbox
                    name="isActive"
                    type="checkbox"
                    checked={formData?.isActive}
                    onChange={handleChange}
                  />
                  <label className="labels">Active</label>
                </div>
                <div className="col-sm-1 form-group">
                  {load ? (
                    <Loading />
                  ) : (
                    <button
                      type="submit"
                      id="btnSave"
                      className="btn btn-success "
                      title="Create"
                      onClick={Api}
                    >
                      {state?.other?.button ? state?.other?.button : "Save"}
                    </button>
                  )}
                </div>
                <div className="col-sm-2 form-group">
                  <Link to="/AgeWiseDiscountList" style={{ fontSize: "13px" }}>
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

export default AgeWiseDiscount;
