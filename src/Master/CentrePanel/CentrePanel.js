import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

const CentrePanel = () => {
  const [CentreData, setCentreData] = useState([]);
  const [ReferenceRate, setReferenceRate] = useState([]);
  const [Disable, setDisable] = useState(true);
  const [load, setLoad] = useState({
    ReferenceRateLoading: false,
    SaveLoad: false,
  });

  const [payload, setPayload] = useState({
    CentreID: 1,
    CentreName: "",
    Data: [],
  });

  const handleChange = (e, index) => {
    const { name, checked } = e.target;
    const data = [...ReferenceRate];
    data[index][name] = checked;
    setReferenceRate(data);
  };

  useEffect(() => {
    if (CentreData.length > 0) {
      const name = CentreData.find((ele) => ele.value === payload?.CentreID);
      setPayload({ ...payload, CentreName: name?.label });
    }
  }, [payload?.CentreID, CentreData]);

  const saveData = () => {
    setLoad({ ...load, SaveLoad: true });
    const data = ReferenceRate.filter((ele) => ele.isChecked === true);
    const val = data.map((ele) => {
      return { RateTypeID: ele?.value, RateTypeName: ele?.label };
    });
    setPayload({ ...payload, Data: val });

    axios
      .post("/api/v1/CentreAccess/InsertCentreAccessData", {
        ...payload,
        Data: val,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoad({ ...load, SaveLoad: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad({ ...load, SaveLoad: false });
      });
  };
  const getReferenceRate = () => {
    axios
      .get("/api/v1/Centre/CentreReferRateList")
      .then((res) => {
        let data = res.data.message;
        let CentreReferRate = data.map((ele) => {
          return {
            value: ele.ReferenceRateID,
            label: ele.ReferenceRate,
            isChecked: false,
          };
        });
        setReferenceRate(CentreReferRate);
        fetch(CentreReferRate);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event?.value });
  };

  console.log(payload);

  const disable = () => {
    let disable = true;
    for (var i = 0; i < ReferenceRate.length; i++) {
      if (ReferenceRate[i].isChecked === true) {
        disable = false;
        break;
      }
    }
    setDisable(disable);
  };

  useEffect(() => {
    disable();
  }, [ReferenceRate]);

  const fetch = (mapdata) => {
    setLoad({ ...load, ReferenceRateLoading: true });
    axios
      .post("/api/v1/CentreAccess/GetCentreAccessData", {
        CentreID: payload?.CentreID,
      })
      .then((res) => {
        const data = res?.data?.message;

        const val = [...mapdata];

        const haveIds = new Set(data.map(({ RateTypeId }) => RateTypeId));

        const result = val.map((ele) => {
          return {
            ...ele,
            isChecked: haveIds.has(ele?.value),
          };
        });
        setReferenceRate(result);
        setLoad({ ...load, ReferenceRate: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad({ ...load, ReferenceRate: false });
      });
  };

  useEffect(() => {
    if (ReferenceRate.length > 0) {
      fetch(ReferenceRate);
    }
  }, [payload?.CentreID]);

  useEffect(() => {
    getReferenceRate();
    getAccessCentres(setCentreData);
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <div className="card shadow mb-4 mt-5">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">
              Search Criteria
            </span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-1 col-md-1 form-group">
                <label className="control-label ">Centre</label>
              </div>
              <div className="col-sm-2 col-md-2 form-group">
                <SelectBox
                  options={CentreData}
                  name="CentreID"
                  selectedValue={selectedValueCheck(
                    CentreData,
                    payload?.CentreID
                  )}
                  onChange={handleSelectChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-1">
                <label className="control-label">Rate Type</label>
              </div>

              <div className="col-sm-11">
                {load?.ReferenceRateLoading ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <Loading />
                  </div>
                ) : (
                  <div className="row">
                    {ReferenceRate.map((ele, index) => (
                      <div key={index} className="col-sm-3">
                        <Input
                          type="checkbox"
                          checked={ele?.isChecked}
                          name="isChecked"
                          onChange={(e) => handleChange(e, index)}
                        />

                        <label>{ele.label}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col-sm-1">
                {load?.SaveLoad ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success"
                    onClick={saveData}
                    disabled={Disable}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentrePanel;
