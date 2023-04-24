export const SearchBy = [
  { label: "Select", value: "" },
  { label: "BarcodeNo", value: "BarcodeNo" },
  { label: "Mobile", value: "Mobile" },
  { label: "PatientCode", value: "PatientCode" },
  { label: "PatientName", value: "PatientName" },
  { label: "SelectType", value: "SelectType" },
  { label: "VisitNo", value: "VisitNo" },
];

export const RefundFilter = [
  { label: "All", value: 0 },
  { label: "Refunded", value: 1 },
];

export const stateIniti = {
  DOB: "",
  Age: "",
  AgeYear: "",
  AgeDays: "",
  AgeMonth: "",
  RateID: 2,
  TotalAgeInDays: "",
  Title: "Miss.",
  FirstName: "",
  LastName: "",
  MiddleName: "",
  CentreID: 1,
  Mobile: "",
  PinCode: "",
  State: "",
  Country: "",
  Email: "",
  City: "",
  HouseNo: "",
  StreetName: "",
  Locality: "",
  Phone: "",
  Gender: "",
  isVIP: 0,
  IsMask: 0,
  PatientCode: "",
  PageName: "PatientRegistration",
  BarcodeNo:"",
};

export const LTDataIniti = {
  TypeOfTnx: "OPD-LAB",
  NetAmount: "",
  GrossAmount: "",
  Date: "",
  DiscountOnTotal: "",
  IsCredit: 0,
  PName: "",
  Age: "",
  Gender: "",
  VIP: "0",
  DiscountReason: "BPL Card Discount",
  DiscountApprovedBy:"4",
  Remarks: "",
  ReferRate: "1",
  CentreName: "Nivaran Path Lab",
  DoctorID: "",
  DoctorName: "",
  ReferLabId: "",
  ReferLabName: "",
  ReferLab: 0,
  OtherReferLab: "",
  CardNo: "",
  CentreID: 1,
  RateTypeId: "",
  Adjustment: "",
  AdjustmentDate: "",
  isDocumentUploaded: 0,
  PatientIDProof: 47,
  PatientIDProofNo: "",
  PatientSource: "",
  PatientType: "",
  VisitType: 1,
  HLMPatientType: "OPD",
  HLMOPDIPDNo: "",
  reVisit: 0,
  HLMUHID: "PAT0049",
  BedNo: "",
  isAllowPrint: 0,
  CollectionBoyId: 1,
  ReportDeliveryMethodId: "To Patient",
  ReportDeliveryMethodDetail: "",
};

export const ReportType = [
  { label: "Lab Report", value: "Lab Report" },
  { label: "Bill", value: "Bill" },
  { label: "TRF", value: "TRF" },
];

export const TemplateName = [
  { label: "Template 1", value: "1" },
  { label: "Template 2", value: "2" },
  { label: "Template 3", value: "3" },
  { label: "Template 4", value: "4" },
  { label: "Template 5", value: "5" },
];

export const ActiveTemplateID = [
  { label: "Active", value: "1" },
  { label: "Not Active", value: "2" },
];

export const PageSize = [
  {
    value: "A0",
    label: "A0",
  },

  {
    value: "A1",
    label: "A1",
  },

  {
    value: "A2",
    label: "A2",
  },

  {
    value: "A3",
    label: "A3",
  },

  {
    value: "A4",
    label: "A4",
  },

  {
    value: "A5",
    label: "A5",
  },

  {
    value: "A6",
    label: "A6",
  },

  {
    value: "A7",
    label: "A7",
  },

  {
    value: "A8",
    label: "A8",
  },

  {
    value: "A9",
    label: "A9",
  },

  {
    value: "A10",
    label: "A10",
  },

  {
    value: "B0",
    label: "B0",
  },

  {
    value: "B1",
    label: "B1",
  },

  {
    value: "B2",
    label: "B2",
  },

  {
    value: "B3",
    label: "B3",
  },

  {
    value: "B4",
    label: "B4",
  },

  {
    value: "B5",
    label: "B5",
  },
  {
    value: "ArchA",
    label: "ArchA",
  },
  {
    value: "ArchB",
    label: "ArchB",
  },
  {
    value: "ArchC",
    label: "ArchC",
  },
  {
    value: "ArchD",
    label: "ArchD",
  },
  {
    value: "ArchE",
    label: "ArchE",
  },

  {
    value: "Flsa",
    label: "Flsa",
  },
  { value: "HalfLetter", label: "HalfLetter" },
  { value: "Ledger", label: "Ledger" },
  { value: "Legal", label: "Legal" },
  { value: "Letter", label: "Letter" },
  { value: "Letter11x17", label: "Letter11x17" },
  { value: "Note", label: "Note" },
];

