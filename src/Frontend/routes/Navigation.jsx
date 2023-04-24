import React from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute, HomeRouter } from "../util/ProtectedRoute";
import RenderPage from "../BlankPage/BlankPage";
import LoginForm from "../Login/LoginAdminLte";
import { Inputs } from "adminlte-2-react";
import { BrowserRouter } from "react-router-dom";
import AdvancedElements from "../AdvancedElements/AdvancedElements";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReceiptReprint from "../Lab/ReceiptReprint";
import PatientRegister from "../Lab/PatientRegister";
import DispatchReport from "../Lab/DispatchReport";
import DepartmentReceive from "../Lab/DepartmentReceive";
import Create from "../../Master/DepartmentComponents/Create";
import EditPage from "../../Master/DepartmentComponents/EditPage";
import AgeWiseDiscount from "../../Master/AgeWise/AgeWiseDiscount";
import Departments from "../../Master/DepartmentComponents/Departments";
import DesignationsCreate from "../../Master/Designations/DesignationsCreate";
import Designations from "../../Master/Designations/Designations";
import AgeWiseDiscountList from "../../Master/AgeWise/AgeWiseDiscountList";
import IDMaster from "../../Master/IDMaster/IDMaster";
import CentreMaster from "../../Master/CentreMaster/CentreMaster";
import CentreMasterList from "../../Master/CentreMaster/CentreMasterList";
import ReportBill from "../../Master/Report/ReportBill";
import ReceiptPDF from "../../Master/Report/ReceiptPDF";
import ManageDeliveryDays from "../../Master/ManageDelivery/ManageDeliveryDays";
import Investigations from "../../Master/Investigations Master/Investigations";
import InvestigationsList from "../../Master/Investigations Master/InvestigationsList";
import InvestigationRange from "../../Master/Investigations Master/InvestigationRange";
import InvestigationsInterpretion from "../../Master/Investigations Master/InvestigationsInterpretion";
import EmployeeMaster from "../../Master/EmployeeMaster/EmployeeMaster";
import CreateEmployeeMaster from "../../Master/EmployeeMaster/CreateEmployeeMaster";
import ChangePassword from "../../Master/Password/ChangePassword";
import DoctorReferal from "../../Master/DoctorRefferal.js/DoctorReferal";
import ManageFieldMaster from "../../Master/ManageFieldMaster.js/ManageFieldMaster";
import DoctorReferalCreate from "../../Master/DoctorRefferal.js/DoctorReferalCreate";
import GlobalTypeMaster from "../../Master/GlobalTypeMaster/GlobalTypeMaster";
import ViewGlobalMaster from "../../Master/GlobalTypeMaster/ViewGlobalMaster";
import InvestigationsRequiredField from "../../Master/Investigations Master/InvestigationsRequiredField";
import InvestigationsHelpMenu from "../../Master/Investigations Master/InvestigationsHelpMenu";
import SampleType from "../../Master/SampleTypeMaster/SampleType";
import SampleTypeCreate from "../../Master/SampleTypeMaster/SampleTypeCreate";
import RateList from "../../Master/RateList/RateList";
import ConcentForm from "../../Master/ConcentForm/ConcentForm";
import { OutSourceLabMaster } from "../../Master/OutSource Master/OutSourceLabMaster";
import OutSourceTagging from "../../Master/OutSource Master/OutSourceTagging";
import ImportExportExcelMaster from "../../Master/ImportExcel/ImportExportExcelMaster";
import CentrePanel from "../../Master/CentrePanel/CentrePanel";
import SendSampleToLab from "../Lab/SendSampleToLab";
import ManageNablMaster from "../../Master/ManageNabl/ManageNablMaster";
import FormulaMaster from "../../Master/Formula/FormulaMaster";
import SmsMaster from "../../Master/Sms/SmsMaster";
import OutSourceLabInvestigations from "../../Master/OutSource Master/OutSourceLabInvestigations";
// const AdvancedElements = React.lazy(() => import('../AdvancedElements/AdvancedElements'));
// const LoginForm = React.lazy(() => import("../Login/LoginAdminLte"));
import SampleCollection from "./../Lab/SampleCollection";
import ResultEntry from "../Lab/ResultEntry";
import InvestigationRequiredMaster from "../../Master/InvestigationRequiredMaster/InvestigationRequiredMaster";

