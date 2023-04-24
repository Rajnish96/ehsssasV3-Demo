import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { SelectAccredition } from "../../ChildComponents/Constants";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

const ManageNablMaster = () => {
  const [CentreData, setCentreData] = useState([]);
  const [load, setLoad] = useState({
    saveLoad: false,
    searchLoad: false,
  });
  const [DepartmentData, setDepartmentData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [payload, setPayload] = useState({
    CentreID: "1",
    DepartmentID: "1",
  });

  const handleChangeDropDown = (e, index) => {
    const { name, value } = e.target;
    const data = [...tableData];
    const dropLabel = SelectAccredition.find((ele) => ele?.value === value);
    if (index >= 0) {
      data[index][name] = value;
      data[index]["AccreditionName"] = dropLabel?.label;
      setTableData(data);
    } else {
      const val = data.map((ele) => {
        return {
          ...ele,
          [name]: value,
          AccreditionName: dropLabel?.label,
        };
      });
      setTableData(val);
    }
  };

  console.log(tableData);
  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartmentData")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  const handleSelect = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  const bindDropDown = () => {
    setLoad({ ...load, searchLoad: true });
    axios
      .post("/api/v1/ManageIsNablController/BindManageIsNablData", payload)
      .then((res) => {
        setTableData(res?.data?.message);
        setLoad({ ...load, searchLoad: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "error occured"
        );
        setLoad({ ...load, searchLoad: false });
      });
  };

  const handleSave = () => {
    setLoad({ ...load, saveLoad: true });
    axios
      .post("/api/v1/ManageIsNablController/SaveManageIsNabl", tableData)
      .then((res) => {
        toast.success(res?.data?.message);
        setLoad({ ...load, saveLoad: false });
        bindDropDown();
      })
      .catch((err) => {
        console.log(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad({ ...load, saveLoad: false });
      });
  };

  useEffect(() => {
    bindDropDown();
  }, []);

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
                Manage Nabl
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="Centre">
                  CentreID
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
                  DepartmentID
                </label>
                <SelectBox
                  name="DepartmentID"
                  options={DepartmentData}
                  selectedValue={selectedValueCheck(
                    DepartmentData,
                    payload?.DepartmentID
                  )}
                  onChange={handleSelect}
                />
              </div>

              <div className="col-sm-1 col-md-1 pull-right reprint-date mt-4">
                <button
                  type="submit"
                  className="btn btn-info"
                  onClick={bindDropDown}
                >
                  Search
                </button>
              </div>
            </div>
            {!load?.searchLoad ? (
              <div className="card-body">
                <div className="px-2">
                  <Table bordered responsive hover>
                    <thead>
                      <tr>
                        <th>S No.</th>
                        <th>Department</th>
                        <th>Investigation</th>
                        <th>Rate</th>
                        <th>
                          <select
                            className="form-control"
                            onChange={handleChangeDropDown}
                            name="AccreditionId"
                          >
                            {SelectAccredition.map((data, index) => (
                              <option value={data?.value} key={index}>
                                {data?.label}
                              </option>
                            ))}
                          </select>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data?.Department}</td>
                          <td>{data?.TestName}</td>
                          <td>{data?.Rate}</td>
                          <td>
                            <select
                              className="form-control"
                              value={data?.AccreditionId}
                              name="AccreditionId"
                              onChange={(e) => handleChangeDropDown(e, index)}
                            >
                              {SelectAccredition.map((data, index) => (
                                <option value={data?.value} key={index}>
                                  {data?.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="row">
                  {load?.saveLoad ? (
                    <Loading />
                  ) : (
                    <button
                      type="button"
                      className="margin btn btn-success float-left"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageNablMaster;
