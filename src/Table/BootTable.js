import moment from "moment";
import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomModal from "../Frontend/util/CustomModal";
import { dateConfig } from "../Frontend/util/DateConfig";

function BootTable({ receiptData }) {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();

  return (
    <div className="boottable">
      {receiptData.length > 0 ? (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>S.N</th>
              <th>Entry Date</th>
              <th>Lab No</th>
              <th>Patient Name</th>
              <th>Age/Gender</th>
              <th>Mobile No</th>
              <th>Gross Amt</th>
              <th>Dis Amt</th>
              <th>Net Amt</th>
              <th>Paid Amt</th>
              <th>Centre</th>
              <th>Doctor</th>
              <th>User</th>
              <th>Edit Info</th>
              <th>Rec Edit</th>
              <th>Settlement</th>
              <th>Discount</th>
              <th>Refund</th>
              <th>Cash Receipt</th>
              <th>Trf Receipt</th>
              <th>Concent form</th>
              <th>View Details</th>
              <th>Send Email</th>
              <th>Medical History</th>
            </tr>
          </thead>
          <tbody>
            {receiptData.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <div>{dateConfig(data.Date)}</div>
                </td>

                <td>{data?.LedgerTransactionNo}</td>
                <td>
                  {data?.FirstName +
                    " " +
                    data?.MiddleName +
                    " " +
                    data?.LastName}
                </td>
                <td>
                  <div>{data?.Age}</div>
                  <div>{data?.Gender}</div>
                </td>

                <td>{data?.Mobile}</td>

                <td>{data?.GrossAmount}</td>
                <td>{data?.DiscountOnTotal}</td>

                <td>{data?.NetAmount}</td>
                <td>-</td>

                <td>{data?.Centre}</td>
                <td>{data?.DoctorName}</td>
                <td>{data?.CreatedByName}</td>
                <td>
                  <Link to="/patientregister" state={{ data: data }}>
                    Edit
                  </Link>
                </td>
                <td>-</td>
                <td>
                  <Link to="">Settlement</Link>
                </td>
                <td>
                  <Link to="">DiscountAfterBill</Link>
                </td>
                <td>
                  <Link to="">Refund</Link>
                </td>
                <td>
                  <Link
                    to="/GetLabReportPreview"
                    state={{ data: data?.LedgerTransactionID }}
                  >
                    <i className="fa fa-money" />
                  </Link>
                </td>
                <td>-</td>
                <td>-</td>
                <td
                  onClick={() => {
                    setModal(true);
                    setVisitID(data?.LedgerTransactionNo);
                  }}
                >
                  <i className="fa fa-search" />
                </td>
                <td>
                  <i className="fa fa-envelope-o" />
                </td>
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

export default BootTable;
