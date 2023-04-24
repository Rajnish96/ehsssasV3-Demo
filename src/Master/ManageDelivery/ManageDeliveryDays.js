import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  getDepartment,
  isChecked,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

function ManageDeliveryDays() {
  const [CentreID, setCentreID] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [load, setLoad] = useState({
    searchLoad: false,
    saveLoad: false,
  });
  const [tableData, setTableData] = useState([]);

  const [state, setState] = useState({
    searchText: "",
    centreId: "",
    departmentId: "",
  });

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setState({ ...state, [name]: event.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleChangeMain = (e, index, names) => {
    debugger;
    const { value, name, checked, type } = e.target;
    const data = [...tableData];
    if (names) {
      data[index][names] = value;
      setTableData(data);
    } else {
      data[index][name] = type === "checkbox" ? checked : value;
      setTableData(data);
    }
  };

  const handleWeekDays = (name, value, index) => {
    const data = [...tableData];
    data[index][name] = value === "0" ? "1" : "0";
    setTableData(data);
  };

  const fetch = () => {
    setLoad({ ...load, searchLoad: true });
    axios
      .post("/api/v1/ManageDeliveryDays/getDeliveryDays", {
        ...state,
        searchText: state?.searchText.trim(),
      })
      .then((res) => {
        setLoad({ ...load, searchLoad: false });
        const data = res.data.message;
        const val = data.map((ele) => {
          if (ele.TATType === "") {
            return {
              ...ele,
              TATType: "HOURS",
              isChecked: false,
              centreId: "",
              allCentres: "",
            };
          } else {
            return {
              ...ele,
              isChecked: false,
              centreId: "",
              allCentres: "",
            };
          }
        });
        setTableData(val);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoad({ ...load, searchLoad: false });
      });
  };

  const handleChangeTable = (e) => {
    const { name, value, checked } = e.target;
    const data = tableData.map((ele) => {
      return {
        ...ele,
        [name]: value ? value : checked,
      };
    });
    setTableData(data);
  };

  const validations = (data) => {
    console.log(data);
    debugger;
    let err = "";
    for (var i = 0; i < data.length; i++) {
      if (data[i].TATType === "HOURS") {
        if (data[i].MorningHours === "") {
          err = "Please Enter Morning Hours !";
          break;
        }
      }
    }
    return err;
  };

  console.log(tableData);

  const handleSubmit = () => {
    const find = tableData.filter((ele) => ele?.isChecked === true);
    const data = find.map((ele) => {
      if (!ele?.allCentres) {
        return { ...ele, centreId: state?.centreId };
      } else {
        return {
          ...ele,
          centreId: "0",
          allCentres: "1",
        };
      }
    });

    if (data?.length > 0) {
      const generatedError = validations(data);
      if (generatedError === "") {
        setLoad({ ...load, saveLoad: true });
        axios
          .post("/api/v1/ManageDeliveryDays/SaveManageDeliveryDays", {
            deliveryCollectionList: data,
          })
          .then((res) => {
            toast.success(res.data.message);
            setLoad({ ...load, saveLoad: false });
            setTableData([]);
            setState({
              searchText: "",
              centreId: "",
              departmentId: "",
            });
          })
          .catch((err) => {
            setLoad({ ...load, saveLoad: false });
            console.log(err);
          });
      } else {
        toast.error(generatedError);
      }
    } else {
      toast.error("Please Select One Value");
    }
  };

  useEffect(() => {
    if (state?.searchText !== "") {
      fetch();
    }
  }, [state?.searchText]);

  useEffect(() => {
    getAccessCentres(setCentreID);
    getDepartment(setDepartment);
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Manage Delivery Days</a>
          </li>
          <li className="breadcrumb-item active"></li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Manage Delivery Days
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Search Criteria Centre :
                </label>
                <SelectBox
                  options={CentreID}
                  name="centreId"
                  selectedValue={selectedValueCheck(CentreID, state?.centreId)}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  DepartmentList :
                </label>
                <SelectBox
                  options={Department}
                  name="departmentId"
                  onChange={handleSelectChange}
                  selectedValue={selectedValueCheck(
                    Department,
                    state?.departmentId
                  )}
                />
              </div>

              <div className="col-sm-6 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Test Name or Test Code :
                </label>
                <Input
                  type="text"
                  className="form-control  pull-right reprint-date"
                  name="searchText"
                  value={state?.searchText}
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-2 form-group" style={{ alignSelf: "end" }}>
                {load.searchLoad ? (
                  <Loading />
                ) : (
                  <button className="btn btn-primary" onClick={fetch}>
                    Search
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="row p-3">
              <Table responsive bordered hover striped>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Department</th>
                    <th>Item Name</th>
                    <th style={{ width: "10%" }}>TAT Type</th>
                    <th style={{ width: "6%" }}>
                      Processing Days
                      <Input
                        className="form-control"
                        onChange={handleChangeTable}
                        name="processDays"
                        type="number"
                      />
                    </th>
                    <th style={{ width: "6%" }}>
                      MH{" "}
                      <Input
                        className="form-control"
                        onChange={handleChangeTable}
                        name="MorningHours"
                        type="number"
                      />
                    </th>
                    <th style={{ width: "6%" }}>
                      EH{" "}
                      <Input
                        className="form-control"
                        onChange={handleChangeTable}
                        name="EveningHours"
                        type="number"
                      />
                    </th>
                    <th style={{ width: "25%" }}>
                      Weekdays<br></br> S M T W T F S{" "}
                    </th>
                    <th>
                      Cut-Off Time (Mon-Sat)
                      <Input
                        className="form-control"
                        type="time"
                        onChange={handleChangeTable}
                        name="cutOffTime1"
                      />
                    </th>
                    <th>
                      Cut-Off Time (Sun){" "}
                      <Input
                        className="form-control"
                        type="time"
                        onChange={handleChangeTable}
                        name="cutOffTime2"
                      />
                    </th>
                    <th>
                      <Input
                        type="checkbox"
                        onChange={handleChangeTable}
                        checked={
                          tableData?.length > 0
                            ? isChecked("isChecked", tableData, true).includes(
                                false
                              )
                              ? false
                              : true
                            : false
                        }
                        name="isChecked"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data?.department}</td>
                      <td>{data?.itemName}</td>
                      <td>
                        <input
                          type="radio"
                          value="DAYS"
                          checked={data?.TATType === "DAYS" ? true : false}
                          onChange={(e) =>
                            handleChangeMain(e, index, "TATType")
                          }
                        />
                        <label>Days</label>
                        <input
                          type="radio"
                          value="HOURS"
                          checked={data?.TATType === "HOURS" ? true : false}
                          onChange={(e) =>
                            handleChangeMain(e, index, "TATType")
                          }
                        />
                        <label>Hours</label>
                      </td>
                      <td>
                        <Input
                          value={data?.processDays}
                          type="number"
                          className="form-control"
                          disabled={data?.TATType !== "DAYS" ? true : false}
                          name="processDays"
                          onChange={(e) => handleChangeMain(e, index)}
                        />
                      </td>
                      <td>
                        <Input
                          value={data?.MorningHours}
                          className="form-control"
                          type="number"
                          disabled={data?.TATType !== "DAYS" ? false : true}
                          name="MorningHours"
                          onChange={(e) => handleChangeMain(e, index)}
                        />
                      </td>
                      <td>
                        <Input
                          value={data?.EveningHours}
                          className="form-control"
                          disabled={data?.TATType !== "DAYS" ? false : true}
                          name="EveningHours"
                          type="number"
                          onChange={(e) => handleChangeMain(e, index)}
                        />
                      </td>
                      <td>
                        <div
                          className="weekDays-selector"
                          data-title="Week Days"
                        >
                          <Input
                            type="checkbox"
                            name="Mon"
                            className="weekday weekday-mon weekdayLabel"
                          />
                          <label
                            className={data?.Mon === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Mon", data?.Mon, index)
                            }
                          >
                            Mon
                          </label>
                          <Input
                            type="checkbox"
                            className="weekday weekday-tue weekdayLabel"
                          />
                          <label
                            className={data?.Tue === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Tue", data?.Tue, index)
                            }
                          >
                            Tue
                          </label>
                          <Input
                            type="checkbox"
                            className="weekday weekday-wed weekdayLabel"
                          />
                          <label
                            className={data?.Wed === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Wed", data?.Wed, index)
                            }
                          >
                            Wed
                          </label>
                          <Input
                            type="checkbox"
                            className="weekday weekday-thu weekdayLabel"
                          />
                          <label
                            className={data?.Thu === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Thu", data?.Thu, index)
                            }
                          >
                            Thu
                          </label>
                          <Input
                            type="checkbox"
                            className="weekday weekday-fri weekdayLabel"
                          />
                          <label
                            className={data?.Fri === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Fri", data?.Fri, index)
                            }
                          >
                            Fri
                          </label>
                          <Input
                            type="checkbox"
                            className="weekday weekday-sat weekdayLabel"
                          />
                          <label
                            className={data?.Sat === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Sat", data?.Sat, index)
                            }
                          >
                            Sat
                          </label>
                          <Input
                            type="checkbox"
                            id="weekday-sun"
                            checked="checked"
                            className="weekday weekday-sun weekdayLabel"
                          />
                          <label
                            className={data?.Sun === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Sun", data?.Sun, index)
                            }
                          >
                            Sun
                          </label>
                        </div>
                      </td>
                      <td>
                        <Input
                          type="time"
                          value={data?.cutOffTime1}
                          name="cutOffTime1"
                          onChange={(e) => handleChangeMain(e, index)}
                        />
                      </td>
                      <td>
                        <Input
                          type="time"
                          value={data?.cutOffTime2}
                          name="cutOffTime2"
                          onChange={(e) => handleChangeMain(e, index)}
                        />
                      </td>
                      <td>
                        <Input
                          type="checkbox"
                          checked={data?.isChecked}
                          name="isChecked"
                          onChange={(e) => handleChangeMain(e, index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="mt-3 d-flex align-items-center  justify-content-center">
              {load?.saveLoad ? (
                <Loading />
              ) : (
                <button className="btn btn-primary mx-2" onClick={handleSubmit}>
                  Save
                </button>
              )}
              <div className="mx-2">
                <Input
                  type="checkbox"
                  name="allCentres"
                  checked={
                    tableData?.length > 0
                      ? isChecked("allCentres", tableData, true).includes(false)
                        ? false
                        : true
                      : false
                  }
                  onChange={handleChangeTable}
                />
                <label>Save for all centre </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageDeliveryDays;
