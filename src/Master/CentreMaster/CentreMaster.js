import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginAllowed, PaymentMode } from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getTrimmedData,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import { number } from "../../Frontend/util/Commonservices/number";
import Loading from "../../Frontend/util/Loading";
import {
  CenterMasterValidationSchema,
  RateMasterValidationSchema,
} from "../../ValidationSchema";

const CentreMaster = () => {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [Invoice, setInvoice] = useState([]);
  const [load, setLoad] = useState(false);
  const [ProcessingLab, setProcessingLab] = useState([]);
  const [ReferenceRate, setReferenceRate] = useState([]);
  const [BarCodeLogic, setBarCodeLogic] = useState([]);
  const [VisitType, setVisitType] = useState([]);
  const [BusinessUnit, setBusinessUnit] = useState([]);
  const [CentreType, setCentreType] = useState([]);
  // Centre RateType ,rate=Processing Lab
  const [formData, setFormData] = useState({
    DataType: state?.data?.DataType ? state?.data?.DataType : "",
    CentreCode: state?.data?.CentreCode ? state?.data?.CentreCode : "",
    Centre: state?.data?.Centre ? state?.data?.Centre : "",
    CentreType: state?.data?.CentreType ? state?.data?.CentreType : "",
    InvoiceTo: state?.data?.InvoiceTo ? state?.data?.InvoiceTo : "",
    BusinessUnit: state?.data?.BusinessUnit ? state?.data?.BusinessUnit : "",
    ProcessingLab: state?.data?.ProcessingLab ? state?.data?.ProcessingLab : "",
    ReferenceRate: state?.data?.ReferenceRate ? state?.data?.ReferenceRate : "",
    Address1: state?.data?.Address1 ? state?.data?.Address1 : "",
    Address2: state?.data?.Address2 ? state?.data?.Address2 : "",
    City: state?.data?.City ? state?.data?.City : "",
    BusinessZone: state?.data?.BusinessZone ? state?.data?.BusinessZone : "",
    State: state?.data?.State ? state?.data?.State : "",
    Country: state?.data?.Country ? state?.data?.Country : "",
    Pincode: state?.data?.Pincode ? state?.data?.Pincode : "",
    Email: state?.data?.Email ? state?.data?.Email : "",
    LandLineNo: state?.data?.LandLineNo ? state?.data?.LandLineNo : "",
    Phone: state?.data?.Phone ? state?.data?.Phone : "",
    StateCode: state?.data?.StateCode ? state?.data?.StateCode : "",
    Fax: state?.data?.Fax ? state?.data?.Fax : "",
    Url: state?.data?.Url ? state?.data?.Url : "",
    PaymentMode: state?.data?.PaymentMode ? state?.data?.PaymentMode : "",
    VisitType: state?.data?.VisitType ? state?.data?.VisitType : "",
    BarcodeLogic: state?.data?.BarcodeLogic ? state?.data?.BarcodeLogic : "",
    SampleCollectandReceive: state?.data?.SampleCollectandReceive
      ? state?.data?.SampleCollectandReceive
      : "",
    CityZone: state?.data?.CityZone ? state?.data?.CityZone : "",
    ReferenceRate1: state?.data?.ReferenceRate1
      ? state?.data?.ReferenceRate1
      : "",
    ReferenceRate2: state?.data?.ReferenceRate2
      ? state?.data?.ReferenceRate2
      : "",
    IsTrfRequired: state?.data?.IsTrfRequired ? state?.data?.IsTrfRequired : "",
    isActive: state?.data?.isActive ? state?.data?.isActive : "1",
    CentreID: state?.data?.CentreID ? state?.data?.CentreID : "0",
    UserName: state?.data?.Username ? state?.data?.Username : "",
    Password: state?.data?.Password ? state?.data?.Password : "",
    isAllowedLogin: state?.data?.IsAllowedLogin
      ? state?.data?.IsAllowedLogin
      : "0",
    userLoginID: state?.data?.userLoginID ? state?.data?.userLoginID : "0",
  });

  useEffect(() => {
    if (name === "center") {
      setFormData({
        CentreID: state?.data?.CentreID ? state?.data?.CentreID : "",
        DataType: state?.data?.DataType ? state?.data?.DataType : "Centre",
        CentreCode: state?.data?.CentreCode ? state?.data?.CentreCode : "",
        Centre: state?.data?.Centre ? state?.data?.Centre : "",
        CentreType: state?.data?.CentreType
          ? state?.data?.CentreType
          : "Booking",
        InvoiceTo: state?.data?.InvoiceTo ? state?.data?.InvoiceTo : 0,
        BusinessUnit: state?.data?.BusinessUnit ? state?.data?.BusinessUnit : 0,
        ProcessingLab: state?.data?.ProcessingLab
          ? state?.data?.ProcessingLab
          : 0,
        ReferenceRate: state?.data?.ReferenceRate
          ? state?.data?.ReferenceRate
          : 0,
        Address1: state?.data?.Address1 ? state?.data?.Address1 : "",
        Address2: state?.data?.Address2 ? state?.data?.Address2 : "",
        City: state?.data?.City ? state?.data?.City : "",
        BusinessZone: state?.data?.BusinessZone
          ? state?.data?.BusinessZone
          : "",
        State: state?.data?.State ? state?.data?.State : "",
        Country: state?.data?.Country ? state?.data?.Country : "",
        Pincode: state?.data?.Pincode ? state?.data?.Pincode : "",
        Email: state?.data?.Email ? state?.data?.Email : "",
        LandLineNo: state?.data?.LandLineNo ? state?.data?.LandLineNo : "",
        Phone: state?.data?.Phone ? state?.data?.Phone : "",
        StateCode: state?.data?.StateCode ? state?.data?.StateCode : "",
        Fax: state?.data?.Fax ? state?.data?.Fax : "",
        Url: state?.data?.Url ? state?.data?.Url : "",
        PaymentMode: state?.data?.PaymentMode
          ? state?.data?.PaymentMode
          : "Cash",
        VisitType: state?.data?.VisitType ? state?.data?.VisitType : "1",
        BarcodeLogic: state?.data?.BarcodeLogic ? state?.data?.BarcodeLogic : 1,
        SampleCollectandReceive: state?.data?.SampleCollectandReceive
          ? state?.data?.SampleCollectandReceive
          : "",
        CityZone: state?.data?.CityZone ? state?.data?.CityZone : "",
        ReferenceRate1: state?.data?.ReferenceRate1
          ? state?.data?.ReferenceRate1
          : 0,
        ReferenceRate2: state?.data?.ReferenceRate2
          ? state?.data?.ReferenceRate2
          : 0,
        IsTrfRequired: state?.data?.IsTrfRequired
          ? state?.data?.IsTrfRequired
          : "",
        isActive: state?.data ? state?.data?.isActive : "1",
        CentreID: state?.data?.CentreID ? state?.data?.CentreID : "0",
        UserName: state?.data?.Username ? state?.data?.Username : "",
        Password: state?.data?.Password ? state?.data?.Password : "",
        isAllowedLogin: state?.data?.IsAllowedLogin
          ? state?.data?.IsAllowedLogin
          : "0",
        userLoginID: state?.data?.userLoginID ? state?.data?.userLoginID : "0",
      });
    } else if (name === "Rate") {
      setFormData({
        CentreID: state?.data?.CentreID ? state?.data?.CentreID : "",
        DataType: state?.data?.DataType ? state?.data?.DataType : "RateType",
        CentreCode: state?.data?.CentreCode ? state?.data?.CentreCode : "",
        Centre: state?.data?.Centre ? state?.data?.Centre : "",
        CentreType: state?.data?.CentreType ? state?.data?.CentreType : "",
        InvoiceTo: state?.data?.InvoiceTo ? state?.data?.InvoiceTo : 0,
        BusinessUnit: state?.data?.BusinessUnit ? state?.data?.BusinessUnit : 0,
        ProcessingLab: state?.data?.ProcessingLab
          ? state?.data?.ProcessingLab
          : 0,
        ReferenceRate: state?.data?.ReferenceRate
          ? state?.data?.ReferenceRate
          : 0,
        Address1: state?.data?.Address1 ? state?.data?.Address1 : "",
        Address2: state?.data?.Address2 ? state?.data?.Address2 : "",
        City: state?.data?.City ? state?.data?.City : "",
        BusinessZone: state?.data?.BusinessZone
          ? state?.data?.BusinessZone
          : "",
        State: state?.data?.State ? state?.data?.State : "",
        Country: state?.data?.Country ? state?.data?.Country : "",
        Pincode: state?.data?.Pincode ? state?.data?.Pincode : "",
        Email: state?.data?.Email ? state?.data?.Email : "",
        LandLineNo: state?.data?.LandLineNo ? state?.data?.LandLineNo : "",
        Phone: state?.data?.Phone ? state?.data?.Phone : "",
        StateCode: state?.data?.StateCode ? state?.data?.StateCode : "",
        Fax: state?.data?.Fax ? state?.data?.Fax : "",
        Url: state?.data?.Url ? state?.data?.Url : "",
        PaymentMode: state?.data?.PaymentMode
          ? state?.data?.PaymentMode
          : "Cash",
        VisitType: state?.data?.VisitType ? state?.data?.VisitType : "1",
        BarcodeLogic: state?.data?.BarcodeLogic ? state?.data?.BarcodeLogic : 1,
        SampleCollectandReceive: state?.data?.SampleCollectandReceive
          ? state?.data?.SampleCollectandReceive
          : "",
        CityZone: state?.data?.CityZone ? state?.data?.CityZone : "",
        ReferenceRate1: state?.data?.ReferenceRate1
          ? state?.data?.ReferenceRate1
          : 0,
        ReferenceRate2: state?.data?.ReferenceRate2
          ? state?.data?.ReferenceRate2
          : 0,
        IsTrfRequired: state?.data?.IsTrfRequired
          ? state?.data?.IsTrfRequired
          : "",
        isActive: state?.data ? state?.data?.isActive : "1",
        CentreID: state?.data?.CentreID ? state?.data?.CentreID : "0",
        UserName: state?.data?.Username ? state?.data?.Username : "",
        Password: state?.data?.Password ? state?.data?.Password : "",
        isAllowedLogin: state?.data?.IsAllowedLogin
          ? state?.data?.IsAllowedLogin
          : "0",
        userLoginID: state?.data?.userLoginID ? state?.data?.userLoginID : "0",
      });
    }
  }, [name]);

  const getInvoiceTo = () => {
    axios
      .get("/api/v1/Centre/CentreInvoiceToList")
      .then((res) => {
        let data = res.data.message;

        let InvoiceData = data.map((ele) => {
          return {
            value: ele.InvoiceID,
            label: ele.Invoice,
          };
        });
        InvoiceData.unshift({ label: "Self", value: "0" });
        setInvoice(InvoiceData);
      })
      .catch((err) => console.log(err));
  };
  const getCentreBusinessUnit = () => {
    axios
      .get("/api/v1/Centre/CentreBusinessUnit")
      .then((res) => {
        let data = res.data.message;
        let CentreBusinessUnit = data.map((ele) => {
          return {
            value: ele.BusinessUnitID,
            label: ele.BusinessUnit,
          };
        });
        CentreBusinessUnit.unshift({ label: "Self", value: "0" });
        setBusinessUnit(CentreBusinessUnit);
      })
      .catch((err) => console.log(err));
  };
  const getCentreProcessingLab = () => {
    axios
      .get("/api/v1/Centre/CentreProcessingLab")
      .then((res) => {
        let data = res.data.message;
        let CentreLab = data.map((ele) => {
          return {
            value: ele.ProcessingLabID,
            label: ele.ProcessingLab,
          };
        });
        CentreLab.unshift({ label: "Self", value: "0" });
        setProcessingLab(CentreLab);
      })
      .catch((err) => console.log(err));
  };

  const handleCheckDuplicate = () => {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/v1/Centre/checkDuplicateCentreCode", {
          CentreCode: formData?.CentreCode,
          CentreID: formData?.CentreID != 0 ? formData?.CentreID : "",
        })
        .then((res) => {
          if (res?.data?.message === "Duplicate CentreCode.") {
            toast.error(res?.data?.message);
            setFormData({ ...formData, CentreCode: "" });
          }
          resolve(res?.data?.message);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          reject(err);
        });
    });
  };
  const getReferenceRate = () => {
    axios
      .get("/api/v1/Centre/CentreReferRateList")
      .then((res) => {
        let data = res.data.message;
        let CentreReferRate = data.map((ele) => {
          return {
            value: ele.ReferenceRateID,
            label: ele.ReferenceRate,
          };
        });
        CentreReferRate.unshift({ label: "Self", value: "0" });
        setReferenceRate(CentreReferRate);
      })
      .catch((err) => console.log(err));
  };

  const getVisitTypeList = () => {
    axios
      .get("/api/v1/Centre/visitTypeList")
      .then((res) => {
        let data = res.data.message;
        let VisitTypeList = data.map((ele) => {
          return {
            value: ele.FieldID,
            label: ele.FieldDisplay,
          };
        });
        setVisitType(VisitTypeList);
      })
      .catch((err) => console.log(err));
  };
  const getBarCodeLogic = () => {
    axios
      .get("/api/v1/Centre/BarcodeLogicList")
      .then((res) => {
        let data = res.data.message;
        let Barcode = data.map((ele) => {
          return {
            value: ele.BarcodeID,
            label: ele.BarcodeDisplay,
          };
        });
        setBarCodeLogic(Barcode);
      })
      .catch((err) => console.log(err));
  };

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
          case "CentreType":
            setCentreType(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: formData,
    enableReinitialize: state?.url ? true : true,
    validationSchema:
      name === "center"
        ? CenterMasterValidationSchema
        : RateMasterValidationSchema,
    onSubmit: (values) => {
      setLoad(true);
      handleCheckDuplicate().then((res) => {
        if (res === "Duplicate CentreCode.") {
        } else {
          axios
            .post(
              state?.url ? state?.url : "/api/v1/Centre/InsertCentre",
              getTrimmedData(values)
            )
            .then((res) => {
              if (res.data.message) {
                navigate(`/CentreMasterList/${name}`);
                toast.success(res.data.message);
                setLoad(false);
              } else {
                toast.error("Something went wrong");
                toast.success(res.data.message);
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
        }
      });
    },
  });

  console.log(errors);
  //   handleCheckDuplicate().then((res) => {
  //     if (res === "Duplicate CentreCode.") {
  //     } else {
  //       setLoad(true);
  //       axios
  //         .post(
  //           state?.url ? state?.url : "/api/v1/Centre/InsertCentre",
  //           getTrimmedData(formData)
  //         )
  //         .then((res) => {
  //           if (
  //             res.data.message === "This record Insert Successfully." ||
  //             res.data.message === "This record Updated Successfully."
  //           ) {
  //             navigate(`/CentreMasterList/${name}`);
  //             toast.success(res.data.message);
  //             setLoad(false);
  //           } else {
  //             toast.success(res.data.message);
  //             setLoad(false);
  //           }
  //         })
  //         .catch((err) => {
  //           toast.error(err?.response?.data?.message);
  //           if (err?.response?.status === 504) {
  //             toast.error("Something went wrong");
  //           }
  //           setLoad(false);
  //         });
  //     }
  //   });
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setFormData({ ...formData, [name]: event.value });
  };
  console.log(formData);

  useEffect(() => {
    getInvoiceTo();
    getCentreProcessingLab();
    getCentreProcessingLab();
    getReferenceRate();
    getBarCodeLogic();
    getVisitTypeList();
    getCentreBusinessUnit();
    getDropDownData("CentreType");
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">{name === "center" ? "Centre" : "RateType"}</a>
          </li>
          <li className="breadcrumb-item active">
            {state?.other?.pageName ? state?.other?.pageName : "Create"}
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="row">
              {name === "center" ? (
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label" htmlFor="CentreType">
                    Type
                  </label>

                  <SelectBox
                    options={CentreType}
                    onChange={handleSelectChange}
                    name="CentreType"
                    selectedValue={selectedValueCheck(
                      CentreType,
                      formData?.CentreType
                    )}
                    isDisabled={state?.data?.CentreType ? true : false}
                  />
                </div>
              ) : null}
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="CentreType">
                  Code
                </label>
                <Input
                  className="form-control required pull-right reprint-date"
                  onChange={handleChange}
                  value={formData?.CentreCode}
                  name="CentreCode"
                  onBlur={handleCheckDuplicate}
                  onInput={(e) => number(e, 10)}
                />
                {errors?.CentreCode && touched?.CentreCode && (
                  <div className="golbal-Error">{errors?.CentreCode}</div>
                )}
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="Centre">
                  Name
                </label>
                <Input
                  className="form-control required pull-right reprint-date"
                  onChange={handleChange}
                  value={formData?.Centre}
                  name="Centre"
                  onBlur={handleBlur}
                />
                {errors?.Centre && touched?.Centre && (
                  <div className="golbal-Error">{errors?.Centre}</div>
                )}
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label">Address1</label>
                <Input
                  className="form-control pull-right reprint-date"
                  onChange={handleChange}
                  value={formData?.Address1}
                  name="Address1"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label">Address2</label>
                <Input
                  className="form-control pull-right reprint-date"
                  onChange={handleChange}
                  value={formData?.Address2}
                  name="Address2"
                />
              </div>
              <div className="col-sm-1 col-md-1 form-group">
                <label className="control-label" htmlFor="Pincode">
                  Pincode
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  onInput={(e) => number(e, 6)}
                  type="number"
                  onChange={handleChange}
                  value={formData?.Pincode}
                  name="Pincode"
                />
              </div>
              <div className="col-sm-1 col-md-1 form-group">
                <label className="control-label" htmlFor="City">
                  City
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  onChange={handleChange}
                  value={formData?.City}
                  name="City"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="State">
                  State
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  onChange={handleChange}
                  value={formData?.State}
                  name="State"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="Country">
                  Country
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  onChange={handleChange}
                  value={formData?.Country}
                  name="Country"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="CentreType">
                  CityZone
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  onChange={handleChange}
                  value={formData?.CityZone}
                  name="CityZone"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="Email">
                  Email
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  onChange={handleChange}
                  value={formData?.Email}
                  name="Email"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="Phone">
                  Phone
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  onInput={(e) => number(e, 15)}
                  type="number"
                  onChange={handleChange}
                  value={formData?.Phone}
                  name="Phone"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="LandLineNo">
                  LandLineNo
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  onInput={(e) => number(e, 20)}
                  type="number"
                  onChange={handleChange}
                  value={formData?.LandLineNo}
                  name="LandLineNo"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="Website">
                  Website
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  onChange={handleChange}
                  name="Url"
                  value={formData?.Url}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="BusinessZone">
                  BusinessZone
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  onChange={handleChange}
                  value={formData?.BusinessZone}
                  name="BusinessZone"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="StateCode">
                  StateCode
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  onChange={handleChange}
                  value={formData?.StateCode}
                  name="StateCode"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="Fax">
                  Fax
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  onChange={handleChange}
                  value={formData?.Fax}
                  name="Fax"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="PaymentMode">
                  PaymentMode
                </label>
                :
                <SelectBox
                  options={PaymentMode}
                  name="PaymentMode"
                  selectedValue={selectedValueCheck(
                    PaymentMode,
                    formData?.PaymentMode
                  )}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="VisitType">
                  VisitType
                </label>
                <SelectBox
                  options={VisitType}
                  name="VisitType"
                  selectedValue={selectedValueCheck(
                    VisitType,
                    formData?.VisitType
                  )}
                  onChange={handleSelectChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">
              Billing Details
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              {name === "center" ? (
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label" htmlFor="InvoiceTo">
                    InvoiceTo
                  </label>
                  <SelectBox
                    options={Invoice}
                    name="InvoiceTo"
                    selectedValue={selectedValueCheck(
                      Invoice,
                      formData?.InvoiceTo
                    )}
                    onChange={handleSelectChange}
                  />
                </div>
              ) : null}
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="BusinessUnit">
                  BusinessUnit
                </label>
                <SelectBox
                  options={BusinessUnit}
                  selectedValue={selectedValueCheck(
                    BusinessUnit,
                    formData?.BusinessUnit
                  )}
                  name="BusinessUnit"
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="Tag Processing Lab">
                  Tag Processing Lab
                </label>
                <SelectBox
                  options={ProcessingLab}
                  name="ProcessingLab"
                  selectedValue={selectedValueCheck(
                    ProcessingLab,
                    formData?.ProcessingLab
                  )}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="ReferenceRate">
                  Rate Type
                </label>
                <SelectBox
                  options={ReferenceRate}
                  name="ReferenceRate"
                  selectedValue={selectedValueCheck(
                    ReferenceRate,
                    formData?.ReferenceRate
                  )}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="ReferenceRate1">
                  Rate Type1
                </label>
                <SelectBox
                  options={ReferenceRate}
                  name="ReferenceRate1"
                  selectedValue={selectedValueCheck(
                    ReferenceRate,
                    formData?.ReferenceRate1
                  )}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="ReferenceRate2">
                  Rate Type2
                </label>
                <SelectBox
                  options={ReferenceRate}
                  name="ReferenceRate2"
                  selectedValue={selectedValueCheck(
                    ReferenceRate,
                    formData?.ReferenceRate2
                  )}
                  onChange={handleSelectChange}
                />
              </div>
              {name === "center" ? (
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label" htmlFor="BarcodeLogic">
                    BarcodeLogic
                  </label>
                  <SelectBox
                    options={BarCodeLogic}
                    name="BarcodeLogic"
                    selectedValue={selectedValueCheck(
                      BarCodeLogic,
                      formData?.BarcodeLogic
                    )}
                    onChange={handleSelectChange}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {name === "Rate" ? (
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Login Details
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-2 col-md-2">
                  <label className="control-label" htmlFor="allowLogin">
                    LoginAllowed
                  </label>
                  <SelectBox
                    options={LoginAllowed}
                    name="isAllowedLogin"
                    selectedValue={selectedValueCheck(
                      LoginAllowed,
                      formData?.isAllowedLogin
                    )}
                    onChange={handleSelectChange}
                  />
                </div>
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label" htmlFor="UserName">
                    UserName
                  </label>
                  <Input
                    className="form-control required pull-right reprint-date"
                    maxLength={20}
                    name="UserName"
                    type="text"
                    onChange={handleChange}
                    value={formData?.UserName}
                    onBlur={handleBlur}
                  />
                  {errors?.Password && touched?.Password && (
                    <div className="golbal-Error">{errors?.Password}</div>
                  )}
                </div>
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label" htmlFor="Password">
                    Password
                  </label>
                  <Input
                    className="form-control required pull-right reprint-date"
                    name="Password"
                    type="password"
                    maxLength={12}
                    onChange={handleChange}
                    value={formData?.Password}
                    onBlur={handleBlur}
                  />
                  {errors?.Password && touched?.Password && (
                    <div className="golbal-Error">{errors?.Password}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-sm-1 ml-2">
                <Input
                  name="isActive"
                  type="checkbox"
                  onChange={handleChange}
                  checked={formData?.isActive}
                />
                <label htmlFor="isActive">Active</label>
              </div>

              {name === "center" ? (
                <>
                  <div className="col-sm-2">
                    <Input
                      name="SampleCollectandReceive"
                      type="checkbox"
                      onChange={handleChange}
                      checked={formData?.SampleCollectandReceive}
                    />
                    <label htmlFor="SampleCollectandReceive">
                      Sample Collect & Receive
                    </label>
                  </div>
                  <div className="col-sm-2">
                    <Input
                      name="IsTrfRequired"
                      type="checkbox"
                      onChange={handleChange}
                      checked={formData?.IsTrfRequired}
                    />
                    <label htmlFor="IsTrfRequired">IsTrfRequired</label>
                  </div>
                </>
              ) : null}
              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button className="btn btn-success" onClick={handleSubmit}>
                    {state?.other?.button ? state?.other?.button : "Save"}
                  </button>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <Link
                  to={`/CentreMasterList/${name}`}
                  style={{ fontSize: "13px" }}
                >
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

export default CentreMaster;
