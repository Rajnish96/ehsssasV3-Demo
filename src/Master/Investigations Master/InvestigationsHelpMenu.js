import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { selectedValueCheck } from "../../Frontend/util/Commonservices";
import HelpMenuModal from "../../Frontend/util/HelpMenuModal";

const InvestigationsHelpMenu = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [Edit, setEdit] = useState(false);
  const [Value, setValue] = useState("");
  const [HelpMenu, setHelpMenu] = useState([]);
  const [formData, setFormData] = useState({
    HelpMenuId: "",
    InvestigationId: state?.data?.InvestigationID
      ? state?.data?.InvestigationID
      : "",
    IsActive: "1",
    MenuId: "",
    MenuName: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getHelpMenu = () => {
    axios
      .get("/api/v1/Investigations/GetHelpMenu")
      .then((res) => {
        let data = res.data.message;
        let helpMenu = data.map((ele) => {
          return {
            value: ele.MenuId,
            label: ele.MenuName,
          };
        });
        setHelpMenu(helpMenu);
      })
      .catch((err) => console.log(err));
  };

  const MapHelpMenu = () => {
    axios
      .post("/api/v1/Investigations/MapHelpMenu", {
        HelpMenuId: formData?.HelpMenuId,
        InvestigationId: formData?.InvestigationId,
        IsActive: formData?.IsActive,
      })
      .then((res) => {
        if (res.data.message) {
          toast.success("Mapped successfully");
          handleShowMapMenu();
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  console.log(HelpMenu);

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setFormData({ ...formData, [name]: event.value, MenuName: event?.label });
  };

  const handleShowMapMenu = () => {
    axios
      .post("/api/v1/Investigations/ShowMapMenu", {
        InvestigationID: formData?.InvestigationId,
      })
      .then((res) => {
        setValue(res?.data?.message[0]?.HelpMenu);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  // console.log(Value)

  useEffect(() => {
    getHelpMenu();
    handleShowMapMenu();
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      {show && (
        <HelpMenuModal
          show={show}
          handleClose={handleClose}
          Edit={Edit}
          getHelpMenu={getHelpMenu}
          state={formData}
        />
      )}
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Investigations</a>
          </li>
          <li className="breadcrumb-item active">Help Menu</li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">Help Menu</span>
          </div>
          <div className="card-body row">
            <div className="col-sm-3 col-md-3 form-group">
              <label className="control-label ">Test Name</label>
              <Input
                type="text"
                className="form-control pull-right reprint-date "
                disabled
                value={state?.data?.TestName}
              />
            </div>
          </div>
          <div className="card-body row">
            <div className="col-sm-4 col-md-4 form-group">
              <label className="control-label">Help Menu</label>
              <SelectBox
                options={HelpMenu}
                name="HelpMenuId"
                onChange={handleSelectChange}
                selectedValue={selectedValueCheck(
                  HelpMenu,
                  formData?.HelpMenuId
                )}
              />
            </div>
            <div className="col-sm-4 offset-sm-3 border border-dark">
              <div className="text-center">
                <h5>Detail :</h5>
                <span className="text-center">{Value}</span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <button className="margin btn btn-success " onClick={MapHelpMenu}>
              Map
            </button>
            <button
              className="margin btn btn-success"
              onClick={() => {
                handleShow();
                setEdit(false);
              }}
            >
              Add New Help
            </button>
            <button
              className="margin btn btn-success "
              onClick={() => {
                handleShow();
                setEdit(true);
              }}
            >
              Edit Help
            </button>
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
  );
};

export default InvestigationsHelpMenu;
