import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { toast } from "react-toastify";

const AgeWiseModal = ({ show, handleClose, DiscountData }) => {
  const [Dropdown, setDropdown] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [InvestigationData, setInvestigationData] = useState([]);

  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartmentData")
      .then((res) => {
        let data = res.data.message;

        let Department = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        Department.unshift({ label: "All", value: "" });
        setDropdown(Department);
      })
      .catch((err) => console.log(err));
  };

  console.log(InvestigationData);

  const getDiscountMasterItemData = () => {
    axios
      .post("/api/v1/AgeWiseDiscount/getDiscountMasterItemData", {
        DiscountId: DiscountData?.DiscountID,
      })
      .then((res) => {
        setTableData(res.data.message);
      })
      .catch((err) => console.log(err));
  };

  const Fetch = (id) => {
    axios
      .post("/api/v1/AgeWiseDiscount/AgeWiseDiscountGetInvestigationData", {
        DepartmentID: id,
      })
      .then((res) => {
        let data = res.data.message;
        const val = data.map((ele) => {
          return {
            ...ele,
            DiscountId: DiscountData?.DiscountID,
            DiscountPer: DiscountData?.DiscountPer,
            isActive: "0",
          };
        });

        console.log(val);
        setInvestigationData(val);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log(err);
      });
  };

  const handleSelectChange = (event) => {
    Fetch(event.value);
  };

  const handleCheckbox = (e, index, data) => {
    const { name, checked } = e.target;
    checkDuplicate(data?.InvestigationID, data?.DiscountId)
      .then((res) => {
        if (res === "Duplicate Investigation") {
          toast.error(res);
        } else {
          if (index >= 0) {
            const data = [...InvestigationData];
            data[index][name] = checked ? "1" : "0";
            return setInvestigationData(data);
          } else {
            const val = InvestigationData.map((ele) => {
              return {
                ...ele,
                isActive: checked ? "1" : "0",
              };
            });
            return setInvestigationData(val);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const disableData = (DiscountID, InvestigationId) => {
    if (window.confirm("Are You Sure?")) {
      axios
        .post("/api/v1/AgeWiseDiscount/RemoveInvestigationDiscountMaster", {
          DiscountID,
          InvestigationId,
        })
        .then((res) => {
          if (res?.data?.message === "Remove successfully") {
            toast.success(res?.data?.message);
            getDiscountMasterItemData();
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          console.log(err);
        });
    }
  };

  const checkDuplicate = (InvestigationId, DiscountId) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/v1/AgeWiseDiscount/DuplicateInvestigationDiscountMaster", {
          InvestigationID: InvestigationId,
          DiscountId: DiscountId,
        })
        .then((res) => {
          if (res.data.message) {
            resolve(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };

  useEffect(() => {
    getDepartment();
  }, []);

  const Api = () => {
    const data = InvestigationData.filter((ele) => ele.isActive === "1");
    const payload = data.map((ele) => {
      return {
        DiscountID: ele.DiscountId,
        InvestigationId: ele.InvestigationID,
        DiscountPer: ele.DiscountPer,
        isActive: ele.isActive,
      };
    });
    axios
      .post("/api/v1/AgeWiseDiscount/AddDiscountMasterItem", payload)
      .then((res) => {
        if (res.data.message) {
          toast.success(res.data.message);
          const val = InvestigationData.map((ele) => {
            return {
              ...ele,
              isActive: 0,
            };
          });
          setInvestigationData(val);
          getDiscountMasterItemData();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);

        if (err?.response?.status === 504) {
          toast.error("Something went wrong");
        }
      });
  };

  useEffect(() => {
    getDiscountMasterItemData();
  }, [DiscountData?.DiscountID]);

  console.log(InvestigationData);

  return (
    <Modal show={show} size="lg">
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">Global Share</Modal.Title>
        <button
          type="button"
          className="close"
          onClick={() => {
            handleClose();
            setInvestigationData([]);
          }}
        >
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body" id="DocModalData">
          <div className="row">
            <div className="col-sm-12">
              <label className="control-label" htmlFor="Department">
                Department
              </label>
              :
              <SelectBox
                options={Dropdown}
                name="DepartmentID"
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-12 mt-5">
              {InvestigationData.length > 0 && (
                <div className="px-2 boottable">
                  <Table responsive hover bordered>
                    <thead>
                      <tr>
                        <th>S.no</th>
                        <th>Investigation Code</th>
                        <th>Investigation Name</th>
                        <th>
                          <Input type="checkbox" onChange={handleCheckbox} />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {InvestigationData?.slice(0, 10).map((ele, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{ele?.TestCode}</td>
                          <td>{ele?.TestName}</td>
                          <td>
                            <Input
                              type="checkbox"
                              name="isActive"
                              checked={ele?.isActive === "1" ? true : false}
                              onChange={(e) => handleCheckbox(e, index, ele)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>

            <div className="text-center">
              {InvestigationData.length > 0 && (
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={Api}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            <div className="col-12 mt-5">
              {InvestigationData.length > 0 && (
                <div className="px-2 boottable">
                  <Table responsive hover bordered>
                    <thead>
                      <tr>
                        <th>S.no</th>
                        <th>Department Name</th>
                        <th>Investigation Code</th>
                        <th>Investigation Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.map((ele, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{ele?.Department}</td>
                          <td>{ele?.TestCode}</td>
                          <td>{ele?.TestName}</td>
                          <td>
                            <button
                              className="btn btn-info"
                              name="disableData"
                              onClick={() =>
                                disableData(
                                  ele?.DiscountID,
                                  ele?.InvestigationId
                                )
                              }
                            >
                              X
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
        <br />
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default AgeWiseModal;
