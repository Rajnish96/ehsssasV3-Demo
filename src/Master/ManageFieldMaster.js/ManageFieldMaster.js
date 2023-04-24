import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getVisitType,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

const Field = [
  { FieldType: "OPD/IPD", IsVisible: 0, IsMandatory: 0 },
  { FieldType: "BedNo", IsVisible: 0, IsMandatory: 0 },
  { FieldType: "Source", IsVisible: 0, IsMandatory: 0 },
  { FieldType: "Patient Type", IsVisible: 0, IsMandatory: 0 },
  { FieldType: "Vip&Masking", IsVisible: 0, IsMandatory: 0 },
];

function ManageFieldMaster() {
  const [VisitType, setVisitType] = useState([]);
  const [load, setLoad] = useState(true);
  const [disable, setDisable] = useState({
    update: true,
    loading: false,
  });
  const [tableData, setTableData] = useState([]);
  const [payload, setPayload] = useState({
    visitId: "",
    VisitType: "",
  });

  const fetch = (payloads) => {
    setLoad(true);
    axios
      .post("/api/v1/ManageFieldMaster/getAllManageFieldMasterData", {
        VisitTypeID: payloads,
      })
      .then((res) => {
        setDisable({
          ...disable,
          update: res?.data?.message.length > 0 ? true : false,
        });
        const data = res.data?.message.length > 0 ? res.data?.message : Field;
        let val = data.map((ele) => {
          return {
            FieldType: ele?.FieldType,
            IsVisible: ele?.IsVisible,
            IsMandatory: ele?.IsMandatory,
            VisitType: payload?.VisitType,
            VisitTypeID: payload?.visitId,
          };
        });
        setTableData(val);
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

  const handleChange = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked ? 1 : 0;
    if (!checked) {
      data[index]["IsMandatory"] = 0;
    }
    setTableData(data);
  };

  const handleSelect = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value, VisitType: event?.label });
  };

  console.log(tableData);

  const handleSubmit = (url) => {
    setDisable({ ...disable, loading: true });
    axios
      .post(url, tableData)
      .then((res) => {
        toast.success(res?.data?.message);
        fetch(payload?.visitId);
        setDisable({ ...disable, loading: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setDisable({ ...disable, loading: false });
      });
  };

  useEffect(() => {
    if (VisitType.length > 0) {
      setPayload({
        ...payload,
        visitId: VisitType[0].value,
        VisitType: VisitType[0].label,
      });
    }
  }, [VisitType]);

  useEffect(() => {
    if (payload?.visitId !== "") {
      fetch(payload?.visitId);
    }
  }, [payload?.visitId]);

  useEffect(() => {
    getVisitType(setVisitType);
  }, []);
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Manage Field Master</a>
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix d-flex align-items-center justify-content-center">
              <label className="control-label " htmlFor="DataType">
                Visit Type:
              </label>
              <div className="mx-2 w-50">
                <SelectBox
                  options={VisitType}
                  selectedValue={selectedValueCheck(
                    VisitType,
                    payload?.visitId
                  )}
                  name="visitId"
                  onChange={handleSelect}
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            {load ? (
              <Loading />
            ) : (
              <Table responsive hover bordered>
                <thead>
                  <tr>
                    <th>Field Type</th>
                    <th>IsVisible</th>
                    <th>IsMandatory</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((data, index) => (
                    <tr key={index}>
                      <td>{data?.FieldType}</td>
                      <td>
                        <Input
                          type="checkbox"
                          checked={data?.IsVisible === 1 ? true : false}
                          name="IsVisible"
                          onChange={(e) => handleChange(e, index)}
                        />
                      </td>
                      <td>
                        <Input
                          type="checkbox"
                          checked={data?.IsMandatory}
                          disabled={data?.IsVisible === 1 ? false : true}
                          name="IsMandatory"
                          onChange={(e) => handleChange(e, index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <div className="d-flex align-items-center justify-content-center mt-3">
              {disable?.loading ? (
                <Loading />
              ) : (
                <>
                  <button
                    className="btn btn-success mx-2"
                    onClick={() =>
                      handleSubmit(
                        "/api/v1/ManageFieldMaster/SaveManageFieldMasterData"
                      )
                    }
                    disabled={disable?.update ? true : false}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-success mx-2"
                    onClick={() =>
                      handleSubmit(
                        "/api/v1/ManageFieldMaster/UpdateManageFieldMasterData"
                      )
                    }
                    disabled={disable?.update ? false : true}
                  >
                    Update
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageFieldMaster;
