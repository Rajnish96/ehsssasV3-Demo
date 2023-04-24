import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { selectedValueCheck } from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

const CentreMasterList = () => {
  const { name } = useParams();
  const [loading, setLoading] = useState(false);
  const [CentreType, setCentreType] = useState([]);
  const [payload, setPayload] = useState({
    CentreType: "",
    CentreName: "",
    CentreCode: "",
    DataType: name === "Rate" ? "RateType" : "Centre",
  });
  const [data, setData] = useState([]);

  const handleSelect = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  const getCentreData = () => {
    setLoading(true);
    axios
      .post("/api/v1/Centre/getCentreData", payload)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const getDropDownData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        value.unshift({ label: "All", value: "" });
        switch (name) {
          case "CentreType":
            setCentreType(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  console.log(CentreType[0]?.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  useEffect(() => {
    getDropDownData("CentreType");
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">{name === "center" ? "Centre" : "RateType"}</a>
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
                to={
                  name === "center"
                    ? "/CentreMaster/center"
                    : "/CentreMaster/Rate"
                }
                state={{
                  url: "/api/v1/Centre/InsertCentre",
                }}
              >
                Create New
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              {name === "center" ? (
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="CentreType">
                    Type
                  </label>
                  <SelectBox
                    onChange={handleSelect}
                    options={CentreType}
                    name="CentreType"
                    selectedValue={selectedValueCheck(
                      CentreType,
                      payload?.CentreType
                    )}
                  />
                </div>
              ) : null}
              <div className="col-sm-2 col-md-2">
                <label className="control-label " htmlFor="Centre">
                  Name
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  name="CentreName"
                  type="text"
                  value={payload?.CentreName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="CentreCode">
                  Code
                </label>
                <Input
                  className="form-control pull-right reprint-date"
                  name="CentreCode"
                  type="text"
                  value={payload?.CentreCode}
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-1 col-md-1 pull-right reprint-date mt-4">
                <button
                  type="submit"
                  className="btn btn-info "
                  onClick={getCentreData}
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
                          <th>Centre Type</th>
                          <th>Name</th>
                          <th>Code</th>
                          <th>Invoice To</th>
                          <th>Business Unit</th>
                          <th>Processing Lab</th>
                          <th>Reference Rate</th>
                          <th>Barcode Logic</th>
                          <th>Invoicing</th>
                          <th>Status</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((data, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{data?.CentreType}</td>
                            <td>{data?.Centre}</td>
                            <td>{data?.CentreCode}</td>
                            <td>{data?.InvoiceToStatus}</td>
                            <td>{data?.BusinessUnitStatus}</td>
                            <td>{data?.ProcessingLabStatus}</td>
                            <td>{data?.ReferenceRateStatus}</td>
                            <td>{data?.BarcodeDisplay}</td>
                            <td>{}</td>
                            <td>
                              {data?.isActive === 1 ? "Active" : "Expired"}
                            </td>
                            <td>
                              <Link
                                state={{
                                  data: data,
                                  other: { button: "Update", pageName: "Edit" },
                                  url: "/api/v1/Centre/UpdateCentre",
                                }}
                                to={
                                  name === "center"
                                    ? "/CentreMaster/center"
                                    : "/CentreMaster/Rate"
                                }
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

export default CentreMasterList;