const Navigation = () => {
  return (
    <div>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* before login routes */}
          <Route path="/" element={<HomeRouter />}>
            <Route path="/login" element={<LoginForm />} />
          </Route>

          {/* after login routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/advancedelements" element={<AdvancedElements />} />
            <Route path="/receiptreprint" element={<ReceiptReprint />} />
            <Route path="/patientregister" element={<PatientRegister/>}/>
            <Route path="/dispatchreport" element={<DispatchReport/>}/>
            <Route path="/DepartmentReceive" element={<DepartmentReceive/>}/>
            <Route path="/SampleCollection" element={<SampleCollection/>}/>
              <Route path="/ResultEntry" element={<ResultEntry/>}/>
            <Route path="/Departments" element={<Departments />} />
            <Route path="/Create" element={<Create />} />
            <Route path="/Edit" element={<EditPage />} />
            <Route path="/AgeWiseDiscount" element={<AgeWiseDiscount />} />
            <Route
              path="/AgeWiseDiscountList"
              element={<AgeWiseDiscountList />}
            />
            <Route path="/Designations" element={<Designations />} />
            <Route
              path="/DesignationsCreate"
              element={<DesignationsCreate />}
            />
            <Route path="/IDMaster" element={<IDMaster />} />
            <Route path="/CentreMaster" element={<CentreMaster />} />
            <Route path="/CentrePanel" element={<CentrePanel />} />
            <Route path="/ConcentForm" element={<ConcentForm />} />
            <Route path="/CentreMasterList" element={<CentreMasterList />} />
            <Route
              path="/OutSourceLabMaster"
              element={<OutSourceLabMaster />}
            />
            <Route path="/OutSourceTagging" element={<OutSourceTagging />} />
            <Route
              path="/OutSourceLabInvestigations"
              element={<OutSourceLabInvestigations />}
            />
            <Route path="/Investigations" element={<Investigations />} />
            <Route
              path="/InvestigationsRange"
              element={<InvestigationRange />}
            />
            <Route
              path="/InvestigationsInterpretion"
              element={<InvestigationsInterpretion />}
            />
            <Route
              path="/InvestigationsList"
              element={<InvestigationsList />}
            />

            <Route path="/CentreMaster/:name" element={<CentreMaster />} />
            <Route
              path="/CentreMasterList/:name"
              element={<CentreMasterList />}
            />

            <Route
              path="/RequiredFields"
              element={<InvestigationsRequiredField />}
            />
            <Route path="/HelpMenu" element={<InvestigationsHelpMenu />} />
            <Route path="/ReportBill" element={<ReportBill />} />
            <Route
              path="/ManageDeliveryDays"
              element={<ManageDeliveryDays />}
            />
            <Route path="/EmployeeMaster" element={<EmployeeMaster />} />
            <Route
              path="/CreateEmployeeMaster"
              element={<CreateEmployeeMaster />}
            />
            <Route path="/DoctorReferal" element={<DoctorReferal />} />
            <Route path="/ChangePassword" element={<ChangePassword />} />
            <Route path="/RateList" element={<RateList />} />
            <Route path="/ManageFieldMaster" element={<ManageFieldMaster />} />
            <Route
              path="/CreateDoctorReferal"
              element={<DoctorReferalCreate />}
            />
            <Route path="/GlobalTypeMaster" element={<GlobalTypeMaster />} />
            <Route path="/ViewGlobalMaster" element={<ViewGlobalMaster />} />
            <Route path="/SampleType" element={<SampleType />} />
            <Route path="/SampleTypeCreate" element={<SampleTypeCreate />} />
            <Route
              path="/ImportExportExcel"
              element={<ImportExportExcelMaster />}
            />
            <Route path="/ManageNabl" element={<ManageNablMaster />} />
            <Route path="/SendSample" element={<SendSampleToLab />} />
            <Route path="/FormulaMaster" element={<FormulaMaster />} />
            <Route path="/SmsMaster" element={<SmsMaster />} />
            <Route
              path="/InvestigationRequiredMaster"
              element={<InvestigationRequiredMaster />}
            />
          </Route>
          <Route path="/GetLabReportPreview" element={<ReceiptPDF />} />

          {/* blank page*/}
          <Route path="/*" element={<RenderPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Navigation;
