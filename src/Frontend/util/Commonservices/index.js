import axios from "axios";
import { toast } from "react-toastify";

export const getDepartment = (state) => {
  axios
    .get("/api/v1/Department/getDepartmentData")
    .then((res) => {
      let data = res.data.message;
      let Department = data.map((ele) => {
        return {
          value: ele.DepartmentID,
          label: ele.Department,
        };
      });
      state(Department);
    })
    .catch((err) => console.log(err));
};

export const getAccessCentres = (state) => {
  axios
    .get("/api/v1/Centre/getAccessCentres")
    .then((res) => {
      let data = res.data.message;
      let CentreDataValue = data.map((ele) => {
        return {
          value: ele.CentreID,
          label: ele.Centre,
        };
      });
      state(CentreDataValue);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        window.sessionStorage.clear();
        window.location.href = "/login";
      }
    });
};

export const getAccessRateType = (state) => {
  axios
    .get("/api/v1/RateType/getAccessRateType")
    .then((res) => {
      let data = res.data.message;
      let CentreDataValue = data.map((ele) => {
        return {
          value: ele.RateTypeID,
          label: ele.Rate,
        };
      });
      state(CentreDataValue);
    })
    .catch((err) => console.log(err));
};

export const getDoctorSuggestion = (formData, state, setFormData) => {
  if (formData.DoctorName.length >= 1) {
    axios
      .post("/api/v1/DoctorReferal/getDoctorData", {
        DoctorName: formData.DoctorName,
      })
      .then((res) => {
        if (res?.data?.message?.length > 0) {
          state(res?.data?.message);
        } else {
          setTimeout(() => {
            setFormData({ ...formData, DoctorName: "" });
          }, 100);
        }
      })
      .catch((err) => console.log(err));
  } else {
    state([]);
    setFormData({ ...formData, DoctorReferal: "" });
  }
};

export const getBase64 = (file) => {
  return new Promise((resolve) => {
    let baseURL = "";
    // Make new FileReader
    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader.result;
      resolve(baseURL);
    };
  });
};

export const getCollectionBoy = (state) => {
  axios
    .get("/api/v1/FieldBoyMaster/BindFieldBoy")
    .then((res) => {
      let data = res.data.message;
      let collection = data.map((ele) => {
        return {
          value: ele.FieldBoyID,
          label: ele.Name,
        };
      });
      state(collection);
    })
    .catch((err) => console.log(err));
};

export const isChecked = (name, state, value, id) => {
  if (id) {
    const data = state?.map((ele) => {
      if (ele?.TestID === id) {
        return ele[name] === value ? true : false;
      } else {
        return ele;
      }
    });
    return data;
  } else {
    const data = state?.map((ele) => {
      return ele[name] === value ? true : false;
    });
    return data;
  }
};

export const selectedValueCheck = (selectedState, state) => {
  const data = selectedState.find((ele) => ele.value == state);
  return data === undefined ? { label: "", value: "" } : data;
};

export const getVisitType = (state) => {
  axios
    .get("/api/v1/Centre/visitTypeList")
    .then((res) => {
      let data = res.data.message;
      let Visit = data.map((ele) => {
        return {
          value: ele.FieldID,
          label: ele.FieldDisplay,
        };
      });
      state(Visit);
    })
    .catch((err) => console.log(err));
};

export const getDesignationData = (state) => {
  axios
    .get("/api/v1/Designation/getDesignation")
    .then((res) => {
      let data = res.data.message;
      let Visit = data.map((ele) => {
        return {
          value: ele.DesignationID,
          label: ele.DesignationName,
        };
      });
      Visit.unshift({ label: "All", value: "" });
      state(Visit);
    })
    .catch((err) => console.log(err));
};

export const getTrimmedData = (obj) => {
  if (obj && typeof obj === "object") {
    Object.keys(obj).map((key) => {
      if (typeof obj[key] === "object") {
        getTrimmedData(obj[key]);
      } else if (typeof obj[key] === "string") {
        obj[key] = obj[key].trim();
      }
    });
  }
  return obj;
};

