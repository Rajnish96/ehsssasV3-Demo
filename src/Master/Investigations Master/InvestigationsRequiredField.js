import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../Frontend/util/Loading";

const InvestigationsRequiredField = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  const ID = {
    InvestigationID: state?.data ? state?.data : "",
  };

  const getInvestigationsList = () => {
    axios
      .post("/api/v1/Investigations/RequiredFields", {
        InvestigationID: ID.InvestigationID,
      })
      .then((res) => {
        if (res.status === 200) {
          setLoad(false);
          setData(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const post = () => {
    const requiredData = data.filter((ele) => ele.showonbooking === 1);
    setLoad(true);

    axios
      .post("/api/v1/Investigations/SaveInvestigationRequired", {
        InvestigationRequiredData: requiredData,
      })
      .then((res) => {
        if (res.data.message) {
          setLoad(false);
          toast.success(res.data.message);
          navigate(-1);
        }else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoad(false);
      });
  };

  const handleChangeMain = (e, i, names) => {
    const { value, name, checked, type } = e.target;
    const datas = [...data];
    if (names) {
      datas[i][names] = value;
      setData(datas);
    } else {
      datas[i][name] = type === "checkbox" ? (checked ? 1 : 0) : value;
      setData(datas);
    }
  };

  useEffect(() => {
    getInvestigationsList();
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Required Fields</a>
          </li>
          <li className="breadcrumb-item active">
            {/* {state?.other?.pageName ? state?.other?.pageName : "Create"} */}
            Fields
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            {/* {state?.other?.pageName ? state?.other?.pageName : "Create"} */}
            <span className="m-0 font-weight-bold text-primary">
              Search Criteria
            </span>
          </div>
          <div className="card-body">
            <div className="px-2 boottable">
              <Table bordered responsive hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Investigation ID</th>
                    <th>Field ID</th>
                    <th>Field Name</th>
                    <th>Show On Booking</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((data, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{data?.InvestigationID}</td>
                      <td>{data?.FieldID}</td> 
                      <td>{data?.FieldName}</td>
                      <td>
                        <Input
                          type="checkbox"
                          name="showonbooking"
                          checked={data?.showonbooking}
                          onChange={(e) => handleChangeMain(e, i)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {load ? (
              <Loading />
            ) : ( 
              <button className="margin btn btn-success " onClick={post}>
                Save
              </button>
            )}
            <button
              className="margin btn btn-primary"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationsRequiredField;
