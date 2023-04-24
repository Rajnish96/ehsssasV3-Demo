import React from "react";
import { Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../Frontend/util/Loading";
import { Link } from "react-router-dom";
import AgeWiseModal from "../../Frontend/util/AgeWiseModal";
import { toast } from "react-toastify";
import { dateConfig } from "../../Frontend/util/DateConfig";

const AgeWiseDiscountList = () => {
  const [show, setShow] = useState(false);
  const [DiscountId, setDiscountId] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAgeWiseDiscountList = () => {
    axios
      .get("/api/v1/AgeWiseDiscount/AllAgeWiseDiscountData")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAgeWiseDiscountList();
  }, []);

  const disableData = (Id) => {
    if (window.confirm("Are You Sure?")) {
      axios
        .post("/api/v1/AgeWiseDiscount/DeActiveAgeWiseDiscountData", {
          ID: Id,
        })
        .then((res) => {
          if (res?.data?.message === "This record De-Activate Successfully") {
            toast.success(res?.data?.message);
            getAgeWiseDiscountList();
          }
          // if(res.data?.message==="")
          // getAgeWiseDiscountList();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      {DiscountId && show && (
        <AgeWiseModal show={show} handleClose={handleClose} id={DiscountId} />
      )}
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Age Wise Discount</a>
          </li>
          <li className="breadcrumb-item active">List</li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">
              Age Wise Discount List
            </span>
            <Link
              className="float-right"
              to="/AgeWiseDiscount"
              state={{
                url: "/api/v1/AgeWiseDiscount/InsertAgeWiseDiscountData",
              }}
            >
              Create New
            </Link>
          </div>
          <div className="card-body">
            {loading ? (
              <Loading />
            ) : (
              <div className="row px-2 ">
                {data.length > 0 ? (
                  <Table bordered responsive hover>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Discount Type</th>
                        <th> Created By</th>
                        <th>Created On</th>
                        <th>Discount %</th>
                        <th>Valid From</th>
                        <th>Valid To</th>
                        <th>From Age</th>
                        <th>To Age</th>
                        <th>Gender</th>
                        <th>Discount Share Type </th>
                        <th>Applicable For All </th>
                        <th>Coupon Required </th>
                        <th>Status</th>
                        <th>Action</th>
                        <th>View</th>
                        <th onClick={handleShow}>Add</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((data, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{data?.DiscountType}</td>
                          <td>{data?.CreatedByName}</td>
                          <td>{dateConfig(data?.CreatedOn)}</td>
                          <td>{data?.DiscountPer}</td>
                          <td>{dateConfig(data?.FromValidityDate)}</td>
                          <td>{dateConfig(data?.ToValidityDate)}</td>
                          <td>{data?.FromAge}</td>
                          <td>{data?.ToAge}</td>
                          <td>{data?.Gender}</td>
                          <td>{data?.DiscountShareType}</td>
                          <td>{data?.ApplicableForAll}</td>
                          <td>{data?.IsCouponRequired}</td>
                          <td>{data?.isActiveStatus}</td>
                          <td>
                            <Link
                              to="/AgeWiseDiscount"
                              state={{
                                data: data,
                                other: { button: "Update", pageName: "Edit" },
                                url: "/api/v1/AgeWiseDiscount/UpdateAgeWiseDiscountData",
                              }}
                            >
                              Edit
                            </Link>
                          </td>
                          <td data-title="View">
                            <span
                              title="View Data"
                              className="fa fa-search coloricon"
                            ></span>
                          </td>
                          <td data-title="Add">
                            <Link
                              id="AddInvestigation"
                              className="form-control btn btn-primary"
                              style={{
                                borderRadius: "20px",
                                color: "white",
                                width: "28px",
                              }}
                              onClick={() => {
                                handleShow();
                                setDiscountId(data?.DiscountId);
                              }}
                            >
                              +
                            </Link>
                          </td>
                          <td>
                            <a
                              id="AddInvestigation"
                              className="form-control btn btn-primary"
                              style={{
                                borderRadius: "20px",
                                color: "white",
                                width: "28px",
                              }}
                              onClick={() => disableData(data.Id)}
                            >
                              X
                            </a>
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

export default AgeWiseDiscountList;
