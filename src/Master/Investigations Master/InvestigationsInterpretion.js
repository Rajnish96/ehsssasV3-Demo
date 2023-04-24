import axios from "axios";
import { CKEditor } from "ckeditor4-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { selectedValueCheck } from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import TextEditor from "../Report/TextEditor";

const InvestigationsInterpretion = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [CentreData, setCentreData] = useState([]);
  const [load, setLoad] = useState(false);
  const [Machine, setMachine] = useState([]);
  const [Editor, setEditor] = useState("");
  const [payload, setPayload] = useState({
    CentreID: "1",
    MacID: "35",
    Interpretation: "",
    InvestigationID: state?.InvestigationID ? state?.InvestigationID : "",
    PrintInterPackage: "",
  });

  const fetch = () => {
    axios
      .post(state?.url, {
        CentreID: payload?.CentreID,
        InvestigationID: payload?.InvestigationID,
        MacID: payload?.MacID,
      })
      .then((res) => {
        if (res?.data?.message.length === 0) {
          toast.success("No Data Found");
        } else {
          const data = res?.data?.message[0];
          setPayload({
            ...payload,
            CentreID: data?.CentreID,
            MacID: data?.MacID,
            Interpretation: data?.Interpretation,
            InvestigationID: data?.InvestigationID,
            PrintInterPackage: "",
          });
          setEditor(data?.Interpretation);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  console.log(payload);

  const SaveInterpretion = () => {
    setLoad(true);
    axios
      .post("/api/v1/Investigations/SaveInterpretation", payload)
      .then((res) => {
        if (res.data.message) {
          setLoad(false);
          toast.success(res.data.message);
          navigate(-1);
        }else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoad(false);
        if (err?.response?.status === 504) {
          toast.error("Something went wrong");
        }
      });
  };

  const getAccessCentres = () => {
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
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };
  const getMachine = () => {
    axios
      .get("/api/v1/Investigations/BindMachineList")
      .then((res) => {
        let data = res.data.message;
        let Machine = data.map((ele) => {
          return {
            value: ele.MachineId,
            label: ele.MachineName,
          };
        });
        setMachine(Machine);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  useEffect(() => {
    setPayload({ ...payload, Interpretation: Editor });
  }, [Editor]);

  useEffect(() => {
    getAccessCentres();
    getMachine();
    fetch();
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">labobservationInterpretation</a>
          </li>
          <li className="breadcrumb-item active">
            {/* {state?.other?.pageName ? state?.other?.pageName : "Create"} */}
            Create
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            {/* {state?.other?.pageName ? state?.other?.pageName : "Create"} */}
            <span className="m-0 font-weight-bold text-primary"> Create</span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form-group">
                <label className="control-label">Investigation</label>
                <SelectBox
                  isDisabled
                  selectedValue={{
                    value: state?.data,
                    label: state?.data,
                  }}
                  name="TestName"
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label">Centre Name</label>
                <SelectBox
                  options={CentreData}
                  onChange={handleSelectChange}
                  name="CentreID"
                  selectedValue={selectedValueCheck(
                    CentreData,
                    payload?.CentreID
                  )}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label">Machine</label>
                <SelectBox
                  options={Machine}
                  onChange={handleSelectChange}
                  name="MacID"
                  selectedValue={selectedValueCheck(Machine, payload?.MacID)}
                />
              </div>

              <div className="col-sm-3  form-group">
                <br />
                <Input
                  name="PrintInterPackage"
                  type="checkbox"
                  checked={payload?.PrintInterPackage}
                  onChange={handleChange}
                />
                <label>For All Centre</label>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-12">Interpretation</label>
              <div className="col-md-12">
                <TextEditor
                  value={payload?.Interpretation}
                  setValue={setEditor}
                />
              </div>
            </div>
            <div className="form-group">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="margin btn btn-success "
                  onClick={SaveInterpretion}
                >
                  Save
                </button>
              )}
              <button
                className="margin btn btn-primary"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationsInterpretion;
