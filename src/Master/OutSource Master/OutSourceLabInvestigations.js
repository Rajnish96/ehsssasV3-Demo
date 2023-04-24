import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { getAccessCentres } from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

const OutSourceLabInvestigations = () => {
  const [load, setLoad] = useState(false);
  const [data, setData] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <div className="card-header">Lab Outsource Investigation</div>

          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="Centre">
                  Centre
                </label>
                <SelectBox
                  name="Centre"
                  options={CentreData}
                  //   selectedValue={selectedValueCheck(
                  //     Centre,
                  //     payload?.Centre
                  //   )}
                  //   onChange={handleSelect}
                />
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="Centre">
                  DepartmentList
                </label>
                <SelectBox
                  name="DepartmentList"
                  options={Department}
                  //   selectedValue={selectedValueCheck(
                  //     DepartmentList,
                  //     payload?.DepartmentList
                  //   )}
                  //   onChange={handleSelect}
                />
              </div>

              <div className="col-sm-1 col-md-1 pull-right reprint-date mt-4">
                <button
                  type="submit"
                  className="btn btn-info "
                  //   onClick={getOutSourceTagging}
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
                          <th>Department</th>
                          <th>Investigation</th>
                          <th>Default Outsource Lab</th>
                          <th>Outsource Lab </th>
                          <th>OutSource Rate </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((data, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td></td>
                            <td></td>
                            <td>
                              <select className="form-control"></select>
                            </td>
                            <td>
                              <select className="form-control">{}</select>
                            </td>
                            <td>
                              <Input type="text" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                  <div className="col-sm-12 text-center">
                    <button className="btn btn-info w-100">Save</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutSourceLabInvestigations;
