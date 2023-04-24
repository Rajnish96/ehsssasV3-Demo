import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getDesignationData,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

function EmployeeMaster() {
  const [Designation, setDesigation] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    DesignationID: "",
    Name: "",
  });
  const [tableData, setTableData] = useState([]);

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  const handleSearch = () => {
    setLoad(true);
    axios
      .post("/api/v1/Employee/getEmployeeDetails", payload)
      .then((res) => {
        setTableData(res.data?.message);
        setLoad(false);
        if (res.data.message.length === 0) {
          toast.success("No Data Found");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoad(false);
      });
  };

  useEffect(() => {
    getDesignationData(setDesigation);
  }, []);

  useEffect(() => {
    setPayload({
      ...payload,
      DesignationID: Designation[0]?.value,
    });
  }, [Designation]);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Employee Master</a>
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Search Criteria
              </h6>

              <Link className="float-right" to="/CreateEmployeeMaster">
                Create New
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Designation
                </label>
                <SelectBox
                  name="DesignationID"
                  options={Designation}
                  selectedValue={selectedValueCheck(
                    Designation,
                    payload?.DesignationID
                  )}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Name
                </label>
                <Input
                  name="Name"
                  value={payload?.Name}
                  className="form-control pull-right reprint-date"
                  type="text"
                  onChange={(e) => {
                    setPayload({ ...payload, Name: e.target.value });
                  }}
                />
              </div>

              <div
                className="col-sm-2 col-md-2 form-group"
                style={{ alignSelf: "self-end" }}
              >
                {load ? (
                  <Loading />
                ) : (
                  <button className="btn btn-success" onClick={handleSearch}>
                    Search
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {tableData.length > 0 && (
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Table Data
                </h6>
              </div>
              <div className="card-body boottable">
                <Table responsive hover bordered>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Name</th>
                      <th>HouseNo</th>
                      <th>Street Name</th>
                      <th>Locality</th>
                      <th>City</th>
                      <th>PinCode</th>
                      <th>PHouseNo</th>
                      <th>PStreetName</th>
                      <th>PLocality</th>
                      <th>PCity</th>
                      <th>PPincode</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Active</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data?.Name}</td>
                        <td>{data?.HouseNo}</td>
                        <td>{data?.StreetName}</td>
                        <td>{data?.Locality}</td>
                        <td>{data?.City}</td>
                        <td>{data?.Pincode}</td>
                        <td>{data?.PHouseNo}</td>
                        <td>{data?.PStreetName}</td>
                        <td>{data?.PLocality}</td>
                        <td>{data?.PCity}</td>
                        <td>{data?.PPincode}</td>
                        <td>{data?.Mobile}</td>
                        <td>{data?.Email}</td>
                        <td>{data?.isActive === 1 ? "Active" : "DeActive"}</td>
                        <td>
                          <Link
                            to="/CreateEmployeeMaster"
                            state={{
                              button: "Update",
                              url1: "/api/v1/Employee/getEmployeeDetailsByID",
                              url2: "/api/v1/Employee/UpdateEmployee",
                              id: data?.EmployeeID,
                            }}
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeMaster;
