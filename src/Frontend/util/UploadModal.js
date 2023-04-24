import React from "react";
import { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { getBase64 } from "./Commonservices";

function UploadModal({ options, show, handleClose, documentId }) {
  const [state, setState] = useState({
    DocumentID: documentId,
    DocumentName: "",
    FileName: "",
    LabNo: "",
  });
  const handleUpload = (e) => {
    let { files } = e.target;
    if (files.length > 0) {
      let ext = files[0]?.name?.split(".");
      let include = ["jpg", "jpeg", "png", "gif"];
      if (include.includes(ext[1])) {
        getBase64(files[0])
          .then((result) => {
            setState({
              ...state,
              DocumentID: documentId,
              DocumentName: ext[0],
              FileName: result,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        toast.error(
          `Only ".jpeg", ".jpg", ".png", ".gif" formats are allowed.`
        );
      }
    }
  };


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">Upload Image</Modal.Title>
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body" id="DocModalData">
          <div>
            <label>Document Type</label>
            <select className="form-control">
              <option hidden>select</option>
              {options.map((ele, index) => (
                <option value={ele.value} key={index}>
                  {ele?.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label>
              Select File...
              <span className="text-warning">
                (jpg,jpeg,png and gif are allowed)
              </span>
            </label>
            <input
              type="file"
              onChange={handleUpload}
              accept="image/,.pdf,.jpeg,.png,.gif"
            />
          </div>
          <div className="mt-4">
            <div className="p-2 bg-light">
              <Table responsive hover bordered>
                <thead>
                  <tr>
                    <th></th>
                    <th>S.no</th>
                    <th>Type</th>
                    <th>DocType</th>
                    <th>Uploaded By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>X</td>
                    <td>1</td>
                    <td>Pan Card</td>
                    <th>
                      <a href="www.google.com" download>
                        adad.png
                      </a>
                    </th>
                    <td>Admin</td>
                    <td>26/jun/2022</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-success">Upload</button>
      </Modal.Footer>
    </Modal>
  );
}

export default UploadModal;
