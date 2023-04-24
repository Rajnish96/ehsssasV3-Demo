import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import TextEditor from "../../Master/Report/TextEditor";

function ResultEditAddModal({ show, handleClose, handleSave }) {
  const [EditData, setEditData] = useState(show?.data);

  console.log(EditData)

  const handleChange = (data) => {
    setEditData({ ...EditData, COMMENT: data });
  };

  return (
    <Modal show={show?.moadal} onHide={handleClose}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title" />
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12">
            <div className="mb-3">
              <label>Select Comment:</label>
              <select className="form-control">
                <option hidden>Select</option>
              </select>
            </div>
            <TextEditor value={EditData?.COMMENT} setValue={handleChange} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-success mx-2"
          onClick={() => handleSave(EditData,"AddComment")}
        >
          Save
        </button>
        <button type="button" className="close" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResultEditAddModal;
