import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { DoctorSchema } from "../../ValidationSchema";

const initialValues = {
  Name: "",
  Mobile: "",
  DoctorCode: "",
};

const PatientRegisterModal = ({ show, handleClose }) => {
  const { values, errors, handleChange, touched, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: DoctorSchema,
    onSubmit: (values,{resetForm}) => {
      axios
        .post("/api/v1/DoctorReferal/InsertDoctorReferal", values)
        .then((res) => {
          toast.success(res?.data?.message);
          handleClose();
          resetForm({values:""})
        })
        .catch((err) => console.log(err));
    },
  });

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="modal-header">
          <Modal.Title className="modal-title">Refer Doctor</Modal.Title>
          <button type="button" className="close" onClick={handleClose}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body" id="DocModalData">
            <form onSubmit={handleSubmit}>
              <table className="table table-border table-striped table-border control-label">
                <tbody>
                  <tr>
                    <td>
                      <b>Doctor Code</b>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        name="DoctorCode"
                        value={values.DoctorCode}
                        onChange={handleChange}
                      />
                      {errors?.DoctorCode && touched?.DoctorCode && (
                        <span className="golbal-Error">
                          {errors?.DoctorCode}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Doctor Name</b>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="Name"
                        className="form-control"
                        value={values.Name}
                        onChange={handleChange}
                      />
                      {errors?.Name && touched?.Name && (
                        <span className="golbal-Error">{errors?.Name}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Mobile No</b>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        name="Mobile"
                        value={values.Mobile}
                        onChange={handleChange}
                      />
                      {errors?.Mobile && touched?.Mobile && (
                        <span className="golbal-Error">{errors?.Mobile}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <button type="submit" className="btn btn-success">
                        Save
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default PatientRegisterModal;
