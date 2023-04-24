import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ActiveDoctor, Specialization } from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getDoctorSuggestion,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

function DoctorReferal() {
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [dropFalse, setDropFalse] = useState(true);
  const [load, setLoad] = useState(false);
  const [indexMatch, setIndexMatch] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [payload, setPayload] = useState({
    DoctorName: "",
    Mobile: "",
    Specialization: Specialization[0]?.value,
    isActive: ActiveDoctor[0]?.value,
  });

  const handleListSearch = (data, name) => {
    switch (name) {
      case "DoctorName":
        setPayload({ ...payload, [name]: data.Name });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      default:
        break;
    }
  };

  const handleIndex = (e) => {
    const { name } = e.target;
    switch (name) {
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

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  console.log(dropFalse);

  useEffect(() => {
    getDoctorSuggestion(payload, setDoctorSuggestion, setPayload);
  }, [payload?.DoctorName]);

  const fetch = () => {
    setLoad(true);
    axios
      .post("/api/v1/DoctorReferal/SearchDoctorData", {
        ...payload,
        Name: payload?.DoctorName,
      })
      .then((res) => {
        setTableData(res?.data?.message);
        setLoad(false);
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
    fetch();
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">DoctorReferal Master</a>
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                DoctorReferal List
              </h6>
              <Link to="/CreateDoctorReferal" className="float-right">
                Create New
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Doctor Name
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  name="DoctorName"
                  value={payload?.DoctorName}
                  type="text"
                  autoComplete={"off"}
                  onChange={(e) => {
                    handleChange(e);
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
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Mobile
                </label>
                <Input className="form-control pull-right reprint-date " />
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Specialization
                </label>
                <SelectBox
                  options={Specialization}
                  selectedValue={selectedValueCheck(
                    Specialization,
                    payload?.Specialization
                  )}
                  name="Specialization"
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Status
                </label>
                <SelectBox
                  options={ActiveDoctor}
                  selectedValue={selectedValueCheck(
                    ActiveDoctor,
                    payload?.isActive
                  )}
                  name="isActive"
                  onChange={handleSelectChange}
                />
              </div>

              <div
                className="col-sm-2 col-md-2 form-group"
                style={{ alignSelf: "flex-end" }}
              >
                <button className="btn btn-success" onClick={fetch}>
                  search
                </button>
              </div>
            </div>
            {load ? (
              <div className="mt-3">
                <Loading />
              </div>
            ) : (
              <div className="boottable">
              <Table responsive hover bordered striped>
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Specialization</th>
                    <th>Email</th>
                    <th>ClinicName</th>
                    <th>Degree</th>
                    <th>Address</th>
                    <th>Mobile</th>
                    <th>Active</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data?.Name}</td>
                      <td>{data?.Phone ? data?.Phone : "-"}</td>
                      <td>
                        {data?.Specialization ? data?.Specialization : "-"}
                      </td>
                      <td>{data?.Email ? data?.Email : "-"}</td>
                      <td>{data?.ClinicName ? data?.ClinicName : "-"}</td>
                      <td>{data?.Degree ? data?.Degree : "-"}</td>
                      <td>{data?.Address ? data?.Address : "-"}</td>
                      <td>{data?.Mobile ? data?.Mobile : "-"}</td>
                      <td>{data?.isActive === 1 ? "Active" : "Expired"}</td>
                      <td className="text-primary">
                        <Link
                          to="/CreateDoctorReferal"
                          state={{
                            url: "/api/v1/DoctorReferal/GetSingleDoctorData",
                            url1: "/api/v1/DoctorReferal/UpdateDoctorReferal",
                            id: data?.DoctorReferalID,
                          }}
                          className="float-right"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorReferal;
