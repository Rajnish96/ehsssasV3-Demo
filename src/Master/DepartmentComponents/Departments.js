import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Loading from "../../Frontend/util/Loading";
import { dateConfig } from "../../Frontend/util/DateConfig";

const Departments = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const getTableData = () => {
    axios
      .get("/api/v1/Department/getDepartmentData")
      .then((res) => {
        if (res.status === 200) {
          setTableData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTableData();
  }, []);
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Departments</a>
          </li>
          <li className="breadcrumb-item active">List</li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Departments List
              </h6>
              <Link className="float-right" to="/Create">
                Create New
              </Link>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <Loading />
            ) : (
              <div className="row px-2 boottable">
                {tableData.length > 0 ? (
                  <Table bordered responsive hover>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>DepartmentCode</th>
                        <th>Department</th>
                        <th>Active</th>
                        <th>Entry Date</th>
                        <th>Updated Date</th>
                        <th>printOrder</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((data, index) => (
                        <tr key={index}>
                          <td>{index+1}</td>
                          <td>{data?.DepartmentCode}</td>
                          <td>{data?.Department}</td>

                          <td>{data?.Status}</td>
                          <td>
                            {dateConfig(data?.dtEntry)}
                          </td>
                          <td>
                            {data?.dtUpdate !== "0000-00-00 00:00:00"
                              ? dateConfig(data?.dtUpdate)
                              : "-"}
                          </td>
                          <td>{data?.PrintOrder}</td>

                          <td>
                            <Link to="/Edit" state={{ data: data }}>
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  "No Data Found"
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;
