import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Input from "../../ChildComponents/Input";
import {
  getBillingCategory,
  getDepartment,
  getRateCenters,
  getRateItemList,
  isChecked,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import TransferRateType from "../../Frontend/util/TransferRateType";
import axios from "axios";
import Loading from "../../Frontend/util/Loading";
import { toast } from "react-toastify";
import { dateConfig } from "../../Frontend/util/DateConfig";

function RateList() {
  const [Department, setDepartment] = useState([]);
  const [RateCentres, setRateCentres] = useState([]);
  const [Billing, setBilling] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    BillingCategory: 1,
    CentreID: 2,
    DepartmentID: 1,
    TestID: 1,
  });
  const [tabledata, setTabledata] = useState([]);
  const [ItemList, setItemList] = useState([]);
  const [show, setShow] = useState(false);

  const onHandleShow = () => {
    setShow(!show);
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  const handleSubmit = () => {
    setLoad(true);
    axios
      .post("/api/v1/RateList/RateListGet", payload)
      .then((res) => {
        const data = res?.data?.message;
        let val = data.map((ele) => {
          return {
            ...ele,
            isActive: "0",
          };
        });
        setTabledata(val);
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

  const handleCollection = (e, index, data) => {
    const { name, checked } = e.target;
    const datas = [...tabledata];
    datas[index][name] = checked ? "1" : "0";
    setTabledata(datas);
  };

  const handleCheckbox = (e) => {
    const { checked } = e.target;
    const data = tabledata?.map((ele) => {
      return {
        ...ele,
        isActive: checked ? "1" : "0",
      };
    });

    setTabledata(data);
  };

  const handleValue = (e, index) => {
    const { name, value } = e.target;
    const datas = [...tabledata];
    datas[index][name] = value;
    setTabledata(datas);
  };

  const handleSave = () => {
    const data = tabledata.filter((ele) => ele.isActive === "1");
    if (data?.length > 0) {
      axios
        .post("/api/v1/RateList/RateListCreate", data)
        .then((res) => {
          toast.success(res.data?.message);
          handleSubmit();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        });
    } else {
      toast.error("please Choose One Value");
    }
  };

  useEffect(() => {
    getDepartment(setDepartment);
    getBillingCategory(setBilling);
    getRateCenters(setRateCentres);
  }, []);

  useEffect(() => {
    if (payload?.BillingCategory !== "" && payload?.DepartmentID !== "") {
      getRateItemList(setItemList, payload);
    }
  }, [payload?.BillingCategory, payload?.DepartmentID]);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <TransferRateType
        show={show}
        onHandleShow={onHandleShow}
        Centres={RateCentres}
        Department={Department}
      />
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Rate Type</a>
          </li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Search Criteria
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Department List:
                </label>

                <SelectBox
                  options={Department}
                  name="DepartmentID"
                  selectedValue={selectedValueCheck(
                    Department,
                    payload?.DepartmentID
                  )}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Billing Category:
                </label>

                <SelectBox
                  options={Billing}
                  name="BillingCategory"
                  selectedValue={selectedValueCheck(
                    Billing,
                    payload?.BillingCategory
                  )}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Centres:
                </label>

                <SelectBox
                  options={RateCentres}
                  name="CentreID"
                  selectedValue={selectedValueCheck(
                    RateCentres,
                    payload?.CentreID
                  )}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Item Name:
                </label>

                <SelectBox
                  options={ItemList}
                  name="TestID"
                  selectedValue={selectedValueCheck(ItemList, payload?.TestID)}
                  onChange={handleSelectChange}
                />
              </div>
            </div>
            <div className="d-flex">
              {load || payload?.TestID === "" ? (
                <Loading />
              ) : (
                <button className="btn btn-success" onClick={handleSubmit}>
                  Search
                </button>
              )}
              <button className="btn btn-success mx-5" onClick={onHandleShow}>
                TranferRate Type
              </button>
            </div>
            {tabledata.length > 0 && (
              <>
                <div className="mt-3">
                  <Table responsive bordered hover>
                    <thead>
                      <tr>
                        <th>S.NO</th>
                        <th>Centre Name</th>
                        <th>Test Name</th>
                        <th className="">
                          <div>Rate</div>
                        </th>
                        <th>Centre Display Name</th>
                        <th>Item Code</th>
                        <th>Create On</th>
                        <th>Created By</th>
                        <th>
                          <Input
                            type="checkbox"
                            checked={
                              tabledata.length > 0
                                ? isChecked(
                                    "isActive",
                                    tabledata,
                                    "1"
                                  ).includes(false)
                                  ? false
                                  : true
                                : false
                            }
                            onChange={handleCheckbox}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabledata?.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data?.Centre}</td>
                          <td>{data?.TestName}</td>
                          <td>
                            {data?.isActive === "1" ? (
                              <Input
                                value={Number(data?.Rate).toFixed(0)}
                                type="number"
                                name="Rate"
                                onChange={(e) => handleValue(e, index)}
                              />
                            ) : (
                              Number(data?.Rate).toFixed(0)
                            )}
                          </td>
                          <td></td>
                          <td>{data?.TestCode}</td>
                          <td>{dateConfig(data?.dtEntry)}</td>
                          <td>
                            {data?.CreatedByName ? data?.CreatedByName : "-"}
                          </td>
                          <td>
                            <Input
                              type="checkbox"
                              name="isActive"
                              checked={data?.isActive === "1" ? true : false}
                              onChange={(e) => handleCollection(e, index, data)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="mt-3">
                  <button className="btn btn-success" onClick={handleSave}>
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RateList;