export const PageOrientation = [
  {
    label: "Portrait",
    value: "Portrait",
  },
  {
    label: "Landscape",
    value: "Landscape",
  },
];

export const LableID = [
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Patient NAME ",
    LabelID: "PatientName",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Age/Gender",
    LabelID: "Age",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Patient NAME ",
    LabelID: "PatientName",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Mobile No.",
    LabelID: "Mobile",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "DeliveryMode",
    LabelID: "Bill",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Reg. Date",
    LabelID: "Date",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Patient Address.",
    LabelID: "Address",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Panel Name ",
    LabelID: "Centre",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "PatientCode",
    LabelID: "PatientCode",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Refered By ",
    LabelID: "ReferedBy",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Lab No",
    LabelID: "VisitNo",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Centre Cont No",
    LabelID: "CentreContactNo",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "",
    LabelID: "CentreAddress",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "CreatedBy",
    LabelID: "CreatedBy",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Collector",
    LabelID: "Collector",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
];

export const FontFamily = [
  {
    label: "Arial",
    value: "Arial",
  },
  {
    label: "Times New Roman",
    value: "Times New Roman",
  },
  {
    label: "Calibri",
    value: "Calibri",
  },
  {
    label: "Verdana",
    value: "Verdana",
  },
];

export const DynamicReportType = [
  {
    label: "Text",
    value: "Text",
  },
  {
    label: "Data",
    value: "Data",
  },
  {
    label: "Barcode",
    value: "Barcode",
  },
  {
    label: "Image",
    value: "Image",
  },
  {
    label: "Line",
    value: "Line",
  },
  {
    label: "Box",
    value: "Box",
  },
  {
    label: "RoundBox",
    value: "RoundBox",
  },
  {
    label: "PrintDateTime",
    value: "PrintDateTime",
  },
  {
    label: "NoOfPages",
    value: "NoOfPages",
  },
  {
    label: "Provisional",
    value: "Provisional",
  },
];

export const TypePlaceHolder = [
  {
    label: "Header",
    value: "Header",
  },
  {
    label: "Page",
    value: "Page",
  },
  {
    label: "Footer",
    value: "Footer",
  },
];

export const DDLData = [
  {
    label: "",
    value: "",
  },
  {
    label: "PatientName",
    value: "PatientName",
  },
  {
    label: "Age",
    value: "Age",
  },
  {
    label: "Mobile",
    value: "Mobile",
  },
  {
    label: "Bill",
    value: "Bill",
  },
  {
    label: "Date",
    value: "Date",
  },
  {
    label: "Address",
    value: "Address",
  },
  {
    label: "Centre",
    value: "Centre",
  },
  {
    label: "PatientCode",
    value: "PatientCode",
  },
  {
    label: "ReferedBy",
    value: "ReferedBy",
  },
  {
    label: "VisitNo",
    value: "VisitNo",
  },
  {
    label: "CentreContactNo",
    value: "CentreContactNo",
  },
  {
    label: "CentreAddress",
    value: "CentreAddress",
  },
  {
    label: "CreatedBy",
    value: "CreatedBy",
  },
  {
    label: "Collector",
    value: "Collector",
  },
];

export const Active = [
  {
    label: "Active",
    value: "Active",
  },
  {
    label: "Deactive",
    value: "Deactive",
  },
];

export const Dynamic = {
  Data: "",
  DynamicReportType: "",
  Height: "",
  ImageData: "",
  IsActive: "",
  PositionLeft: "",
  PositionTop: "",
  Text: "",
  TypePlaceHolder: "",
  Width: "",
};

// investigations

export const DataType = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Package",
    value: "Package",
  },
  {
    label: "Profile",
    value: "Profile",
  },
  {
    label: "Test",
    value: "Test",
  },
];

export const ReportTypeNew = [
  {
    label: "Memo",
    value: "2",
  },
  {
    label: "Numeric",
    value: "1",
  },
];
export const SampleOption = [
  {
    label: "Sample Not Required",
    value: "Sample Not Required",
  },
  {
    label: "Sample Required",
    value: "Sample Required",
  },
];

export const Specialization = [
  {
    label: "All",
    value: "All",
  },
];

export const CreateSpecialization = [
  {
    label: "Bio Chemist",
    value: "Bio Chemist",
  },
  {
    label: "Diabetes",
    value: "Diabetes",
  },
  {
    label: "Dietician",
    value: "Dietician",
  },
  {
    label: "Family Medicine",
    value: "Family Medicine",
  },
];

