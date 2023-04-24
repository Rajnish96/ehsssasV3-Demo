import * as Yup from "yup";

export const LoginSchema = Yup.object({
  username: Yup.string().min(3).max(25).required("Please Enter Your Username"),
  password: Yup.string().min(6).required("Please Enter Your Password"),
});

export const DoctorSchema = Yup.object({
  Name: Yup.string().min(3).max(25).required("Please Enter Your Name"),
  Mobile: Yup.string()
    .typeError("That doesn't look like a phone number")
    .required("Phone number is required!")
    .min(10)
    .max(10),
  DoctorCode: Yup.string().min(3).required("Please Enter Your DoctorCode"),
});

export const ChangePasswordSchema = Yup.object({
  OldPassword: Yup.string()
    .required("Please Enter your old Password")
    .min(6)
    .trim("The contact name cannot include leading and trailing spaces"),
  NewPassword: Yup.string()
    .trim("The contact name cannot include leading and trailing spaces")
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  ConfirmPassword: Yup.string()
    .trim("The contact name cannot include leading and trailing spaces")
    .required()
    .oneOf([Yup.ref("NewPassword"), null], "Passwords must match"),
});

export const DocotorReferal = Yup.object({
  DoctorCode: Yup.string()
    .required("Please Enter your DoctorCode")
    .trim("The contact name cannot include leading and trailing spaces"),
  Name: Yup.string()
    .required("Please Enter your Name")
    .trim("The contact name cannot include leading and trailing spaces"),
  ClinicName: Yup.string()
    .required("Please Enter your ClinicName")
    .trim("The contact name cannot include leading and trailing spaces"),
  Email: Yup.string()
    .email()
    .required("Please Enter your Email")
    .trim("The contact name cannot include leading and trailing spaces"),
  Mobile: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    )
    .required("Please Enter your Mobile Number"),
});

export const EmployeeMasterSchema = Yup.object({
  Name: Yup.string()
    .required("Please Enter your Name")
    .trim("The contact name cannot include leading and trailing spaces"),
  HouseNo: Yup.string()
    .required("Please Enter your HouseNo")
    .trim("The contact name cannot include leading and trailing spaces"),
  Pincode: Yup.string()
    .required("Please Enter your Pincode")
    .trim("The contact name cannot include leading and trailing spaces"),
  City: Yup.string()
    .required("Please Enter your City")
    .trim("The contact name cannot include leading and trailing spaces"),
  Mobile: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    )
    .required("Please Enter your Mobile Number"),
  Email: Yup.string()
    .email()
    .required("Please Enter your Email")
    .trim("The contact name cannot include leading and trailing spaces"),
  PCity: Yup.string()
    .required("Please Enter your PCity")
    .trim("The contact name cannot include leading and trailing spaces"),
  PPincode: Yup.string()
    .required("Please Enter your PPincode")
    .trim("The contact name cannot include leading and trailing spaces"),
  PHouseNo: Yup.string()
    .required("Please Enter your PHouseNo")
    .trim("The contact name cannot include leading and trailing spaces"),
});

export const InvestigationsMasterSchema = Yup.object().shape({
  TestCode: Yup.string()
    .required("Please Enter TestCode")
    .trim("The contact name cannot include leading and trailing spaces"),
  TestName: Yup.string()
    .required("Please Enter TestName")
    .trim("The contact name cannot include leading and trailing spaces"),
  PrintName: Yup.string()
    .required("Please Enter Lab Report TestName")
    .trim("The contact name cannot include leading and trailing spaces"),
  FromAge: Yup.number().required("FromAge is required"),
  ToAge: Yup.number()
    .required("ToAge is required")
    .test(
      "from-to-age",
      "To age must be greater than or equal to FromAge",
      function (value) {
        const { FromAge } = this.parent;
        return value >= FromAge;
      }
    ),
  ReportType: Yup.string()
    .required("Please Enter ReportType")
    .trim("The contact name cannot include leading and trailing spaces"),
  Gender: Yup.string()
    .required("Please Enter Gender")
    .trim("The contact name cannot include leading and trailing spaces"),

  SampleQty: Yup.string()
    .required("Please Enter SampleQty")
    .trim("The contact name cannot include leading and trailing spaces"),
  SampleRemarks: Yup.string()
    .required("Please Enter SampleRemarks")
    .trim("The contact name cannot include leading and trailing spaces"),
  SampleType: Yup.string()
    .required("Please Enter SampleType")
    .trim("The contact name cannot include leading and trailing spaces"),
  BaseRate: Yup.number().required("BaseRate is required"),
  MaxRate: Yup.number()
    .required("MaxRate is required")
    .test(
      "MaxRate",
      "MaxRate must be greater than or equal to BaseRate",
      function (value) {
        const { BaseRate } = this.parent;
        return value >= BaseRate;
      }
    ),

  MethodName: Yup.string()
    .required("Please Enter MethodName")
    .trim("The contact name cannot include leading and trailing spaces"),
});

