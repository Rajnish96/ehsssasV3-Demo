import React from "react";
import { Table } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Loading from "../../Frontend/util/Loading";
import { Link } from "react-router-dom";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { DataType } from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { toast } from "react-toastify";
import { selectedValueCheck } from "../../Frontend/util/Commonservices";

const InvestigationsList = () => {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    DataType: "",
    TestName: "",
    TestCode: "",
  });
  const [data, setData] = useState([]);

  const handleSelect = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleActiveSingle = (e, i, arr) => {
    checkboxEdit(arr?.InvestigationID, arr.isActive === 1 ? 0 : 1);
  };

  const getInvestigationsList = () => {
    setLoading(true);
    axios
      .post("/api/v1/Investigations/GetInvestigations", payload)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };
  // console.log(payload?.DataType);

  const checkboxEdit = (InvestigationId, isActive) => {
    axios
      .post("/api/v1/Investigations/UpdateActiveInActive", {
        InvestigationId: InvestigationId,
        isActive: isActive,
      })
      .then((res) => {
        if (res.data.message) {
          toast.success("Updated Successfully");
          getInvestigationsList();
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        getInvestigationsList();
      });
  };

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Investigations</a>
          </li>
          <li className="breadcrumb-item active">Index</li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Search Criteria
              </h6>

              <Link
                className="float-right"
                to="/Investigations"
                state={{
                  url: "/api/v1/Investigations/CreateInvestigation",
                }}
              >
                Create New
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  DataType
                </label>
                <SelectBox
                  name="DataType"
                  options={DataType}
                  selectedValue={selectedValueCheck(
                    DataType,
                    payload?.DataType
                  )}
                  onChange={handleSelect}
                />
              </div>
              <div className="col-sm-2 col-md-2">
                <label className="control-label " htmlFor="TestName">
                  TestName
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  name="TestName"
                  type="text"
                  value={payload?.TestName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="TestCode">
                  TestCode
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  name="TestCode"
                  type="text"
                  value={payload?.TestCode}
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-1 col-md-1 pull-right reprint-date mt-4">
                <button
                  type="submit"
                  className="btn btn-info "
                  onClick={getInvestigationsList}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <Loading />
              ) : (
                <div className="px-2 boottable">
                  {data.length > 0 && (
                    <Table bordered responsive hover>
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Data Type</th>
                          <th>Test Name</th>
                          <th>Test Code</th>
                          <th>Active / InActive</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((data, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data?.DataType}</td>
                            <td>{data?.TestName}</td>
                            <td>{data?.TestCode}</td>
                            <td>
                              <Input
                                type="checkbox"
                                name="isActive"
                                checked={data?.isActive}
                                onChange={(e) => handleActiveSingle(e, i, data)}
                              />
                            </td>
                            <td>
                              <Link
                                to="/Investigations"
                                state={{
                                  other: {
                                    button: "Update",
                                    pageName: "Edit",
                                    showButton: true,
                                  },
                                  url1: `/api/v1/Investigations/EditInvestigation?id=${data?.InvestigationID}&DataType=${data?.DataType}`,
                                  url: "/api/v1/Investigations/UpdateInvestigation",
                                }}
                              >
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationsList;
