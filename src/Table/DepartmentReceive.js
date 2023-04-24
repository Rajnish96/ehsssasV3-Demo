import moment from "moment";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomModal from "../Frontend/util/CustomModal";
import parse from "html-react-parser";
import Input from "../ChildComponents/Input";

function DepartmentReceiveTable({ drdata,setSaveTestId,saveTestId }) {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();

 

  
  const handleTestID = (e, data) => {
    const { checked } = e.target;
    if (checked) {
      setSaveTestId([...saveTestId, data]);
    } else {
      const filterdata = saveTestId.filter((ele) => ele?.TestID !== data?.TestID);
      setSaveTestId(filterdata);
    }
  };

  // const handleTestStringFormat = () => {
  //   let val = "";
  //   for (let i = 0; i < testID.length; i++) {
  //     val = val === "" ? `${testID[i]}` : `${val},${testID[i]}`;
  //   }
  //   return val;
  // };

  // useEffect(() => {
  //   const data = handleTestStringFormat();
  //   setSaveTestId(data)
  // }, [testID]);

  return (
    <div className="">
      {drdata.length > 0 ? (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Sin No</th>
              <th>Reg Date</th>
              <th>Visit No</th>
              <th>Pat Code</th>
              <th>Name </th>
              <th>Age</th>

              <th>SampleType</th>
              <th>Department</th>
              <th>Test</th>
              <th>Reject</th>
              <th>Upload</th>
              <th>Medical History</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {drdata.map((data, index) => (
              <tr key={index}>
                <td className={`color-Status-${data.Status}`}
                  onClick={() => {
                    setModal(true);
                    setVisitID(data?.VisitNo);
                  }}
                >
                  <div>{index + 1}</div>
                  <i className="fa fa-search" />
                </td>

                <td>{data?.SinNo}</td>
                <td>
                  <div>{moment(data.Date).format("DD/MMM/YYYY")}</div>
                  <div>{moment(data?.Date).format("hh:mm:ss a")}</div>
                </td>
                <td>{data?.VisitNo}</td>
                <td>{data?.PatientCode}</td>
                <td>{data?.PName}</td>
                <td>
                  <div>{data?.Age}</div>
                  <div>{data?.Gender}</div>
                </td>
                <td>{data?.SampleName}</td>
                <td>{parse(data?.Department)}</td>

                <td>{parse(data?.ItemName)}</td>
<td> </td>
                <td></td>

                <td></td>
                <td>
                {data.Status===2 &&(<Input
                    type="checkbox"
                    onChange={(e) => handleTestID(e, data)}
                  />)}
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

export default DepartmentReceiveTable;
