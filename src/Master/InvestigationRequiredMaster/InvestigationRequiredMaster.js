import React from "react";
import { useState } from "react";
import { InputFields } from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { selectedValueCheck } from "../../Frontend/util/Commonservices";

function InvestigationRequiredMaster() {
  const [payload, setPayload] = useState({
    FieldName: "",
    InputType: "",
    IsRequired: 0,
    IsUnit: 0,
    Unit: "",
    isActive: 0,
    DropDownOption: "",
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? checked?1:0 : value,
    });
  };
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid pt-3">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Investigatigation Required Master:
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Required Field:
                </label>
                <Input
                  type="text"
                  className="form-control"
                  name="FieldName"
                  value={payload?.FieldName}
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label " htmlFor="DataType">
                  Input Type:
                </label>
                <SelectBox
                  options={InputFields}
                  selectedValue={selectedValueCheck(
                    InputFields,
                    payload?.InputType
                  )}
                  name="InputType"
                />
              </div>

              <div className="col-sm-1 col-md-1 form-group">
                <label
                  className="control-label "
                  htmlFor="DataType"
                  style={{ display: "block" }}
                >
                  Required:
                </label>
                <Input
                  type="checkbox"
                  checked={payload?.IsRequired}
                  name="IsRequired"
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-1 col-md-1 form-group">
                <label
                  className="control-label "
                  htmlFor="DataType"
                  style={{ display: "block" }}
                >
                  IsUnit:
                </label>
                <Input
                  type="checkbox"
                  checked={payload?.IsUnit}
                  name="IsUnit"
                  onChange={handleChange}
                />
              </div>
              {payload?.IsUnit===1 && (
                <div className="col-sm-2 col-md-2 form-group">
                  <label className="control-label " htmlFor="DataType">
                    Unit:
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    value={payload?.Unit}
                    name="Unit"
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-sm-1 col-md-1 form-group">
                <Input type="checkbox" />
                <label className="control-label " htmlFor="DataType">
                  isActive
                </label>
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <div className="btn btn-success">Save</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestigationRequiredMaster;
