import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../Frontend/util/Loading";
import { useState, useEffect } from "react";
import axios from "axios";
import { dateConfig } from "../../Frontend/util/DateConfig";

const Designations = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const getDesignationData = () => {
    axios
      .get("/api/v1/Designation/getDesignationData")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  // console.log(data);
  useEffect(() => {
    getDesignationData();
  }, []);
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Designations</a>
          </li>
          <li className="breadcrumb-item active">Index</li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">
              Search Criteria
            </span>
            <Link
              className="float-right"
              to="/DesignationsCreate"
              state={{
                url: "/api/v1/Designation/InsertDesignationData",
              }}
            >
              Create New
            </Link>
          </div>
          <div className="card-body">
            {loading ? (
              <Loading />
            ) : (
              <div className="row px-2 boottable">
                {data.length > 0 ? (
                  <Table bordered responsive hover>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th> Designation Name</th>
                        <th> View Rights</th>
                        <th>Sequence No</th>
                        <th>Date Of Creation</th>
                        <th>Date Of Updation</th>
                        <th>New Test Approve</th>
                        <th>ShowSpecialRate</th>
                        <th>Active Status</th>
                        <th>Direct Approve</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((data, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{data?.DesignationName}</td>
                          <td data-title="View">
                            <span
                              title="View Data"
                              className="fa fa-search coloricon"
                            ></span>
                          </td>
                          <td>{data?.SequenceNo}</td>
                          <td>{dateConfig(data?.dtEntry)}</td>
                          <td>
                            {data?.dtUpdate !== "0000-00-00 00:00:00"
                              ? dateConfig(data?.dtUpdate)
                              : "-"}
                          </td>
                          <td>{data?.NewTestApproves}</td>
                          <td>{data?.ShowSpecialRate}</td>
                          <td>{data?.ActiveStatus}</td>
                          <td>{data?.DirectApprove}</td>
                          <td>
                            <Link
                              state={{
                                data: data,
                                other: { button: "Update" },
                                url: "/api/v1/Designation/UpdateDesignationData",
                              }}
                              to="/DesignationsCreate"
                            >
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  " No Data Found"
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Designations;
