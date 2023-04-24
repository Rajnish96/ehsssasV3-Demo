import axios from "axios";
import { useFormik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { getTrimmedData } from "../../Frontend/util/Commonservices";
import { number } from "../../Frontend/util/Commonservices/number";
import Loading from "../../Frontend/util/Loading";
import { OutSourceLabMasterValidationSchema } from "../../ValidationSchema";

export const OutSourceLabMaster = () => {
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    OutSourceLabID: "",
    LabName: "",
    Address: "",
    ContactPersonName: "",
    PhoneNo: "",
    MobileNo: "",
    EmailID: "",
    isActive: "1",
  });

  const getOutSourceLabData = () => {
    axios
      .get("/api/v1/OutSourceLabMaster/getAllOutSourceLabData", formData)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const editOutSourceLabMaster = (id) => {
    axios
      .post("/api/v1/OutSourceLabMaster/getAllOutSourceLabDataById", {
        OutSourceLabID: id,
      })
      .then((res) => {
        const data = res.data.message[0];
        setFormData(data);
      })
      .catch((err) => console.log(err));
  };

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: formData,
    enableReinitialize: true,
    validationSchema: OutSourceLabMasterValidationSchema,
    onSubmit: (values) => {
      setLoad(true);
      if (update === true) {
        axios
          .post(
            "/api/v1/OutSourceLabMaster/UpdateOutSourceLabData",
            getTrimmedData({
              ...values,
            })
          )
          .then((res) => {
            if (res.data.message) {
              setLoad(false);
              toast.success(res.data.message);
              getOutSourceLabData();
            } else {
              toast.error("Something went wrong");
              setLoad(false);
            }
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
            setLoad(false);
          });
      } else {
        setLoad(true);
        axios
          .post(
            "/api/v1/OutSourceLabMaster/InsertOutSourceLabData",
            getTrimmedData({
              ...values,
            })
          )
          .then((res) => {
            if (res.data.message) {
              setLoad(false);
              toast.success(res.data.message);
              getOutSourceLabData();
            } else {
              toast.error("Something went wrong");
            }
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setLoad(false);
          });
      }
    },
  });

  console.log(errors);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  useEffect(() => {
    getOutSourceLabData();
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <div className="card shadow mb-4  mt-5">
          <div className="card-header py-3">OutSource Lab Master</div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form-group">
                <label className="control-label">Lab Name</label>
                :
                <Input
                  className="form-control pull-right reprint-date required"
                  type="text"
                  name="LabName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formData?.LabName}
                />
                {errors?.LabName && touched?.LabName && (
                  <div className="golbal-Error">{errors?.LabName}</div>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label">Contact Person Name</label>
                :
                <Input
                  className="form-control pull-right reprint-date required"
                  type="text"
                  name="ContactPersonName"
                  onChange={handleChange}
                  value={formData?.ContactPersonName}
                />
                {errors?.ContactPersonName && touched?.ContactPersonName && (
                  <div className="golbal-Error">{errors?.ContactPersonName}</div>
                )}
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label">Address</label>
                :
                <Input
                  className="form-control pull-right reprint-date "
                  name="Address"
                  onChange={handleChange}
                  type="text"
                  value={formData?.Address}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label">Phone No</label>
                :
                <Input
                  className="form-control pull-right reprint-date "
                  name="PhoneNo"
                  onChange={handleChange}
                  type="number"
                  value={formData?.PhoneNo}
                  onInput={(e) => number(e, 15)}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label">Mobile No</label>
                :
                <Input
                  className="form-control pull-right reprint-date required"
                  name="MobileNo"
                  onChange={handleChange}
                  value={formData?.MobileNo}
                  type="number"
                  onBlur={handleBlur}
                  onInput={(e) => number(e, 10)}
                />
                {errors?.MobileNo && touched?.MobileNo && (
                  <div className="golbal-Error">{errors?.MobileNo}</div>
                )}
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label">Email ID</label>
                :
                <Input
                  className="form-control pull-right reprint-date"
                  name="EmailID"
                  onChange={handleChange}
                  value={formData?.EmailID}
                  type="email"
                  required
                />
              </div>
            </div>
            <div className="row mt-4 mb-4">
              <div className="col-sm-1 col-md-1">
                <Input
                  name="isActive"
                  type="checkbox"
                  checked={formData?.isActive}
                  onChange={handleChange}
                />
                <label htmlFor="isActive">Active</label>
              </div>
              <div className="col-sm-1 col-md-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success"
                    onClick={handleSubmit}
                  >
                    {update ? "Update" : "Create"}
                  </button>
                )}
              </div>
            </div>
            {loading ? (
              <Loading />
            ) : (
              <div className="row px-2 boottable">
                {data.length > 0 ? (
                  <Table bordered responsive hover>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Lab Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Mobile</th>
                        <th>Contact Person</th>
                        <th>Active</th>
                        <th>Created By</th>
                        <th>Created On</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((data, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{data?.LabName}</td>
                          <td>{data?.Address}</td>
                          <td>{data?.PhoneNo}</td>
                          <td>{data?.MobileNo}</td>
                          <td>{data?.ContactPersonName}</td>
                          <td>{data?.isActiveStatus}</td>
                          <td>{data?.CreatedByName}</td>
                          <td>
                            {data?.dtEntry !== "0000-00-00 00:00:00"
                              ? moment(data?.FinancialYearStart).format(
                                  "DD MMM YYYY"
                                )
                              : "-"}
                          </td>

                          <td>
                            <button
                              onClick={() => {
                                editOutSourceLabMaster(data?.OutSourceLabID);
                                setUpdate(true);
                              }}
                            >
                              Edit
                            </button>
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
