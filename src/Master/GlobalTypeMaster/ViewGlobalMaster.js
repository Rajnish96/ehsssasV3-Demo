import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { SelectBoxWithCheckbox } from "../../ChildComponents/SelectBox";
import { BindFieldType } from "../../Frontend/util/Commonservices";
import { dateConfig } from "../../Frontend/util/DateConfig";
import Loading from "../../Frontend/util/Loading";

function ViewGlobalMaster() {
  const [FieldType, setFieldType] = useState([]);
  const [type, setType] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [load, setLoad] = useState(false);

  const handleChanges = (select) => {
    const data = select.map((ele) => {
      return {
        Type: ele?.value,
      };
    });
    setType(data);
  };

  

  const handleSearch = () => {
    setLoad(true);
    if(type.length>0){
    axios
      .post("/api/v1/Global/getGlobalDataByFieldType", type)
      .then((res) => {
        setTableData(res?.data?.message);
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad(false);
      });
    }else{
      handleEffect();
    }
  };

  const handleEffect = () => {
    setLoad(true)
    axios
      .post("/api/v1/Global/getGlobalDataAll")
      .then((res) => {
        setTableData(res?.data?.message);
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad(false);
      });
  };

  useEffect(() => {
    BindFieldType(setFieldType);
    handleEffect();
  }, []);
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Global Type Master</a>
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Global Type List
              </h6>
              <Link to="/GlobalTypeMaster" className="float-right">
                Create New
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  FieldType
                </label>
                <SelectBoxWithCheckbox
                  options={FieldType}
                  onChange={handleChanges}
                />
              </div>

              <div
                className="col-sm-2 col-md-2 form-group"
                style={{ alignSelf: "flex-end" }}
              >
                {load ? (
                  <Loading />
                ) : (
                  <button className="btn btn-success" onClick={handleSearch}>
                    Search
                  </button>
                )}
              </div>
            </div>
            <div className="boottable">
              <Table responsive bordered hover striped>
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>FieldType</th>
                    <th>FieldDisplay</th>
                    <th>Entry Date</th>
                    <th>Active</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data?.FieldType}</td>
                      <td>{data?.FieldDisplay}</td>
                      <td>{dateConfig(data?.EntryDate)}</td>
                      <td>{data?.IsActive === 1 ? "Active" : "Expired"}</td>
                      <td>
                        <Link
                          to="/GlobalTypeMaster"
                          state={{
                            data: data,
                            url: "/api/v1/Global/UpdateGlobalData",
                          }}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewGlobalMaster;
