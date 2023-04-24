import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../Frontend/util/Loading";
import { useState, useEffect } from "react";
import axios from "axios";

const SampleType = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const getSampleType = () => {
    axios
      .get("/api/v1/SampleType/getSampleType")
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
    getSampleType();
  }, []);
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Sample Type Master</a>
          </li>
          <li className="breadcrumb-item active">Index</li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">
              Sample Type List
            </span>
            <Link
              className="float-right"
              to="/SampleTypeCreate"
              state={{
                url: "/api/v1/SampleType/SaveSampleType",
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
                        <th>SampleName</th>
                        <th>Container</th>
                        <th>ColorName</th>
                        <th>Active</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((data, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{data?.SampleName}</td>
                          <td>{data?.Container}</td>
                          <td>{data?.ColorName}</td>
                          <td>{data?.isActive === 1 ? "Active" : "Expired"}</td>
                          <td>
                            <Link
                              state={{
                                data: data,
                                other: { button: "Update" },
                                url: "/api/v1/SampleType/UpdateSampleType",
                              }}
                              to="/SampleTypeCreate"
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

export default SampleType;