export const GetAccessRightMaster = (state) => {
  axios
    .get("/api/v1/Employee/GetAccessRightMaster")
    .then((res) => {
      let data = res.data.message;
      let CentreDataValue = data.map((ele) => {
        return {
          value: ele.AccessbyId,
          label: ele.accessby,
        };
      });
      state(CentreDataValue);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const GetAccessRightApproval = (state) => {
  axios
    .post("/api/v1/Employee/getApprovalRightMaster")
    .then((res) => {
      let data = res.data.message;

      let CentreDataValue = data.map((ele) => {
        return {
          value: ele.EmployeeID,
          label: ele.NAME,
        };
      });
      state(CentreDataValue);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getBillingCategory = (state) => {
  axios
    .get("/api/v1/RateList/getBillingCategory")
    .then((res) => {
      let data = res.data.message;
      let val = data.map((ele) => {
        return {
          value: ele?.BillingCategoryID,
          label: ele?.BillingCategory,
        };
      });
      state(val);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getRateCenters = (state) => {
  axios
    .get("/api/v1/centre/getRateList")
    .then((res) => {
      let data = res.data.message;

      let CentreDataValue = data.map((ele) => {
        return {
          value: ele.CentreID,
          label: ele.Centre,
        };
      });
      state(CentreDataValue);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getRateItemList = (state, payload) => {
  axios
    .post("/api/v1/RateList/getItemList", {
      DepartmentID: payload?.DepartmentID,
      BillingCategory: payload?.BillingCategory,
    })
    .then((res) => {
      let data = res.data.message;
      let val = data.map((ele) => {
        return {
          value: ele?.InvestigationID,
          label: ele?.TestName,
        };
      });
      state(val);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const BindFieldType = (state) => {
  axios
    .get("/api/v1/Global/BindFieldType")
    .then((res) => {
      const data = res.data?.message;
      const val = data.map((ele) => {
        return {
          label: ele?.FieldType,
          value: ele?.FieldType,
        };
      });
      state(val);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getBindDiscApproval = (state) => {
  axios
    .get("/api/v1/DiscApproval/BindDiscApproval")
    .then((res) => {
      const data = res.data?.message;
      const val = data.map((ele) => {
        return {
          label: ele?.Name,
          value: ele?.EmployeeID,
        };
      });
      state(val);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getBindDiscReason = (state) => {
  axios
    .get("/api/v1/DiscountReason/BindDiscReason")
    .then((res) => {
      const data = res.data?.message;
      const val = data.map((ele) => {
        return {
          label: ele?.FieldDisplay,
          value: ele?.FieldDisplay,
        };
      });
      state(val);
    })
    .catch((err) => {
      console.log(err);
    });
};


export const getBindReportDeliveryMethod = (state) =>{
  axios
    .get("/api/v1/ReportDeliveryMethod/BindReportDeliveryMethod")
    .then((res) => {
      const data = res.data?.message;
      const val = data.map((ele) => {
        return {
          label: ele?.FieldDisplay,
          value: ele?.FieldDisplay,
        };
      });
      state(val);
    })
    .catch((err) => {
      console.log(err);
    });
}


export const getSampleType = (state, id) => {
  axios
    .post("/api/v1/SampleType/getSampleTypeInVestigationWise", {
      InvestigationID: id,
    })
    .then((res) => {
      const data = res.data.message;
      console.log(data);
      let maindata = data.map((ele) => {
        return {
          value: ele?.id,
          label: ele?.SampleName,
        };
      });
      state(maindata);
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : "Error Occured"
      );
    });
};

var th = ["", "Thousand", "Million", "Billion", "Trillion"];
var dg = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];
var tn = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
var tw = [
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

export const toWords = (s) => {
  s = s.toString();
  s = s.replace(/[\, ]/g, "");
  if (s != parseFloat(s)) return "not a number";
  var x = s.indexOf(".");
  if (x == -1) x = s.length;
  if (x > 15) return "too big";
  var n = s.split("");
  var str = "";
  var sk = 0;
  for (var i = 0; i < x; i++) {
    if ((x - i) % 3 == 2) {
      if (n[i] == "1") {
        str += tn[Number(n[i + 1])] + " ";
        i++;
        sk = 1;
      } else if (n[i] != 0) {
        str += tw[n[i] - 2] + " ";
        sk = 1;
      }
    } else if (n[i] != 0) {
      // 0235
      str += dg[n[i]] + " ";
      if ((x - i) % 3 == 0) str += "Hundred ";
      sk = 1;
    }
    if ((x - i) % 3 == 1) {
      if (sk) str += th[(x - i - 1) / 3] + " ";
      sk = 0;
    }
  }

  if (x != s.length) {
    var y = s.length;
    str += "point ";
    for (var i = x + 1; i < y; i++) str += dg[n[i]] + " ";
  }
  return str.replace(/\s+/g, " ");
};
