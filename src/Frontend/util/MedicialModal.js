import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { dateConfig } from "./DateConfig";

function MedicialModal({ show, handleClose, MedicalId }) {
  const [data, setData] = useState({
    PatientGuid: "",
    LedgerTransactionID: 0,
    patientmedicalhistoryiesVM: [
      {
        MedicalHistory: "",
        LedgerTransactionID: 0,
        PatientMedicalHistoryIDs: "",
      },
    ],
  });

  useEffect(() => {
    setData({ ...data, PatientGuid: MedicalId });
  }, [MedicalId]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const val = [...data?.patientmedicalhistoryiesVM];
    val[index][name] = value;
    setData({ ...data, patientmedicalhistoryiesVM: val });
  };

  const handleDelete = (index) => {
    const val = data?.patientmedicalhistoryiesVM.filter(
      (ele, idx) => idx !== index
    );
    setData({ ...data, patientmedicalhistoryiesVM: val });
    toast.success("successfully Deleted");
  };

  const handleUpload = () => {
    debugger
    let match = true;
    for (let i = 0; i < data?.patientmedicalhistoryiesVM.length; i++) {
      if (data?.patientmedicalhistoryiesVM[i].MedicalHistory === "") {
        match = false;
        break;
      }
    }
    if (match) {
      axios
        .post("api/v1/PatientRegistration/UploadMedicalHistory", data)
        .then((res) => {
          toast.success(res?.data?.message);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        });
    } else {
      toast.error("Please Enter value");
    }
  };
  const handleAdd = (dataValue) => {
    if (dataValue !== "") {
      setData({
        ...data,
        patientmedicalhistoryiesVM: [
          ...data?.patientmedicalhistoryiesVM,
          {
            MedicalHistory: "",
            LedgerTransactionID: 0,
            PatientMedicalHistoryIDs: "",
          },
        ],
      });
    } else {
      toast.error("Please Enter Value");
    }
  };

  console.log(data);

  return (
    <Modal show={show}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">Medical History</Modal.Title>
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body" id="DocModalData">
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Entry By</th>
                <th>MedicialHistory</th>
                <th>Action</th>
                <th>inActive</th>
              </tr>
            </thead>
            <tbody>
              {data.patientmedicalhistoryiesVM.map((ele, index) => (
                <tr key={index}>
                  <td>{dateConfig()}</td>
                  <td></td>
                  <td>
                    {index + 1 === data?.patientmedicalhistoryiesVM.length ? (
                      <input
                        className="form-control"
                        value={ele?.MedicalHistory}
                        name="MedicalHistory"
                        type="text"
                        onChange={(e) => {
                          handleChange(e, index);
                        }}
                      />
                    ) : (
                      ele?.MedicalHistory
                    )}
                  </td>
                  <td>
                    {data?.patientmedicalhistoryiesVM.length === index + 1 && (
                      <button
                        className="btn-link"
                        onClick={() => handleAdd(ele?.MedicalHistory)}
                      >
                        Add Row
                      </button>
                    )}
                  </td>
                  <td>
                    {data?.patientmedicalhistoryiesVM?.length >  1 && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(index)}
                      >
                        X
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button className="btn btn-primary" onClick={() => handleUpload()}>
            Save
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default MedicialModal;
