import React, { useEffect, useState } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import Input from "../../ChildComponents/Input";
import { Table } from "react-bootstrap";
import axios from "axios";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import { toast } from "react-toastify";
import PatientRegisterModal from "../util/PatientRegisterModal";
import {
  getAccessCentres,
  getAccessRateType,
  getBindDiscApproval,
  getBindDiscReason,
  getBindReportDeliveryMethod,
  getCollectionBoy,
  getDoctorSuggestion,
  getTrimmedData,
  getVisitType,
  isChecked,
  selectedValueCheck,
} from "../util/Commonservices";
import RegsiterTable from "./RegsiterTable";
import { number } from "../util/Commonservices/number";
import Loading from "../util/Loading";
import UploadModal from "../util/UploadModal";
import MedicialModal from "../util/MedicialModal";
import MobileDataModal from "../util/MobileDataModal";
import { stateIniti, LTDataIniti } from "../../ChildComponents/Constants";
import { useLocation, useNavigate } from "react-router-dom";
import SuggestionBox from "../util/SuggestionBox";
import { PatientRegisterSchema } from "../../ValidationSchema";
import { useFormik } from "formik";
import RequiredModal from "../util/RequiredModal";

const PatientRegister = () => {
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();
  //dropdown state
  const [Gender, setGender] = useState([]);
  const [Title, setTitle] = useState([]);
  const [Identity, setIdentity] = useState([]);
  const [PaymentMode, setPaymentMode] = useState([]);
  const [BankName, setBankName] = useState([]);
  const [CollectionBoy, setCollectionBoy] = useState([]);
  const [visibleFields, setVisibleFields] = useState([]);
  const [RateType, setRateType] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [VisitType, setVisitType] = useState([]);
  const [paid, setPaid] = useState(0);
  const [BindDiscApproval, setBindDiscApproval] = useState([]);
  const [BindDiscReason, setBindDiscReason] = useState([]);
  const [BindReportDeliveryMethod, setBindReportDeliveryMethod] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [disAmt, setdisAmt] = useState("");
  const [documentId, setDocumentID] = useState({
    documentId: "",
    MedicalHistory: "",
  });
  const [mobleData, setMobileData] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  //search state
  const [searchForm, setSearchForm] = useState({
    TestName: "",
    CentreID: "",
    InvestigationID: "",
  });
  // const [doctorSearch, setDoctorSearch] = useState("");
  const [dropFalse, setDropFalse] = useState(true);
  //modal state
  const [show, setShow] = useState(false);
  //table state
  const [tableData, setTableData] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [RequiredShow, setRequiredShow] = useState({
    show: false,
    FieldIDs: "",
  });
  const [formData, setFormData] = useState({
    DoctorName: "",
  });
  const [state, setState] = useState(stateIniti);
  const [LTData, setLTData] = useState(LTDataIniti);

  useEffect(() => {
    setLTData({ ...LTData, Adjustment: paid });
  }, [paid]);

  const [PLO, setPLO] = useState([]);

  const [RcData, setRcData] = useState([
    {
      PayBy: "Patient",
      ReceiptNo: "",
      ledgerNoCr: "",
      RateTypeId: state?.RateID,
      PaymentMode: "Cash",
      PaymentModeID: 134,
      Amount: "",
      CentreID: state?.CentreID,
    },
  ]);

  console.log(PLO);

  useEffect(() => {
    if (RcData.length === 1) {
      let data = RcData.map((ele) => {
        return { ...ele, Amount: LTData?.NetAmount ? LTData?.NetAmount : "" };
      });
      setRcData(data);
    }
  }, [LTData?.NetAmount]);

  console.log(RcData, "RcData");

  useEffect(() => {
    setLTData({
      ...LTData,
      PName:
        state?.Title +
        " " +
        state?.FirstName +
        " " +
        state?.MiddleName +
        " " +
        state?.LastName,
      Age: state?.Age,
      Gender: state?.Gender,
      RateTypeId: state?.RateID,
      VIP: state?.isVIP,
    });

    const data = RcData.map((ele) => {
      return { ...ele, CentreID: state?.CentreID, RateTypeId: state?.RateID };
    });
    setRcData(data);
  }, [state]);

  const handleMainChange = (e) => {
    const { name, value, type, checked } = e.target;

    setState({
      ...state,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  useEffect(() => {
    if (state?.isVIP === 0) {
      setState({ ...state, IsMask: 0 });
    }
  }, [state?.isVIP]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchForm({ ...searchForm, [name]: value });
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    if (name === "CentreID") {
      setSearchForm({ ...searchForm, [name]: event.value });
      setLTData({ ...LTData, [name]: event.value, CentreName: event.label });
    }

    if (name === "PatientIDProof") {
      setLTData({ ...LTData, [name]: event.value });
    }

    if (name === "VisitType") {
      setLTData({ ...LTData, [name]: event.value });
      fetchFields(event.value);
    }

    if (name === "ReportDeliveryMethodId") {
      setLTData({ ...LTData, [name]: event.value });
    }

    if (name === "DiscountApprovedBy") {
      setLTData({ ...LTData, [name]: event.value });
    }

    if (name === "DiscountReason") {
      setLTData({ ...LTData, [name]: event.value });
    }

    if (name === "CollectionBoyId") {
      setLTData({ ...LTData, [name]: event.value });
    } else {
      setState({
        ...state,
        [name]: event.value,
      });
    }
  };


  useEffect(() => {
    fetchFields(LTData?.VisitType);
  }, []);

  useEffect(() => {
    const male = ["Mr.", "Baba", "Dr.(Mrs)"];
    const female = ["Miss.", "Mrs.", "Baby", "Dr.(Miss)"];

    if (male.includes(state?.Title)) {
      setState({ ...state, Gender: "Male" });
    }

    if (female.includes(state?.Title)) {
      setState({ ...state, Gender: "Female" });
    }
  }, [state?.Title]);

  const dateSelect = (e) => {
    const { name, value } = e.target;
    var diff = moment(moment(), "milliseconds").diff(
      moment(value).format("YYYY-MM-DD")
    );
    var duration = moment.duration(diff);
    setState({
      ...state,
      [name]: value,
      AgeYear: duration?._data?.years,
      AgeMonth: duration._data?.months,
      AgeDays: duration?._data?.days,
      TotalAgeInDays: moment(moment().format("YYYY-MM-DD")).diff(value, "days"),
      Age: `${duration?._data?.years} Y ${duration._data?.months} M ${duration?._data?.days} D`,
    });

    setTableData([]);
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: "Cash",
        PaymentModeID: 134,
        Amount: "",
        CentreID: state?.CentreID,
      },
    ]);
  };

  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  const guidNumber = (name) => {
    if (name === "Document") {
      if (documentId.documentId === "") {
        const guidNumber =
          S4() +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          S4();
        setDocumentID({ ...documentId, documentId: guidNumber });
      }
    }
    if (name === "Medical") {
      if (documentId.MedicalHistory === "") {
        const guidNumber =
          S4() +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          S4();

        setDocumentID({ ...documentId, MedicalHistory: guidNumber });
      }
    }
  };

  const handleIndex = (e) => {
    const { name } = e.target;
    switch (name) {
      case "TestName":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(suggestion.length - 1);
            }
            break;
          case 40:
            if (suggestion.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            handleListSearch(suggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
      case "DoctorName":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(doctorSuggestion.length - 1);
            }
            break;
          case 40:
            if (doctorSuggestion.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            handleListSearch(doctorSuggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  // scroll view

  const handleListSearch = (data, name) => {
    switch (name) {
      case "TestName":
        setSearchForm({
          ...searchForm,
          TestName: "",
          InvestigationID: data.InvestigationID,
        });
        setIndexMatch(0);
        setSuggestion([]);
        getTableData(data);
        break;
      case "DoctorName":
        setFormData({ ...formData, [name]: data.Name });
        setLTData({
          ...LTData,
          [name]: data.Name,
          DoctorID: data.DoctorReferalID,
          ReferLabId: data.DoctorReferalID,
          ReferLabName: data.Name,
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      default:
        break;
    }
  };

  const handleLTData = (e) => {
    const { name, value } = e.target;
    setLTData({
      ...LTData,
      [name]: value,
    });
  };

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
  }, [formData?.DoctorName]);

  const getSuggestion = () => {
    if (searchForm.CentreID || state?.CentreID) {
      if (searchForm.TestName.length >= 3) {
        axios
          .post("/api/v1/TestData/BindBillingTestData", {
            TestName: searchForm.TestName,
            CentreID: LTData?.RateTypeId,
          })
          .then((res) => setSuggestion(res?.data?.message))
          .catch((err) => console.log(err));
      } else {
        setSuggestion([]);
      }
    } else {
      if (searchForm.TestName !== "") {
        toast.error("please Select center");
        setSearchForm({ ...searchForm, TestName: "" });
      }
    }
  };

  const getTableData = (data) => {
    const ItemIndex = tableData.findIndex(
      (e) => e.InvestigationID === data.InvestigationID
    );
    if (ItemIndex === -1) {
      axios
        .post("/api/v1/TestData/BindSingleTestData", {
          InvestigationID: data.InvestigationID,
          CentreID: LTData?.RateTypeId,
        })
        .then((res) => {
          setTableData([
            ...tableData,
            {
              ...res?.data?.message[0],
              Discount: "",
              NetAmount: res?.data?.message[0].Rate,
              IsSampleCollected: "N",
              Status: 1,
              IsUrgent: 0,
              UrgentDateTime: "",
            },
          ]);
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Duplicate Text Found");
    }
  };

  const handlePLOChange = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      if (name === "Status") {
        data[index][name] = checked ? 2 : 1;
        data[index]["IsSampleCollected"] = checked ? "S" : "N";
      } else {
        data[index][name] = checked ? 1 : 0;
        if (!checked) {
          data[index]["UrgentDateTime"] = "";
        }
      }
      setTableData(data);
    } else {
      const val = tableData.map((ele) => {
        return {
          ...ele,
          Status: checked ? 2 : 1,
          IsSampleCollected: checked ? "S" : "N",
        };
      });
      console.log(val);
      setTableData(val);
    }
  };

  const handleUrgent = (value, index) => {
    const data = [...tableData];
    data[index]["UrgentDateTime"] = value;
    setTableData(data);
  };

  const handleDiscount = (value, index) => {
    if (disAmt === "" && discountPercentage === "") {
      const data = [...tableData];
      data[index]["Discount"] = value;
      data[index]["NetAmount"] = data[index]["Rate"] - value;
      setTableData(data);
    } else {
      toast.error("Discount already given");
    }
  };

  useEffect(() => {
    let total = tableData.reduce((acc, item) => acc + item.Rate, 0);
    let NetTotal = tableData.reduce((acc, item) => acc + item.NetAmount, 0);

    setLTData({
      ...LTData,
      GrossAmount: total,
      NetAmount: NetTotal,
      DiscountOnTotal: total > 0 && NetTotal > 0 ? total - NetTotal : "",
    });
  }, [tableData]);

  const fetchFields = (visitType) => {
    axios
      .post("/api/v1/ManageFieldMaster/getAllManageFieldMasterData", {
        VisitTypeID: visitType,
      })
      .then((res) => {
        console.log(res?.data?.message);
        setVisibleFields(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    getSuggestion();
  }, [searchForm.TestName]);

  const getDropDownData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value:
              name === "Title" || name === "Gender"
                ? ele.FieldDisplay
                : ele.FieldID,
            label: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "Gender":
            setGender(value);
            break;
          case "Title":
            setTitle(value);
            break;
          case "Identity":
            setIdentity(value);
            break;
          case "PaymentMode":
            setPaymentMode(value);
            break;
          case "BankName":
            setBankName(value);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  //Modal show

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFilter = (data) => {
    // InvestigationID
    const value = tableData.filter(
      (ele) => ele.InvestigationID !== data.InvestigationID
    );
    setTableData(value);
    toast.success("successfully Removed");
  };

  useEffect(() => {
    let data = tableData.map((ele) => {
      return {
        IsSampleCollected: ele?.IsSampleCollected,
        Status: ele?.Status,
        IsUrgent: ele?.IsUrgent,
        sampleTypeID: ele?.SampleTypeID,
        SampleTypeName: ele?.SampleName,
        ItemId: "370",
        ItemName: ele?.TestName,
        InvestigationID: ele?.InvestigationID,
        InvestigationName: ele?.TestName,
        ReportType: ele?.ReportType,
        IsPackage: 0,
        Rate: ele?.Rate,
        Amount: ele?.NetAmount,
        Quantity: 1,
        PCCDiscAmt: 0,
        PCCDiscPer: 0,
        RateTypeId: state?.RateID,
        DiscountAmt: ele?.Discount,
        DiscountApprovedBy: LTData?.DiscountApprovedBy,
        DiscountReason: LTData?.DiscountReason,
        IsReporting: "1",
        ageInDays: state?.TotalAgeInDays,
        Gender: state?.Gender,
        CentreID: state?.CentreID,
        SampleBySelf: "1",
        sampleCollectionBy: 0,
        DeliveryDate: "21-Feb-2023 7:00 PM",
        BarcodeNo: "",
        UrgentDateTime: ele?.UrgentDateTime,
        DepartmentID: ele?.DepartmentID,
        isHistoryReq: 0,
        PackageCode: "370",
        PackageName: "CBC, COMPLETE BLOOD COUNT",
        TestCode: ele?.TestCode,
      };
    });
    setPLO(data);
  }, [tableData]);

  useEffect(() => {
    getAccessCentres(setCentreData);
    getCollectionBoy(setCollectionBoy);
    getDropDownData("Gender");
    getDropDownData("Title");
    getDropDownData("Identity");
    getDropDownData("PaymentMode");
    getDropDownData("BankName");
    getAccessRateType(setRateType);
    getVisitType(setVisitType);
    getBindDiscApproval(setBindDiscApproval);
    getBindDiscReason(setBindDiscReason);
    getBindReportDeliveryMethod(setBindReportDeliveryMethod);
  }, []);

  useEffect(() => {
    let totaldiscount = (LTData.GrossAmount * discountPercentage) / 100;
    let disamount = LTData.GrossAmount - totaldiscount;
    let DiscountAmt = totaldiscount / tableData.length;

    setLTData({
      ...LTData,
      NetAmount: disamount,
      DiscountOnTotal: totaldiscount,
    });
    const data = PLO.map((ele) => {
      return {
        ...ele,
        Amount: ele.Rate - DiscountAmt,
        DiscountAmt: DiscountAmt,
      };
    });
    setPLO(data);
  }, [discountPercentage]);

  useEffect(() => {
    setLTData({ ...LTData, NetAmount: LTData.GrossAmount - disAmt });
  }, [disAmt]);

  const Match = () => {
    let match = false;
    for (var i = 0; i < tableData.length; i++) {
      if (tableData[i].Discount !== "") {
        match = true;
        break;
      }
    }
    return match;
  };

  const handlePaymentChange = (event) => {
    let match = false;
    for (var i = 0; i < RcData.length; i++) {
      if (RcData[i].PaymentMode === event.label) {
        match = true;
        break;
      }
    }
    if (!match) {
      setRcData([
        ...RcData,
        {
          PayBy: "Patient",
          ReceiptNo: "",
          ledgerNoCr: "",
          RateTypeId: state?.RateID,
          PaymentMode: event.label,
          PaymentModeID: event.value,
          Amount: "",
          CentreID: state?.CentreID,
        },
      ]);
    } else {
      toast.error("Payment Mode is Already Added");
    }
  };

  const handleFilterPayment = (index) => {
    const data = RcData.filter((ele, i) => index !== i);
    setRcData(data);
    toast?.success("Removed Successfully");
  };
  const calculate = (value, index) => {
    let data = [...RcData];
    data[index]["Amount"] = value;
    const sum = data.reduce((a, item) => Number(item.Amount) + a, 0);
    setPaid(sum);
    return sum;
  };

  const handleClose2 = () => {
    setShow2(false);
  };

  const handleClose3 = () => {
    setShow3(!show3);
  };

  const getDataByMobileNo = () => {
    axios
      .post("/api/v1/Booking/getDataByMobileNo", {
        Mobile: state?.Mobile,
      })
      .then((res) => {
        setMobileData(res.data.message);
        setShow4(true);
      })
      .catch((err) => console.log(err));
  };

  const handlePatientData = (e) => {
    const keypress = [9, 13];
    if (keypress.includes(e.which)) {
      e.preventDefault();
      getDataByMobileNo();
    }
  };

  const handleClose4 = () => {
    setShow4(false);
  };

  const handleSelctData = (data) => {
    const centreName = CentreData?.find((ele) => ele.value === data.CentreID);
    console.log(centreName);
    setState({
      ...state,
      Title: data.Title,
      FirstName: data.FirstName,
      LastName: data?.LastName,
      MiddleName: data?.MiddleName,
      CentreID: data?.CentreID,
      RateID: data?.RateTypeId,
      Gender: data?.Gender,
      DOB: moment(data?.DOB).format("YYYY-MM-DD"),
      Age: data?.Age,
      PatientCode: data?.PatientCode,
      Email: data?.Email,
      PinCode: data?.Pincode,
      AgeDays: data?.AgeDays,
      AgeMonth: data?.AgeMonth,
      AgeYear: data?.AgeYear,
      HouseNo: data?.HouseNo,
      City: data?.City,
      State: data?.State,
      Country: data?.Country,
      StreetName: data?.StreetName,
      IsMask: data?.IsMask,
      isVIP: data?.IsVIP,
      Locality: data?.Locality,
    });

    setLTData({
      ...LTData,
      CentreName: centreName.label,
      CentreID: centreName.value,
    });

    handleClose4();
    setMobileData([]);
  };
  console.log(state, LTData);

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: state,
    enableReinitialize: true,
    validationSchema: PatientRegisterSchema,
    onSubmit: (values) => {
      // handleRequiredModal()
      //   .then((res) => {
      //     if (res.FieldIDs) {
      //       setRequiredShow({
      //         show: true,
      //         FieldIDs: res?.FieldIDs,
      //       });
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      setIsSubmit(true);
      axios
        .post("/api/v1/PatientRegistration/SaveData", {
          PatientData: getTrimmedData(state),
          LTData: getTrimmedData(LTData),
          PLO: getTrimmedData(PLO),
          DocumentDetail: {
            DocumentID: "",
          },
          patientMedical: {
            PatientGuid: "",
          },
          RcData: RcData,
          FieldIds: "",
          mandatoryFields: [],
        })
        .then((res) => {
          toast.success(res.data.message);
          setState(stateIniti);
          setLTData(LTDataIniti);
          setPLO([]);
          setRcData([
            {
              PayBy: "Patient",
              ReceiptNo: "",
              ledgerNoCr: "",
              RateTypeId: state?.RateID,
              PaymentMode: "Cash",
              PaymentModeID: 134,
              Amount: "",
              CentreID: state?.CentreID,
            },
          ]);
          setTableData([]);
          setIsSubmit(false);
          navigate("/GetLabReportPreview", {
            state: {
              data:res?.data?.ledgertransactionID
            },
          });
        })
        .catch((err) => {
          toast.error("Something Went Wrong");
          console.log(err);
          setIsSubmit(false);
        });
    },
  });

  useEffect(() => {
    const data = PLO.map((ele) => {
      return {
        ...ele,
        DiscountReason: LTData?.DiscountReason,
        DiscountApprovedBy: LTData?.DiscountApprovedBy,
      };
    });
    setPLO(data);
  },[LTData?.DiscountReason,LTData?.DiscountApprovedBy]);

  const handleRequiredModal = () => {
    if (tableData.length > 0) {
      let val = "";
      for (let i = 0; i < tableData.length; i++) {
        val =
          val === ""
            ? `${tableData[i].InvestigationID}`
            : `${val},${tableData[i].InvestigationID}`;
      }

      return new Promise((resolve, reject) => {
        axios
          .post("/api/v1/TestData/GetFieldIds", {
            invIds: "3306,2",
            isEditPage: false,
          })
          .then((res) => {
            resolve(res?.data?.message[0]);
          })
          .catch((err) => {
            reject(err);
          });
      });
    } else {
      toast.error("please Select one Test");
    }
  };

  return (
    <div
      className="content-wrapper"
      style={{ minHeight: "955.604px" }}
      data-select2-id="18"
    >
      <PatientRegisterModal show={show} handleClose={handleClose} />
      <UploadModal
        options={Identity}
        show={show2}
        handleClose={handleClose2}
        documentId={documentId?.documentId}
      />
      <MedicialModal
        show={show3}
        handleClose={handleClose3}
        MedicalId={documentId?.MedicalHistory}
      />
      {RequiredShow.show && (
        <RequiredModal
          RequiredShow={RequiredShow}
          handleClose={() => {
            setRequiredShow({
              show: false,
              FieldIDs: "",
            });
          }}
        />
      )}
      {mobleData.length > 0 && (
        <MobileDataModal
          show={show4}
          mobleData={mobleData}
          handleClose4={handleClose4}
          handleSelctData={handleSelctData}
        />
      )}
      <div className="container-fluid" style={{ padding: "10px" }}>
        <div className="card shadow mb-4">
          <div className="card-header py-3" style={{ display: "block" }}>
            <span className="m-0 font-weight-bold text-primary">
              Demographic Detail
            </span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="MobileNo">
                  Mobile No
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date required"
                  name="Mobile"
                  type="number"
                  required
                  onInput={(e) => number(e, 10)}
                  onKeyDown={handlePatientData}
                  value={state.Mobile}
                  onBlur={handleBlur}
                  onChange={handleMainChange}
                />
                {errors?.Mobile && touched?.Mobile && (
                  <div className="golbal-Error">{errors?.Mobile}</div>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Centre">
                  Centre
                </label>
                :
                <SelectBox
                  options={CentreData}
                  name="CentreID"
                  selectedValue={selectedValueCheck(
                    CentreData,
                    LTData?.CentreID
                  )}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="RateType">
                  Rate Type
                </label>
                :
                <SelectBox
                  options={RateType}
                  formdata={state.RateID}
                  selectedValue={selectedValueCheck(RateType, state?.RateID)}
                  name="RateID"
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-3 form-group">
                <label className="control-label " htmlFor="FirstName">
                  First Name
                </label>
                :
                <div className="input-group">
                  <SelectBox
                    options={Title}
                    formdata={state.Title}
                    name="Title"
                    selectedValue={selectedValueCheck(Title, state?.Title)}
                    onChange={handleSelectChange}
                  />
                  <div>
                    <Input
                      className="form-control pull-right reprint-date required"
                      name="FirstName"
                      type="text"
                      maxLength={35}
                      required
                      value={state?.FirstName}
                      onChange={handleMainChange}
                      onBlur={handleBlur}
                    />

                    {errors?.FirstName && touched?.FirstName && (
                      <div className="golbal-Error">{errors?.FirstName}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-sm-3 form-group">
                <label className="control-label" htmlFor="MidName">
                  Mid Name
                </label>
                /
                <label className="control-label" htmlFor="LastName">
                  Last Name
                </label>
                <div className="input-group">
                  <Input
                    className="form-control pull-right reprint-date"
                    id="MidName"
                    name="MiddleName"
                    type="text"
                    value={state?.MiddleName}
                    maxLength={35}
                    onChange={handleMainChange}
                  />
                  <Input
                    className="form-control pull-right reprint-date"
                    id="LastName"
                    maxLength={50}
                    name="LastName"
                    type="text"
                    value={state?.LastName}
                    onChange={handleMainChange}
                  />
                </div>
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Gender">
                  Gender
                </label>
                :
                <SelectBox
                  options={Gender}
                  className="required"
                  formdata={state?.Gender}
                  isDisabled={state?.Title ? true : false}
                  name="Gender"
                  selectedValue={selectedValueCheck(Gender, state?.Gender)}
                  onChange={handleSelectChange}
                />
              </div>

              {/*  */}
              <div className="col-sm-2">
                <label className="control-label" htmlFor="Referred_Doc">
                  Referred Doc
                </label>
                :
                <div className="d-flex">
                  <Input
                    autoComplete="off"
                    className="form-control pull-right reprint-date ui-autoComplete-input"
                    name="DoctorName"
                    type="text"
                    value={formData?.DoctorName}
                    onChange={(e) => {
                      setFormData({ ...formData, DoctorName: e.target.value });
                      setDropFalse(true);
                    }}
                    onKeyDown={handleIndex}
                  />
                  {dropFalse && doctorSuggestion.length > 0 && (
                    <ul
                      className="suggestion-data"
                      style={{ top: "47px", right: "14px" }}
                    >
                      {doctorSuggestion.map((data, index) => (
                        <li
                          onClick={() => handleListSearch(data, "DoctorName")}
                          className={`${index === indexMatch && "matchIndex"}`}
                          key={index}
                        >
                          {data?.Name}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="input-group-append">
                    <button
                      className=" btn-primary btn-sm"
                      id="NewReferDoc"
                      type="button"
                      onClick={handleShow}
                    >
                      <i className="fa fa-plus-circle fa-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="DOB">
                  DOB
                </label>
                <div>
                  <Input
                    type="date"
                    className="form-control pull-right reprint-date required"
                    onChange={dateSelect}
                    max={moment().format("YYYY-MM-DD")}
                    value={state?.DOB}
                    name="DOB"
                    onBlur={handleBlur}
                  />
                  {errors?.DOB && touched?.DOB && (
                    <div className="golbal-Error">{errors?.DOB}</div>
                  )}
                </div>
              </div>
              <div className="col-sm-3">
                <label className="control-label" htmlFor="Age">
                  Age
                </label>
                :
                <div className="input-group-append">
                  <Input
                    className="form-control pull-right reprint-date"
                    id="AgeY"
                    name="Age"
                    type="text"
                    value={state?.AgeYear}
                    onChange={handleMainChange}
                  />
                  <span className="input-group-text form-control pull-right reprint-date justify-content-center">
                    Y
                  </span>
                  <Input
                    className="form-control pull-right reprint-date"
                    id="AgeM"
                    name="AgeMonth"
                    type="text"
                    value={state?.AgeMonth}
                    onChange={handleMainChange}
                  />
                  <span className="input-group-text form-control pull-right reprint-date justify-content-center">
                    M
                  </span>

                  <Input
                    className="form-control pull-right reprint-date"
                    id="AgeD"
                    name="AgeDays"
                    type="text"
                    value={state?.AgeDays}
                    onChange={handleMainChange}
                  />
                  <span className="input-group-text form-control pull-right reprint-date justify-content-center">
                    D
                  </span>
                </div>
              </div>

              <div className="col-sm-3">
                <label className="control-label" htmlFor="ReferLabName">
                  Referred Lab
                </label>
                :
                <div className="input-group">
                  <Input
                    autoComplete="off"
                    className="form-control pull-right reprint-date ui-autoComplete-input"
                    id="automplete-3"
                    name="ReferLabName"
                    type="text"
                  />
                  <div className="input-group-append">
                    <button
                      className=" btn-primary btn-sm"
                      id="NewReferDoc"
                      type="button"
                      onClick={handleShow}
                    >
                      <i className="fa fa-plus-circle fa-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Email">
                  Email
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date"
                  id="Email"
                  name="Email"
                  type="email"
                  required
                  value={state?.Email}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="UHID">
                  UHID
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date"
                  id="UHID"
                  maxLength={15}
                  disabled
                  value={state?.PatientCode}
                  name="UHID"
                  type="text"
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="VisitType">
                  Visit Type
                </label>
                :
                <SelectBox
                  className="required"
                  options={VisitType}
                  selectedValue={selectedValueCheck(
                    VisitType,
                    LTData?.VisitType
                  )}
                  name="VisitType"
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-3 form-group">
                <label className="control-label" htmlFor="Address">
                  Address
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date"
                  id="Address"
                  maxLength="30"
                  name="HouseNo"
                  type="text"
                  value={state?.HouseNo}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-3 form-group">
                <label className="control-label" htmlFor="PinCode">
                  PinCode
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date"
                  name="PinCode"
                  onInput={(e) => number(e, 10)}
                  type="number"
                  value={state?.PinCode}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="City">
                  City
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date"
                  id="City"
                  name="City"
                  type="text"
                  value={state?.City}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="State">
                  State
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date"
                  id="State"
                  name="State"
                  type="text"
                  value={state?.State}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="Nationality">
                  Nationality
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date"
                  name="Country"
                  value={state?.Country}
                  type="text"
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-3 form-group">
                <label className="control-label" htmlFor="Identity_Type">
                  Identity Type
                </label>
                /
                <label className="control-label" htmlFor="Identity_Type_No">
                  Identity No
                </label>
                <div className="d-flex">
                  <div style={{ flexBasis: "50%" }}>
                    <SelectBox
                      options={Identity}
                      selectedValue={selectedValueCheck(
                        Identity,
                        LTData?.PatientIDProof
                      )}
                      name="PatientIDProof"
                      onChange={handleSelectChange}
                    />
                  </div>
                  <Input
                    className="form-control pull-right reprint-date set-height"
                    maxLength={20}
                    name="PatientIDProofNo"
                    value={LTData?.PatientIDProofNo}
                    type="text"
                    onChange={handleLTData}
                  />
                </div>
              </div>
              <div
                className="col-sm-3 form-group"
                id="OpdNo"
                ismandatory="true"
                style={{ display: "block" }}
              >
                <label className="control-label" htmlFor="Remarks">
                  Billing Remarks
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date"
                  id="Remarks"
                  maxLength={100}
                  name="Remarks"
                  type="text"
                />
              </div>

              {visibleFields?.map(
                (data, index) =>
                  data?.IsVisible === 1 && (
                    <div className="col-sm-2 form-group" id="OpdNo" key={index}>
                      <label className="control-label" htmlFor="OpdIpd_No">
                        {data?.FieldType}
                      </label>
                      :
                      <Input
                        className={`form-control pull-right reprint-date ${
                          data?.IsMandatory === 1 && "required"
                        }`}
                        id="OpdIpd_No"
                        ismandatory="false"
                        maxLength={30}
                        name={
                          data?.FieldType === "Source"
                            ? "PatientSource"
                            : data?.FieldType === "Patient Type"
                            ? "PatientType"
                            : data?.FieldType === "Vip&Masking"
                            ? ""
                            : ""
                        }
                        value={
                          data?.FieldType === "Source"
                            ? LTData.PatientSource
                            : data?.FieldType === "Patient Type"
                            ? LTData.PatientType
                            : data?.FieldType === "Vip&Masking"
                            ? ""
                            : ""
                        }
                        onChange={handleLTData}
                        type="text"
                      />
                    </div>
                  )
              )}

              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="CollectionBoyId">
                  Collection Boy
                </label>
                :
                <SelectBox
                  className={"required"}
                  options={CollectionBoy}
                  selectedValue={selectedValueCheck(
                    CollectionBoy,
                    LTData?.CollectionBoyId
                  )}
                  name="CollectionBoyId"
                  onChange={handleSelectChange}
                />
                <div
                  className="chosen-container chosen-container-single"
                  title=""
                  id="CollectionBoyId_chosen"
                  style={{ width: "147px" }}
                >
                  <div className="chosen-drop">
                    <div className="chosen-search"></div>
                  </div>
                </div>
              </div>
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="ReportDeliveryMethodId"
                >
                  Report Delivery Method.
                </label>
                :
                <SelectBox
                  className={"required"}
                  options={BindReportDeliveryMethod}
                  selectedValue={selectedValueCheck(
                    BindReportDeliveryMethod,
                    LTData?.ReportDeliveryMethodId
                  )}
                  name="ReportDeliveryMethodId"
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-3 form-group">
                <label
                  className="control-label"
                  htmlFor="ReportDeliveryMethodDetail"
                >
                  Report Delivery Method Detail
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date"
                  id="ReportDeliveryMethodDetail"
                  maxLength={200}
                  name="ReportDeliveryMethodDetail"
                  type="text"
                />
              </div>
              <div className="col-sm-3 form-group margin-top py-3">
                <SimpleCheckbox type="checkbox" />
                <label className="labels">Collection charges</label>
                <SimpleCheckbox
                  type="checkbox"
                  name="isVIP"
                  onChange={handleMainChange}
                  value={state?.isVIP === 1 ? true : false}
                />
                <label className="labels">IsVip</label>
                {state?.isVIP === 1 && (
                  <>
                    <SimpleCheckbox
                      type="checkbox"
                      name="IsMask"
                      onChange={handleMainChange}
                      value={state?.IsMask === 1 ? true : false}
                    />
                    <label className="labels">IsMask</label>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <div className="input-group input-group-sm sm-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text font-weight-bold text-primary">
                      Search Test
                    </span>
                  </div>

                  <Input
                    autoComplete="off"
                    className="custom-form pull-right reprint-date"
                    name="TestName"
                    placeholder="Type Test Name or Test Code"
                    type="text"
                    value={searchForm.TestName}
                    onChange={handleChange}
                    onKeyDown={handleIndex}
                  />
                  {suggestion.length > 0 && (
                    <ul className="suggestion-data">
                      {suggestion.map((data, index) => (
                        <li
                          onClick={() => handleListSearch(data, "TestName")}
                          key={index}
                          className={`${index === indexMatch && "matchIndex"}`}
                        >
                          {data.TestName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="row p-2">
                  <Table responsive bordered hover>
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Code</th>
                        <th>Item</th>
                        <th>View</th>
                        <th>Rate</th>
                        <th>Disc.</th>
                        <th>Amt</th>
                        <th>D.Date</th>
                        <th>
                          <label>SC</label>
                          <Input
                            type="checkbox"
                            onChange={handlePLOChange}
                            checked={
                              tableData.length > 0
                                ? isChecked("Status", tableData, 2).includes(
                                    false
                                  )
                                  ? false
                                  : true
                                : false
                            }
                          />
                        </th>
                        <th>Urgent</th>
                      </tr>
                    </thead>
                    {tableData.length > 0 && (
                      <tbody>
                        {tableData.map((data, index) => (
                          <tr key={index}>
                            <RegsiterTable
                              data={data}
                              index={index}
                              handleFilter={handleFilter}
                              handleDiscount={handleDiscount}
                              handlePLOChange={handlePLOChange}
                              handleUrgent={handleUrgent}
                            />
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </Table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <div className="input-group input-group-sm sm-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text font-weight-bold text-primary">
                      Payment
                    </span>
                  </div>
                  <div className="input-group-prepend">
                    <span className="input-group-text font-weight-bold text-info">
                      Total Amount
                    </span>
                  </div>
                  <Input
                    className="form-control pull-right reprint-date "
                    data-val="false"
                    id="Total_Amount"
                    name="Total_Amount"
                    disabled={true}
                    value={LTData?.NetAmount}
                    type="text"
                    readOnly="readonly"
                    // value="0"
                  />
                  <div className="input-group-prepend">
                    <span className="input-group-text font-weight-bold text-success">
                      Paid Amount
                    </span>
                  </div>
                  <Input
                    className="form-control pull-right reprint-date "
                    id="Paid_Amount"
                    name="Paid_Amount"
                    type="number"
                    value={paid}
                    // value="0"
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="card-body">
                <div className="row p-2">
                  <div
                    className="col-sm-3"
                    style={{ display: "block" }}
                    id="dis_amt"
                  >
                    <label
                      className="control-label"
                      htmlFor="DiscountAmt"
                      style={{ fontWeight: "bold" }}
                    >
                      Dis Amt
                    </label>
                    <Input
                      className="form-control pull-right reprint-date "
                      data-val="false"
                      id="DiscountAmt"
                      value={disAmt}
                      name="disAmt"
                      type="number"
                      onChange={(e) => {
                        let match = Match();
                        if (discountPercentage === "" && !match) {
                          setdisAmt(e.target.value);
                          setLTData({
                            ...LTData,
                            DiscountOnTotal: e.target.value,
                          });
                          const DiscountAmt = (
                            e.target.value / tableData.length
                          ).toFixed(2);
                          const data = PLO.map((ele) => {
                            return {
                              ...ele,
                              Amount: ele.Rate - DiscountAmt,
                              DiscountAmt: DiscountAmt,
                            };
                          });
                          setPLO(data);
                        } else {
                          toast.error("Discount already Given");
                        }
                      }}
                      // value="0"
                    />
                  </div>
                  <div
                    className="col-sm-3"
                    style={{ display: "block" }}
                    id="dis_per"
                  >
                    <label
                      className="control-label"
                      htmlFor="DiscountPer"
                      style={{ fontWeight: "bold" }}
                    >
                      Dis Per
                    </label>
                    <Input
                      className="form-control pull-right reprint-date"
                      id="DiscountPer"
                      value={discountPercentage}
                      name="DiscountPer"
                      type="text"
                      onChange={(e) => {
                        let match = Match();
                        if (disAmt === "" && !match) {
                          setDiscountPercentage(e.target.value);
                        } else {
                          toast.error("Discount Already Given");
                        }
                      }}
                    />
                  </div>
                  <div className="col-sm-3">
                    <label
                      className="control-label"
                      htmlFor="DiscountPer"
                      style={{ fontWeight: "bold" }}
                    >
                      Currency
                    </label>

                    <SelectBox />
                  </div>
                  <div className="col-sm-3">
                    <label
                      className="control-label"
                      htmlFor="DiscountPer"
                      style={{ fontWeight: "bold" }}
                    >
                      PaymentMode
                    </label>

                    <SelectBox
                      options={PaymentMode}
                      onChange={handlePaymentChange}
                    />
                  </div>
                  <div className="col-sm-3">
                    <label
                      className="control-label"
                      htmlFor="DiscountPer"
                      style={{ fontWeight: "bold" }}
                    >
                      Dis Approval
                    </label>

                    <SelectBox
                      options={BindDiscApproval}
                      name="DiscountApprovedBy"
                      selectedValue={selectedValueCheck(
                        BindDiscApproval,
                        LTData?.DiscountApprovedBy
                      )}
                      onChange={handleSelectChange}
                      // onChange={handlePaymentChange}
                    />
                  </div>
                  <div className="col-sm-3">
                    <label
                      className="control-label"
                      htmlFor="DiscountPer"
                      style={{ fontWeight: "bold" }}
                    >
                      Discount Reason
                    </label>

                    <SelectBox
                      options={BindDiscReason}
                      name="DiscountReason"
                      selectedValue={selectedValueCheck(
                        BindDiscReason,
                        LTData?.DiscountReason
                      )}
                      onChange={handleSelectChange}
                    />
                  </div>
                  <div className="col-sm-3 py-4">
                    <div
                      id="spnFactorConversion"
                      style={{ fontSize: "9px", fontWeight: "500" }}
                    >
                      {LTData?.NetAmount} INR
                    </div>
                    <span
                      id="spnFactorConversion"
                      style={{ fontSize: "9px", fontWeight: "500" }}
                    >
                      1 INR=1.000000 INR
                    </span>
                  </div>

                  <div className="col-sm-3 py-4">
                    <label
                      className="control-label"
                      htmlFor="Due_Amount"
                      style={{ fontWeight: "bold" }}
                    >
                      Due Amount : {LTData?.NetAmount - paid}
                    </label>
                  </div>

                  <Table responsive bordered hover>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Mode</th>
                        <th>Paid Amount</th>
                        <th>Currency</th>
                        <th>Base</th>
                        <th>Bank Name</th>
                        <th>Cheque/Card No.</th>
                        <th>Cheque Date/Trans No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RcData?.map((data, index) => (
                        <tr key={index}>
                          <td>
                            <button
                              id="btndeleterow"
                              className="form-control input-sm btn-danger"
                              onClick={() => handleFilterPayment(index)}
                            >
                              X
                            </button>
                          </td>
                          <td>
                            <span id="SpanPaymentMode">
                              {data?.PaymentMode}
                            </span>
                          </td>
                          <td>
                            <Input
                              className="form-control"
                              name="Amount"
                              value={data?.Amount}
                              onChange={(e) => {
                                let sum = calculate(e.target.value, index);
                                if (
                                  sum > LTData?.NetAmount ||
                                  e.target.value > LTData?.NetAmount
                                ) {
                                  toast.error("please enter Collect Amount");
                                  const data = [...RcData];
                                  data[index]["Amount"] = "";
                                  calculate("", index);
                                  setRcData(data);
                                } else {
                                  const data = [...RcData];
                                  data[index]["Amount"] = e.target.value;
                                  setRcData(data);
                                }
                              }}
                            />
                          </td>
                          <td>
                            <span id="SpanCurrency">INR</span>
                          </td>
                          <td>
                            <span id="spnbaseAmount">{data?.Amount}</span>
                          </td>
                          <td>
                            {data?.PaymentMode !== "Cash" && (
                              <select>
                                {BankName.map((ele, index) => (
                                  <option value={ele.value} key={index}>
                                    {ele.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td>
                            <Input
                              disabled={
                                data?.PaymentMode !== "Cash" ? false : true
                              }
                              type="text"
                              className="form-control"
                            />
                          </td>
                          <td>
                            <Input
                              disabled={
                                data?.PaymentMode !== "Cash" ? false : true
                              }
                              type={
                                data?.PaymentMode !== "Cash" ? "date" : "text"
                              }
                              className="form-control"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="col-sm-3 col-4 mb-2 ">
                    {isSubmit ? (
                      <Loading />
                    ) : (
                      <button
                        type="submit"
                        id="btnSave"
                        className="btn btn-success"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    )}
                  </div>

                  <button
                    className="btn  btn-info col-sm-6 col-8 mb-2"
                    id="btnUpload"
                    type="button"
                    onClick={() => {
                      setShow2(true);
                      guidNumber("Document");
                    }}
                  >
                    Click here to upload document
                    <i className="fa fa-paperclip fa-sm"></i>
                    <span id="spnCount"></span>
                  </button>
                  <div className="col-sm-3 col-12 mb-2">
                    <button
                      className="btn  btn-info"
                      id="btnUpload"
                      type="submit"
                      onClick={() => {
                        handleClose3();
                        guidNumber("Medical");
                      }}
                    >
                      See Medical History <span id="spnMedicalCount"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SuggestionBox />
    </div>
  );
};

export default PatientRegister;
