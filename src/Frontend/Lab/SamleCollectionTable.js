import React, { useState, useEffect } from "react";
import { SampleSource } from "../../ChildComponents/Constants";
import { getSampleType } from "../util/Commonservices";
import moment from "moment";
import Input from "./../../ChildComponents/Input";
import RejectModal from "../util/RejectModal";

function SamleCollectionTable({
  data,
  index,
  payload,
  setPayload,
  setSearchInvdata,
  searchInvdata,
  TableData
}) {
  const [sampleTypeDropdown, setSampleTypeDropdown] = useState([]);
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const data = [...searchInvdata];
    if (name === "SampleTypeID") {
      const selctedvalue = sampleTypeDropdown.find((ele) => ele.value == value);
      data[index][name] = selctedvalue?.value;
      data[index]["SampleType"] = selctedvalue?.label;
      setSearchInvdata(data);
    } else {
      data[index][name] = value;
      setSearchInvdata(data);
    }
  };

  const handlePayload = (e, data) => {
  
    const { checked } = e.target;
    if (checked) {
      setPayload([...payload, data]);
    } else {
      const filterdata = payload.filter((ele) => ele?.TestID !== data?.TestID);
      setPayload(filterdata);
    }
  };

  useEffect(() => {
    getSampleType(setSampleTypeDropdown, data?.InvestigationID);
  }, []);

  return (
    <>
      {show && <RejectModal show={show} handleShow={handleShow} data={data} TableData={TableData}/>}
      <td className={`color-Status-${data.Status}`}>
        <div>{index + 1}</div>
        <i className="fa fa-search" />
      </td>

      <td>
        <div>{moment(data.Date).format("DD/MMM/YYYY")}</div>
        <div>{moment(data?.Date).format("hh:mm:ss a")}</div>
      </td>
      <td>{data?.VisitNo}</td>
      <td>{data?.PName}</td>

      <td>{data?.Test}</td>
      <td>
        <Input
          value={data?.SINNo}
          name="SINNo"
          className="form-control"
          disabled={data?.BarcodeLogic === 1 ? true : false}
          onChange={(e) => handleChange(e, index)}
        />
      </td>
      <td>
        <select
          className="form-control"
          onChange={(e) => handleChange(e, index)}
          name="Source"
          value={data?.Source}
        >
          {SampleSource.map((select, index) => (
            <option value={select?.label} key={index}>
              {select?.label}
            </option>
          ))}
        </select>
      </td>
      <td>{data?.SampleQty}</td>
      <td>
        <select
          className="form-control"
          name="SampleTypeID"
          onChange={(e) => handleChange(e, index)}
          value={data?.SampleTypeID}
        >
          {sampleTypeDropdown.map((select, ind) => (
            <option value={select?.value} key={ind}>
              {select?.label}
            </option>
          ))}
        </select>
      </td>
      <td>
     {data.Approved===0 && (
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                            handleShow();
                        }}
                      >
                        Reject
                      </button>)}
                  
      
      </td>
      <td>
      {(data.Status===1 || data.Status===4) &&(
        <Input disabled={(data.Status==1 || data.Status==4)?false:true} type="checkbox" onChange={(e) => handlePayload(e, data)} />)}
      </td>
    </>
  );
}

export default SamleCollectionTable;
