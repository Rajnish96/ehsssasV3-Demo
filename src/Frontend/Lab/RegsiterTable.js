import moment from "moment";
import React from "react";
import { useState } from "react";
import TestNameModal from "../util/TestNameModal";
import UrgentModal from "../util/UrgentModal";

function RegsiterTable({
  data,
  handleFilter,
  index,
  handleDiscount,
  handlePLOChange,
  handleUrgent,
}) {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleClose2 = () => {
    setShow2(false);
  };

  return (
    <>
      {show && (
        <UrgentModal
          show={show}
          handleClose={handleClose}
          handleUrgent={handleUrgent}
          index={index}
        />
      )}
      {show2 && (
        <TestNameModal
          show={show2}
          onHandleShow={handleClose2}
          id={data?.InvestigationID}
        />
      )}
      <td>
        {index + 1}
        <button
          className="btn btn-danger"
          onClick={() => {
            handleFilter(data);
          }}
        >
          X
        </button>
      </td>

      <td>{data.TestCode}</td>
      <td>{data.TestName}</td>
      <td onClick={() => setShow2(true)}>
        <i className="fa fa-search" />
      </td>
      <td>{data?.Rate}</td>
      <td>
        <input
          style={{ width: "50px" }}
          type="number"
          value={data?.Discount}
          onChange={(e) => {
            handleDiscount(e.target.value, index);
          }}
        />
      </td>
      <td>
        <input value={data?.NetAmount} disabled style={{ width: "50px" }} />
      </td>
      <td>{moment(data.deleiveryDate).format("DD/MMM/YYYY hh:mm a")}</td>
      <td>
        <input
          type="checkbox"
          name="Status"
          value={data?.Status}
          checked={data?.Status === 2 ? true : false}
          onChange={(e) => handlePLOChange(e, index)}
        />
      </td>
      <td>
        <input
          type="checkbox"
          name={"IsUrgent"}
          value={data?.IsUrgent}
          onChange={(e) => {
            handlePLOChange(e, index);
            if (e.target.checked === true) {
              setShow(true);
            } else {
              setShow(false);
            }
          }}
        />
      </td>
    </>
  );
}

export default RegsiterTable;