export const Degree = [
  {
    value: "B.SC MBBS",
    label: "B.SC MBBS",
  },

  {
    value: "(BDS) Gold Medalist",
    label: "(BDS) Gold Medalist",
  },
];

export const ActiveDoctor = [
  {
    label: "Active",
    value: "1",
  },
  {
    label: "In-Active",
    value: "0",
  },
];

export const Zone = [
  {
    value: "Zone2234",
    label: "Zone2234",
  },
  {
    value: "Zone3",
    label: "Zone3",
  },
];

export const Locality = [
  {
    value: "Sector 1",
    label: "Sector 1",
  },
  {
    value: "Sector 2",
    label: "Sector 2",
  },
];

export const All_Zero = [
  {
    label: "All",
    value: "1",
  },
  {
    label: "Zero Rate Only",
    value: "2",
  },
];

export const ChangeRateDDL = [
  {
    label: "-",
    value: "1",
  },
  {
    label: "+",
    value: "2",
  },
];

export const RoundOff = [
  {
    label: 0,
    value: 0,
  },
  {
    label: 1,
    value: 1,
  },
  {
    label: 2,
    value: 2,
  },
  {
    label: 3,
    value: 3,
  },
  {
    label: 4,
    value: 4,
  },
];

export const PaymentMode = [
  {
    label: "Cash",
    value: "Cash",
  },
  {
    label: "Credit",
    value: "Credit",
  },
];

export const LoginAllowed = [
  {
    label: "Yes",
    value: "1",
  },
  {
    label: "No",
    value: "0",
  },
];

export const InestigationRange = {
  InvestigationID: "",
  LabObservationID: "",
  Gender: "",
  FromAge: "",
  ToAge: "",
  MinReading: "",
  MaxReading: "",
  DisplayReading: "",
  DefaultReading: "",
  MinCritical: "",
  MaxCritical: "",
  ReadingFormat: "",
  Interpretation: "",
  MacID: "",
  MethodName: "",
  ShowMethod: "",
  CentreID: "",
  AbnormalValue: "",
  RangeType: "",
  AutoApprovedMin: "",
  AutoApprovedMax: "",
  AMRMin: "",
  AMRMax: "",
  ReflexMin: 0,
  ReflexMax: 0,
  RoundOff: 0,
  DlcCheck: "",
  isActive: 1,
};

export const ImportExport = [
  {
    label: "RateList",
    value: "RateList",
  },
  {
    label: "DoctorReferal",
    value: "DoctorReferal",
  },
];

export const Status = [
  {
    label: "Pending",
    value: "1",
  },
  {
    label: "Send",
    value: "2",
  },
];

export const SelectAccredition = [
  {
    value: "0",
    label: "--Select Accredition--",
  },
  {
    value: "3",
    label: "CAP",
  },
  {
    value: "1",
    label: "NA",
  },
  {
    value: "2",
    label: "NABL",
  },
  {
    value: "4",
    label: "NABL+CAP",
  },
  {
    value: "5",
    label: "Not in Scope",
  },
];


export const SampleSource = [
  {
    label: "Left Arm",
    value: "Left Arm",
  },
  {
    label: "Right Arm",
    value: "Right Arm",
  },
];

export const PdfData = [
  {
    LabelID: "PatientName",
    LabelDetail: "Sahil Kumar",
  },
  {
    LabelID: "Age",
    LabelDetail: "22Years / Male",
  },
  {
    LabelID: "Mobile",
    LabelDetail: "7290908802",
  },
  {
    LabelID: "Bill",
    LabelDetail: "LAb.002",
  },
  {
    LabelID: "Date",
    LabelDetail: "23/02/2023",
  },
  {
    LabelID: "Address",
    LabelDetail: "Delhi",
  },
  {
    LabelID: "Centre",
    LabelDetail: "HCG",
  },
  {
    LabelID: "PatientCode",
    LabelDetail: "22222",
  },
  {
    LabelID: "ReferedBy",
    LabelDetail: "Ankit Sir",
  },
  {
    LabelID: "VisitNo",
    LabelDetail: "23LAb",
  },
  {
    LabelID: "CentreContactNo",
    LabelDetail: "1234567890",
  },
  {
    LabelID: "CentreAddress",
    LabelDetail: "0987654edf ",
  },
  {
    LabelID: "CreatedBy",
    LabelDetail: "Brijesh Sir",
  },
  {
    LabelID: "Collector",
    LabelDetail: "Self",
  },
];

export const InputFields = [
  {
    label: "TextBox",
    value: "TextBox",
  },
  {
    label: "CheckBox",
    value: "CheckBox",
  },
  {
    label: "DropDown",
    value: "DropDown",
  },
];
