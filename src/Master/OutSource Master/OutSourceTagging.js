import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

const OutSourceTagging = () => {
  const [load, setLoad] = useState(false);
  const [OutSourcedata, setOutSourcedata] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [button, showButton] = useState(false);
  const [payload, setPayload] = useState({
    CentreID: "1",
    DepartmentID: "1",
  });

  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const getOutSourceTagging = () => {
    setLoad(true);
    axios
      .post("/api/v1/OutSourceLabMaster/getAllOutSourceTaggingData", payload)
      .then((res) => {
        if (res.status === 200) {
          setOutSourcedata(res.data.message);
          setLoad(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const post = () => {
    setLoad(true);
    axios
      .post("/api/v1/OutSourceLabMaster/InsertOutSourceTaggingData", {
        CentreID: payload?.CentreID,
        DepartmentID: payload?.DepartmentID,
        isActive: "1",
        Data: OutSourcedata,
      })
      .then((res) => {
        if (res.data.message) {
          setLoad(false);
          toast.success(res.data.message);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoad(false);
      });
  };

  console.log(payload);

  const handleSelect = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  console.log(OutSourcedata);

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...OutSourcedata];
      data[index][name] = checked ? 1 : 0;
      return setOutSourcedata(data);
    } else {
      const val = OutSourcedata.map((ele) => {
        return {
          ...ele,
          IsOutsource: checked ? 1 : 0,
        };
      });
      return setOutSourcedata(val);
    }
  };

  // const handleChangeMain = (e, i, names) => {
  //   const { value, name, checked, type } = e.target;
  //   const datas = [...data];
  //   if (names) {
  //     datas[i][names] = value;
  //     setData(datas);
  //   } else {
  //     datas[i][name] = type === "checkbox" ? (checked ? 1 : 0) : value;
  //     setData(datas);
  //   }
  // };

  useEffect(() => {
    getDepartment();
    getAccessCentres(setCentreData);
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <div className="card shadow mb-4 mt-5">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Search Criteria
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="Centre">
                  Centre
                </label>
                <SelectBox
                  name="CentreID"
                  options={CentreData}
                  selectedValue={selectedValueCheck(
                    CentreData,
                    payload?.CentreID
                  )}
                  onChange={handleSelect}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="Centre">
                  DepartmentList
                </label>
                <SelectBox
                  name="DepartmentID"
                  options={Department}
                  selectedValue={selectedValueCheck(
                    Department,
                    payload?.DepartmentID
                  )}
                  onChange={handleSelect}
                />
              </div>

              <div className="col-sm-1 col-md-1 pull-right reprint-date mt-4">
                <button
                  type="submit"
                  className="btn btn-info "
                  onClick={() => {
                    getOutSourceTagging();
                    showButton(true);
                  }}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="card-body">
              {load ? (
                <Loading />
              ) : (
                <div className="px-2 boottable">
                  {OutSourcedata.length > 0 && (
                    <Table bordered responsive hover>
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Test Name</th>
                          <th>
                            <Input type="checkbox" onChange={handleCheckbox} />
                            Out Source
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {OutSourcedata.map((ele, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{ele?.TestName}</td>
                            <td>
                              <Input
                                type="checkbox"
                                name="IsOutsource"
                                checked={ele?.IsOutsource}
                                onChange={(e) => handleCheckbox(e, index, ele)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              )}
            </div>
            {button && OutSourcedata ? (
              <div className="col-sm-1 col-md-1">
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={post}
                >
                  Save
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutSourceTagging;
