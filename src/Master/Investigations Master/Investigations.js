import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DataType,
  ReportTypeNew,
  SampleOption,
} from "../../ChildComponents/Constants";
import {
  SelectBox,
  SelectBoxWithCheckbox,
} from "../../ChildComponents/SelectBox";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import Input from "../../ChildComponents/Input";
import { number } from "../../Frontend/util/Commonservices/number";
import Loading from "../../Frontend/util/Loading";
import {
  getTrimmedData,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import {
  InvestigationsMasterSchema,
  ProfileInvestigationsMasterSchema,
} from "../../ValidationSchema";
import { useFormik } from "formik";

const Investigations = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [MapTest, setMapTest] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(true);
  const [SampleType, setSampleType] = useState([]);
  const [LogisticTemp, setLogisticTemp] = useState([]);
  const [SampleTypeID, setSampleTypeID] = useState([]);
  const [RequiredAttachment, setRequiredAttachment] = useState([]);
  const [ConcentForm, setConcentForm] = useState([]);
  const [SampleContainer, setSampleContainer] = useState([]);
  const [BillingCategory, setBillingCategory] = useState([]);
  const [MapTestTableData, setMapTestTableData] = useState([]);
  const [Gender, setGender] = useState([]);
  const [formData, setFormData] = useState({
    InvestigationID: "",
    ConcentForm: "",
    PrintName: "",
    DataType: "Test",
    TestName: "",
    DepartmentID: "1",
    TestCode: "",
    ReportType: "",
    isActive: "1",
    FromAge: "",
    ToAge: "",
    MethodName: "",
    SampleType: "",
    SampleOption: "Sample Not Required",
    SampleQty: "",
    SampleRemarks: "",
    BaseRate: "",
    MaxRate: "",
    MicroReportType: "",
    Gender: "",
    BillingCategory: "1",
    AutoConsume: "",
    SampleContainer: "",
    LogisticTemp: "",
    IsMultipleDoctor: "",
    PrintCumulative: "",
    Reporting: "",
    PrintSampleName: "",
    Booking: "",
    showPatientReport: "",
    ShowAnalysisReport: "",
    OnlineReport: "",
    AutoSave: "",
    PrintSeparate: "",
    Urgent: "",
    IsOrganism: "",
    IsCultureReport: "",
    IsMic: "",
    IsOutSource: "",
    SampleDefined: "",
    SampleTypeID: "",
    RequiredAttachment: "",
    isMandatory: "",
    MethodName: "",
  });

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: formData,
    enableReinitialize: state?.url ? true : true,
    validationSchema:
      formData?.DataType === "Profile"
        ? ProfileInvestigationsMasterSchema
        : InvestigationsMasterSchema,
    onSubmit: (values) => {
      setLoad(true);
      axios
        .post(
          state?.url
            ? state?.url
            : "/api/v1/Investigations/CreateInvestigation",
          getTrimmedData({
            Observation: MapTestTableData,
            Investigation: [values],
          })
        )
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            navigate("/InvestigationsList");
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
    },
  });

  const Fetch = () => {
    if (state?.url1) {
      axios
        .get(state?.url1)
        .then((res) => {
          const data = res.data;
          setFormData(data?.InvDetails);
          setMapTestTableData(data?.ObservationData);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleMultiSelect = (select, name) => {
    setSampleTypeID(select);
    let val = "";
    for (let i = 0; i < select.length; i++) {
      val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
    }
    setFormData({ ...formData, [name]: val, SampleTypeID: select[0]?.value });
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    if (name === "TestId") {
      const ItemIndex = MapTestTableData.findIndex(
        (e) => e.TestId === event?.value
      );
      if (ItemIndex === -1) {
        setMapTestTableData([
          ...MapTestTableData,
          {
            TestId: event?.value,
            TestName: event?.label,
            TestPrefix: "",
            Header: 0,
            Critical: 0,
            AMR: "",
            Reflex: "",
            Comment: 0,
            Bold: 0,
            Underline: 0,
            PrintSeprate: 0,
            HelpValue: 0,
            dlcCheck: 0,
          },
        ]);
      } else {
        toast.error("Duplicate Test Found");
      }
    } else {
      setFormData({ ...formData, [name]: event.value });
    }
  };

  const handleChanges = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const getInvestigationList = () => {
    axios
      .get("/api/v1/Investigations/BindInvestigationList")
      .then((res) => {
        let data = res.data.message;
        setLoading(false);

        let MapTest = data.map((ele) => {
          return {
            value: ele.InvestigationID,
            label: ele.TestName,
          };
        });
        setMapTest(MapTest);
      })
      .catch((err) => console.log(err));
  };

  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };
  const getLogisticTemp = () => {
    axios
      .get("/api/v1/Investigations/BindLogisticTemp")
      .then((res) => {
        let data = res.data.message;
        let LogisticTemp = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        return setLogisticTemp(LogisticTemp);
      })
      .catch((err) => console.log(err));
  };
  const getRequiredAttachment = () => {
    axios
      .get("/api/v1/Investigations/BindRequiredAttachment")
      .then((res) => {
        let data = res.data.message;
        let RequiredAttachment = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        return setRequiredAttachment(RequiredAttachment);
      })
      .catch((err) => console.log(err));
  };
  const getConcentForm = () => {
    axios
      .get("/api/v1/Investigations/BindConcentForm")
      .then((res) => {
        let data = res.data.message;
        let ConcentForm = data.map((ele) => {
          return {
            value: ele.ID,
            label: ele.ConcentFormName,
          };
        });
        return setConcentForm(ConcentForm);
      })
      .catch((err) => console.log(err));
  };
  const getSampleContainer = () => {
    axios
      .get("/api/v1/Investigations/BindSampleContainer")
      .then((res) => {
        let data = res.data.message;
        let SampleContainer = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        return setSampleContainer(SampleContainer);
      })
      .catch((err) => console.log(err));
  };
  const getSampleType = () => {
    axios
      .get("/api/v1/SampleType/getSampleType")
      .then((res) => {
        let data = res.data.message;

        let SampleType = data.map((ele) => {
          return {
            value: ele.id,
            label: ele.SampleName,
          };
        });
        return setSampleType(SampleType);
      })
      .catch((err) => console.log(err));
  };
  const getBillingCategory = () => {
    axios
      .get("/api/v1/Investigations/BindBillingCategory")
      .then((res) => {
        let data = res.data.message;
        let BillingCategory = data.map((ele) => {
          return {
            value: ele.BillingCategoryId,
            label: ele.BillingCategoryName,
          };
        });
        return setBillingCategory(BillingCategory);
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
          case "Gender":
            setGender(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const handleMapTestChange = (e, index) => {
    const { name, value, checked, type } = e.target;
    const data = [...MapTestTableData];
    data[index][name] = type === "checkbox" ? (checked ? 1 : 0) : value;
    setMapTestTableData(data);
  };

  const handleFilter = (index) => {
    const data = MapTestTableData.filter((ele, i) => index !== i);
    setMapTestTableData(data);
    toast?.success("Removed Successfully");
  };
  const dragItem = useRef();

  const dragStart = (e, position) => {
    dragItem.current = position;
  };
  const dragOverItem = useRef();
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const drop = (e) => {
    const copyListItems = [...MapTestTableData];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setMapTestTableData(copyListItems);
  };

  useEffect(() => {
    getDropDownData("Gender");
    getDepartment();
    getSampleType();
    getLogisticTemp();
    getRequiredAttachment();
    getConcentForm();
    getSampleContainer();
    getBillingCategory();
    getInvestigationList();
    Fetch();
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Investigations</a>
          </li>
          <li className="breadcrumb-item active">
            {state?.other?.pageName ? state?.other?.pageName : "Create"}
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
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="DataType">
                  DataType
                </label>
                <SelectBox
                  onChange={handleSelectChange}
                  selectedValue={selectedValueCheck(
                    DataType,
                    formData?.DataType
                  )}
                  options={DataType.filter((ele) => ele.value !== "")}
                  name="DataType"
                  isDisabled={state?.url1 ? true : false}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="TestCode">
                  TestCode
                </label>
                <div>
                  <Input
                    className="form-control pull-right reprint-date required"
                    value={formData?.TestCode}
                    onChange={handleChanges}
                    name="TestCode"
                    onBlur={handleBlur}
                    maxLength={15}
                  />
                  {errors?.TestCode && touched?.TestCode && (
                    <span className="golbal-Error">{errors?.TestCode}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="TestName">
                  TestName
                </label>
                <div>
                  <Input
                    className="form-control pull-right reprint-date required"
                    value={formData?.TestName}
                    onChange={handleChanges}
                    name="TestName"
                    onBlur={handleBlur}
                  />
                  {errors?.TestName && touched?.TestName && (
                    <span className="golbal-Error">{errors?.TestName}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="PrintName">
                  Lab Report(Test Name)
                </label>
                <div>
                  <Input
                    className="form-control pull-right reprint-date required"
                    value={formData?.PrintName}
                    onChange={handleChanges}
                    name="PrintName"
                    onBlur={handleBlur}
                  />
                  {errors?.PrintName && touched?.PrintName && (
                    <span className="golbal-Error">{errors?.PrintName}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="DepartmentID">
                  DepartmentID
                </label>
                <SelectBox
                  options={DepartmentData}
                  sele
                  selectedValue={selectedValueCheck(
                    DepartmentData,
                    formData?.DepartmentID
                  )}
                  onChange={handleSelectChange}
                  name="DepartmentID"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="ReportType">
                  ReportType
                </label>
                <div>
                  <SelectBox
                    options={ReportTypeNew}
                    selectedValue={selectedValueCheck(
                      ReportTypeNew,
                      formData?.ReportType
                    )}
                    name="ReportType"
                    onChange={handleSelectChange}
                  />
                  {errors?.ReportType && touched?.ReportType && (
                    <span className="golbal-Error">{errors?.ReportType}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="SampleContainer">
                  SampleContainer
                </label>
                <SelectBox
                  options={SampleContainer}
                  selectedValue={selectedValueCheck(
                    SampleContainer,
                    formData?.SampleContainer
                  )}
                  name="SampleContainer"
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="Gender">
                  Gender
                </label>
                <div>
                  <SelectBox
                    options={Gender}
                    selectedValue={selectedValueCheck(Gender, formData?.Gender)}
                    onChange={handleSelectChange}
                    name="Gender"
                  />
                  {errors?.Gender && touched?.Gender && (
                    <span className="golbal-Error">{errors?.Gender}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="FromAge">
                  FromAge(Days)
                </label>
                <div>
                  <Input
                    className="form-control pull-right reprint-date required"
                    onChange={handleChanges}
                    value={formData?.FromAge}
                    name="FromAge"
                    onInput={(e) => number(e, 3)}
                    type="number"
                    onBlur={handleBlur}
                  />
                  {errors?.FromAge && touched?.FromAge && (
                    <span className="golbal-Error">{errors?.FromAge}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="ToAge">
                  ToAge(Days)
                </label>
                <div>
                  <Input
                    className="form-control pull-right reprint-date required"
                    onChange={handleChanges}
                    value={formData?.ToAge}
                    name="ToAge"
                    onInput={(e) => number(e, 3)}
                    type="number"
                    onBlur={handleBlur}
                  />
                  {errors?.ToAge && touched?.ToAge && (
                    <span className="golbal-Error">{errors?.ToAge}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="BillingCategory">
                  BillingCategory
                </label>
                <SelectBox
                  options={BillingCategory}
                  name="BillingCategory"
                  selectedValue={selectedValueCheck(
                    BillingCategory,
                    formData?.BillingCategory
                  )}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="SampleOption">
                  SampleOption
                </label>
                <SelectBox
                  selectedValue={selectedValueCheck(
                    SampleOption,
                    formData?.SampleOption
                  )}
                  options={SampleOption}
                  name="SampleOption"
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="SampleQty">
                  SampleQty
                </label>
                <div>
                  <Input
                    className="form-control pull-right reprint-date required"
                    onChange={handleChanges}
                    value={formData?.SampleQty}
                    name="SampleQty"
                    onBlur={handleBlur}
                  />
                  {errors?.SampleQty && touched?.SampleQty && (
                    <span className="golbal-Error">{errors?.SampleQty}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="SampleRemarks">
                  SampleRemarks
                </label>
                <div>
                  <Input
                    className="form-control pull-right reprint-date required"
                    onChange={handleChanges}
                    value={formData?.SampleRemarks}
                    name="SampleRemarks"
                    onBlur={handleBlur}
                  />
                  {errors?.SampleRemarks && touched?.SampleRemarks && (
                    <span className="golbal-Error">
                      {errors?.SampleRemarks}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="LogisticTemp">
                  LogisticTemp
                </label>
                <SelectBox
                  options={LogisticTemp}
                  selectedValue={selectedValueCheck(
                    LogisticTemp,
                    formData?.LogisticTemp
                  )}
                  onChange={handleSelectChange}
                  name="LogisticTemp"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="SampleType">
                  SampleType
                </label>
                <div>
                  <SelectBoxWithCheckbox
                    options={SampleType}
                    name="SampleType"
                    value={formData?.SampleType}
                    onChange={handleMultiSelect}
                    depends={setSampleTypeID}
                  />
                  {errors?.SampleType && touched?.SampleType && (
                    <span className="golbal-Error">{errors?.SampleType}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="SampleTypeID">
                  SampleTypeID
                </label>
                <SelectBox
                  selectedValue={selectedValueCheck(
                    SampleTypeID,
                    formData?.SampleTypeID
                  )}
                  options={SampleTypeID}
                  onChange={handleSelectChange}
                  name="SampleTypeID"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="ConcentForm">
                  Concent Form
                </label>
                <SelectBox
                  options={ConcentForm}
                  selectedValue={selectedValueCheck(
                    ConcentForm,
                    formData?.ConcentForm
                  )}
                  onChange={handleSelectChange}
                  name="ConcentForm"
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="BaseRate">
                  BaseRate
                </label>
                <div>
                  <Input
                    className="form-control pull-right reprint-date required"
                    onChange={handleChanges}
                    value={formData?.BaseRate}
                    name="BaseRate"
                    type="number"
                    onBlur={handleBlur}
                  />
                  {errors?.BaseRate && touched?.BaseRate && (
                    <span className="golbal-Error">{errors?.BaseRate}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="MaxRate">
                  MaxRate
                </label>
                <div>
                  <Input
                    className="form-control pull-right reprint-date required"
                    onChange={handleChanges}
                    value={formData?.MaxRate}
                    name="MaxRate"
                    type="number"
                    onBlur={handleBlur}
                  />
                  {errors?.MaxRate && touched?.MaxRate && (
                    <span className="golbal-Error">{errors?.MaxRate}</span>
                  )}
                </div>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="RequiredAttachment">
                  RequiredAttachment
                </label>
                <SelectBox
                  options={RequiredAttachment}
                  selectedValue={selectedValueCheck(
                    RequiredAttachment,
                    formData?.RequiredAttachment
                  )}
                  name="RequiredAttachment"
                  onChange={handleSelectChange}
                />
              </div>
              {formData?.DataType !== "Profile" && (
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label" htmlFor="MethodName">
                    MethodName
                  </label>
                  <div>
                    <Input
                      className="form-control pull-right reprint-date required"
                      onChange={handleChanges}
                      value={formData?.MethodName}
                      name="MethodName"
                      onBlur={handleBlur}
                    />
                    {errors?.MethodName && touched?.MethodName && (
                      <span className="golbal-Error">{errors?.MethodName}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-8">
                    <div className="col-sm-3">
                      <Input
                        name="Reporting"
                        type="checkbox"
                        checked={formData?.Reporting}
                        onChange={(e) => handleChanges(e)}
                      />
                      <label htmlFor="Reporting">Reporting</label>
                    </div>
                    <div className="col-sm-3">
                      <Input
                        name="PrintSampleName"
                        type="checkbox"
                        checked={formData?.PrintSampleName}
                        onChange={(e) => handleChanges(e)}
                      />
                      <label htmlFor="PrintSampleName">PrintSampleName</label>
                    </div>
                    <div className="col-sm-3">
                      <Input
                        name="Booking"
                        type="checkbox"
                        checked={formData?.Booking}
                        onChange={(e) => handleChanges(e)}
                      />
                      <label htmlFor="Booking"> Booking</label>
                    </div>
                    <div className="col-sm-3">
                      <Input
                        name="showPatientReport"
                        type="checkbox"
                        checked={formData?.showPatientReport}
                        onChange={(e) => handleChanges(e)}
                      />
                      <label htmlFor="showPatientReport">
                        showPatientReport
                      </label>
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="col-sm-3">
                      <Input
                        name="OnlineReport"
                        type="checkbox"
                        checked={formData?.OnlineReport}
                        onChange={(e) => handleChanges(e)}
                      />
                      <label htmlFor="OnlineReport">OnlineReport</label>
                    </div>
                    <div className="col-sm-3">
                      <Input
                        name="AutoSave"
                        type="checkbox"
                        checked={formData?.AutoSave}
                        onChange={(e) => handleChanges(e)}
                      />
                      <label htmlFor="AutoSave">AutoSave</label>
                    </div>
                    <div className="col-sm-3">
                      <Input
                        name="PrintSeparate"
                        type="checkbox"
                        checked={formData?.PrintSeparate}
                        onChange={(e) => handleChanges(e)}
                      />
                      <label htmlFor="PrintSeparate">PrintSeparate</label>
                    </div>
                    <div className="col-sm-3">
                      <Input
                        name="isMandatory"
                        type="checkbox"
                        checked={formData?.isMandatory}
                        onChange={(e) => handleChanges(e)}
                      />
                      <label htmlFor="isMandatory">isMandatory</label>
                    </div>
                    {state?.other?.showButton &&
                      (formData?.DataType === "Profile" ||
                        formData?.DataType === "Test") && (
                        <div className="col-sm-2 col-md-2 mt-4">
                          <Link
                            to="/InvestigationsInterpretion"
                            className="btn btn-success "
                            state={{
                              InvestigationID: formData?.InvestigationID,
                              url: "/api/v1/Investigations/SearchRangeInterpreation",
                              data: formData?.TestName,
                            }}
                          >
                            Test Interpretation
                          </Link>
                        </div>
                      )}

                    {state?.other?.showButton &&
                      formData?.DataType === "Test" && (
                        <>
                          <div className="col-sm-2 col-md-2  mt-4">
                            <Link
                              to="/InvestigationsRange"
                              className="btn btn-success "
                              state={{
                                InvestigationID: formData?.InvestigationID,
                              }}
                            >
                              Reference Range
                            </Link>
                          </div>

                          <div className="col-sm-2 col-md-2 mt-4">
                            <Link
                              to="/RequiredFields"
                              className="btn btn-success "
                              state={{
                                url: "/api/v1/Investigations/RequiredFields",
                                data: formData?.InvestigationID,
                              }}
                            >
                              Required Field
                            </Link>
                          </div>

                          <div className="col-sm-2 col-md-2 mt-4">
                            <Link
                              to="/HelpMenu"
                              className="btn btn-success "
                              state={{
                                data: formData,
                              }}
                            >
                              Help Menu
                            </Link>
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {formData?.DataType === "Profile" && (
              <>
                <div className="col-md-4 form-group mt-4">
                  <label className="control-label">Map Test</label>
                  <SelectBox
                    options={MapTest}
                    onChange={handleSelectChange}
                    name="TestId"
                  />
                </div>
                <div className="card-body">
                  {loading ? (
                    <Loading />
                  ) : (
                    <div
                      className={`px-2 ${
                        MapTestTableData.length > 0 ? "boottable" : ""
                      }`}
                    >
                      <Table bordered responsive hover>
                        <thead>
                          <tr>
                            <th>Action</th>
                            <th>S.No</th>
                            <th>TestID</th>
                            <th>Test Name</th>
                            <th>Prefix</th>
                            <th>Header</th>
                            <th>Critical</th>
                            <th>Comment</th>
                            <th>Bold</th>
                            <th>UnderLine</th>
                            <th>PrintSeprate</th>
                            <th>HelpValueOnly</th>
                            <th>DLC Check</th>
                            <th>Set Range</th>
                            <th>InterPretation</th>
                          </tr>
                        </thead>
                        {MapTestTableData.length > 0 && (
                          <tbody>
                            {MapTestTableData.map((ele, index) => (
                              <tr
                                key={index}
                                onDragStart={(e) => dragStart(e, index)}
                                draggable
                                onDragEnter={(e) => dragEnter(e, index)}
                                onDragEnd={drop}
                                style={{ cursor: "move" }}
                              >
                                <td>
                                  <button
                                    className="form-control Input-sm btn-danger"
                                    name="disableData"
                                    onClick={() => handleFilter(index)}
                                  >
                                    X
                                  </button>
                                </td>
                                <td>{index + 1}</td>
                                <td>{ele?.TestId}</td>
                                <td>{ele?.TestName}</td>
                                <td className="TestPrefix">
                                  <Input
                                    type="text"
                                    value={ele?.TestPrefix}
                                    name="TestPrefix"
                                    onChange={(e) =>
                                      handleMapTestChange(e, index)
                                    }
                                  />
                                </td>
                                <td className="Header">
                                  <Input
                                    type="checkbox"
                                    className="chk_header"
                                    name="Header"
                                    checked={ele?.Header}
                                    onChange={(e) =>
                                      handleMapTestChange(e, index)
                                    }
                                  />
                                </td>
                                <td className="Critical">
                                  <Input
                                    type="checkbox"
                                    className="chk_Critical"
                                    name="Critical"
                                    checked={ele?.Critical}
                                    onChange={(e) =>
                                      handleMapTestChange(e, index)
                                    }
                                  />
                                </td>
                                <td className="Comment">
                                  <Input
                                    type="checkbox"
                                    className="chk_Comment"
                                    name="Comment"
                                    checked={ele?.Comment}
                                    onChange={(e) =>
                                      handleMapTestChange(e, index)
                                    }
                                  />
                                </td>
                                <td className="Bold">
                                  <Input
                                    type="checkbox"
                                    className="chk_Bold"
                                    name="Bold"
                                    checked={ele?.Bold}
                                    onChange={(e) =>
                                      handleMapTestChange(e, index)
                                    }
                                  />
                                </td>
                                <td className="UnderLine">
                                  <Input
                                    type="checkbox"
                                    className="chk_Underline"
                                    name="Underline"
                                    checked={ele?.Underline}
                                    onChange={(e) =>
                                      handleMapTestChange(e, index)
                                    }
                                  />
                                </td>
                                <td className="PrintSeprate">
                                  <Input
                                    type="checkbox"
                                    className="chk_printSeprate"
                                    name="PrintSeprate"
                                    checked={ele?.PrintSeprate}
                                    onChange={(e) =>
                                      handleMapTestChange(e, index)
                                    }
                                  />
                                </td>
                                <td className="HelpValue">
                                  <Input
                                    type="checkbox"
                                    className="chk_HelpValue"
                                    name="HelpValue"
                                    checked={ele?.HelpValue}
                                    onChange={(e) =>
                                      handleMapTestChange(e, index)
                                    }
                                  />
                                </td>
                                <td className="dlcCheck">
                                  <Input
                                    type="checkbox"
                                    className="check_DLC"
                                    name="dlcCheck"
                                    checked={ele?.dlcCheck}
                                    onChange={(e) =>
                                      handleMapTestChange(e, index)
                                    }
                                  />
                                </td>
                                <td className="setRange">
                                  <Link
                                    to="/InvestigationsRange"
                                    state={{
                                      InvestigationID: ele?.TestId,
                                    }}
                                    style={{
                                      pointerEvents: state?.url1 ? "" : "none",
                                    }}
                                  >
                                    SetRange
                                  </Link>
                                </td>
                                <td className="inter">
                                  <Link
                                    to="/InvestigationsInterpretion"
                                    state={{
                                      InvestigationID: ele?.InvestigationID,
                                      url: "/api/v1/Investigations/SearchRangeInterpreation",
                                      data: ele?.TestName,
                                    }}
                                    style={{
                                      pointerEvents: state?.url1 ? "" : "none",
                                    }}
                                  >
                                    Test Interpretation
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                      </Table>
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="row" style={{ marginTop: "15px" }}>
              <div className="col-sm-1 ml-4">
                <Input
                  name="isActive"
                  type="checkbox"
                  checked={formData?.isActive}
                  onChange={handleChanges}
                />
                <label htmlFor="isActive">Active</label>
              </div>

              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-success"
                    type="button"
                    onClick={handleSubmit}
                  >
                    {state?.other?.button ? state?.other?.button : "Save"}
                  </button>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <Link to="/InvestigationsList" style={{ fontSize: "13px" }}>
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

export default Investigations;