export const ProfileInvestigationsMasterSchema = Yup.object().shape({
  TestCode: Yup.string()
    .required("Please Enter TestCode")
    .trim("The contact name cannot include leading and trailing spaces"),
  TestName: Yup.string()
    .required("Please Enter TestName")
    .trim("The contact name cannot include leading and trailing spaces"),
  PrintName: Yup.string()
    .required("Please Enter Lab Report TestName")
    .trim("The contact name cannot include leading and trailing spaces"),
  FromAge: Yup.number().required("FromAge is required"),
  ToAge: Yup.number()
    .required("ToAge is required")
    .test(
      "from-to-age",
      "To age must be greater than or equal to FromAge",
      function (value) {
        const { FromAge } = this.parent;
        return value >= FromAge;
      }
    ),
  ReportType: Yup.string()
    .required("Please Enter ReportType")
    .trim("The contact name cannot include leading and trailing spaces"),
  Gender: Yup.string()
    .required("Please Enter Gender")
    .trim("The contact name cannot include leading and trailing spaces"),

  SampleQty: Yup.string()
    .required("Please Enter SampleQty")
    .trim("The contact name cannot include leading and trailing spaces"),
  SampleRemarks: Yup.string()
    .required("Please Enter SampleRemarks")
    .trim("The contact name cannot include leading and trailing spaces"),
  SampleType: Yup.string()
    .required("Please Enter SampleType")
    .trim("The contact name cannot include leading and trailing spaces"),

  BaseRate: Yup.number().required("BaseRate is required"),
  MaxRate: Yup.number()
    .required("MaxRate is required")
    .test(
      "MaxRate",
      "MaxRate must be greater than or equal to BaseRate",
      function (value) {
        const { BaseRate } = this.parent;
        return value >= BaseRate;
      }
    ),
});

export const CenterMasterValidationSchema = Yup.object({
  CentreCode: Yup.string()
    .required("Please Enter your CentreCode")
    .trim("The contact name cannot include leading and trailing spaces"),

  Centre: Yup.string()
    .required("Please Enter your CentreName")
    .trim("The contact name cannot include leading and trailing spaces"),
});

export const RateMasterValidationSchema = Yup.object({
  CentreCode: Yup.string()
    .required("Please Enter your CentreCode")
    .trim("The contact name cannot include leading and trailing spaces"),

  Centre: Yup.string()
    .required("Please Enter your CentreName")
    .trim("The contact name cannot include leading and trailing spaces"),
  UserName: Yup.string()
    .min(3)
    .max(25)
    .required("Please Enter Your Username")
    .trim("The contact name cannot include leading and trailing spaces"),

  Password: Yup.string()
    .min(6)
    .required("Please Enter Your Password")
    .trim("The contact name cannot include leading and trailing spaces"),
});

export const OutSourceLabMasterValidationSchema = Yup.object({
  LabName: Yup.string()
    .required("Please Enter your LabName")
    .trim("The contact name cannot include leading and trailing spaces"),
  ContactPersonName: Yup.string()
    .required("Please Enter your ContactPersonName")
    .trim("The contact name cannot include leading and trailing spaces"),
  MobileNo: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    )
    .required("Please Enter your MobileNo"),
});

export const PatientRegisterSchema = Yup.object({
  Mobile: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    )
    .required("Please Enter your MobileNo"),
  FirstName: Yup.string().required("Please Enter Your Name").min(3).max(25),
  DOB: Yup.date().required("Please Choose DOB").max(new Date(), "inValid Date"),
});
