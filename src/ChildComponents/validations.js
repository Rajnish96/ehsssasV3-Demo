export const fieldValidations = (text, type) => {
  switch (type) {
    case "email":
      let regEmail =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (text.value === "") {
        return "Email is required";
      } else if (!regEmail.test(text)) {
        return "invalid Email";
      }
  }
};

export const validation = (formData) => {
  let err = "";
  if (formData?.Department.trim() === "") {
    err = { ...err, Department: "This Field is Required" };
  } else if (formData?.Department.length < 2) {
    err = { ...err, Department: "Must be 2 Character long" };
  }

  if (formData?.DepartmentCode.trim() === "") {
    err = { ...err, DepartmentCode: "This Field is Required" };
  } else if (formData?.DepartmentCode.length < 2) {
    err = { ...err, DepartmentCode: "Must be 2 Character long" };
  }

  return err;
};
export const validationForAgeWise = (formData) => {
  let err = "";
  if (formData?.DiscountType.trim() === "") {
    err = { ...err, DiscountType: "This Field is Required" };
  }
  if (formData?.DiscountPer === "") {
    err = { ...err, DiscountPer: "This Field is Required" };
  } else if (formData?.DiscountPer > 100) {
    err = { ...err, DiscountPer: "Enter Valid Discount" };
  }

  if (formData?.FromAge === "") {
    err = { ...err, FromAge: "This Field is Required" };
  } else if (formData?.FromAge > 110) {
    err = { ...err, FromAge: "Enter Valid Age" };
  }

  if (formData?.ToAge === "") {
    err = { ...err, ToAge: "This Field is Required" };
  } else if (formData?.ToAge > 110) {
    err = { ...err, ToAge: "Enter Valid Age" };
  } else if (formData?.ToAge < formData?.FromAge) {
    err = { ...err, ToAge: " Must be equal or greater than FromAge" };
  }

  if (formData?.Gender === "") {
    err = { ...err, Gender: "Gender is Required" };
  }

  if (formData?.DiscountShareType === "") {
    err = { ...err, DiscountShareType: "DiscountShareType is Required" };
  }

  return err;
};

export const validationForIDMAster = (formData) => {
  let err = "";
  if (formData?.InitialChar.trim() === "") {
    err = { ...err, InitialChar: "This Field is Required" };
  }
  if (formData?.FinancialYearStart.trim() === "") {
    err = { ...err, FinancialYearStart: "This Field is Required" };
  }
  return err;
};

// export const PatientRegisterSchema = (formdata) => {
//   let err = {};
//   if (formdata?.Mobile === "") {
//     err = { ...err, Mobile: "This Field Required" };
//   }

//   return err;
// };

export const validationForDesignations = (formData) => {
  let err = "";
  if (formData?.Name.trim() === "") {
    err = { ...err, Name: "This Field is Required" };
  }
  if (formData?.SequenceNo === "") {
    err = { ...err, SequenceNo: "This Field is Required" };
  }
  return err;
};

export const validationForSampleType = (formData) => {
  let err = "";
  if (formData?.SampleName.trim() === "") {
    err = { ...err, SampleName: "This Field is Required" };
  }
  if (formData?.Container === "") {
    err = { ...err, Container: "This Field is Required" };
  }
  return err;
};