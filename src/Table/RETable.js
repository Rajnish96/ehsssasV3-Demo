import moment from "moment";
import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomModal from "../Frontend/util/CustomModal";
import parse from "html-react-parser";
import Loading from "../Frontend/util/Loading";

function RETable({ redata, GetResultEntry }) {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [loading, setLoading] = useState(false);
  const [Index, setIndex] = useState(-1);
  return (
    <div className="boottable">
      {redata.length > 0 ? (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>S.N</th>
              <th>Reg Date</th>
              <th>Visit No</th>
              <th>SIN NO</th>
              <th>Pat Code</th>
              <th>Name </th>
              <th>Age</th>
              <th>Test</th>
              <th>Print</th>
              <th>Doctor</th>
              <th>Centre</th>

              <th>Upload</th>
              <th>Medical History</th>
            </tr>
          </thead>
          <tbody>
            {redata.map((data, index) => (
              <tr key={index}>
                <td
                  onClick={() => {
                    setModal(true);
                    setVisitID(data?.VisitNo);
                  }}
                >
                  <div>{index + 1}</div>
                  <i className="fa fa-search" />
                </td>
                <td>
                  <div>{moment(data.Date).format("DD/MMM/YYYY")}</div>
                  <div>{moment(data?.Date).format("hh:mm:ss a")}</div>
                </td>
                <td
                  onClick={() => {
                    GetResultEntry(data?.LedgerTransactionID, setLoading);
                    setIndex(index);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="text-primary">
                    {loading && index === Index ? <Loading /> : data?.VisitNo}
                  </div>
                </td>
                <td>{data?.SinNo}</td>
                <td>{data?.PatientCode}</td>
                <td>{data?.PatientName}</td>
                <td>
                  <div>{data?.Age}</div>
                  <div>{data?.Gender}</div>
                </td>

                <td>{parse(data?.Test)}</td>

                <td></td>

                <td>{data?.DoctorName}</td>
                <td>{data?.Centre}</td>

                <td></td>

                <td>
                  <Link to="">see_Medical History (0)</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        "No Data Found"
      )}
      {modal && (
        <CustomModal
          show={modal}
          visitID={visitID}
          onHide={() => setModal(false)}
        />
      )}
    </div>
  );
}

export default RETable;
