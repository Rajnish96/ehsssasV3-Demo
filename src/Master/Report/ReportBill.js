import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  Active,
  ActiveTemplateID,
  DDLData,
  Dynamic,
  DynamicReportType,
  FontFamily,
  LableID,
  PageOrientation,
  PageSize,
  ReportType,
  TemplateName,
  TypePlaceHolder,
} from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  isChecked,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import SeeImage from "../../Frontend/util/SeeImage";
import SeeText from "../../Frontend/util/SeeText";
import TextEditor from "./TextEditor";

function ReportBill() {
  const [headerSetupData, setHeaderSetupData] = useState(LableID);
  const [Editor, setEditor] = useState("");
  const [index, setIndex] = useState("");
  const [load, setLoad] = useState(false);
  const [ModalValue, SetModalValue] = useState({
    text: "",
    image: "",
  });
  const [DynamicField, setDynamicField] = useState(Dynamic);
  const [DynamicReport, setDynamicReport] = useState([]);
  const [show, setShow] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [id, setId] = useState("");
  const [PageSetup, setPageSetup] = useState({
    ActiveTemplateID: "",
    FooterHeight: "",
    HeaderHeight: "",
    MarginBottom: "",
    MarginLeft: "",
    MarginRight: "",
    MarginTop: "",
    PageOrientation: "",
    PageSize: "",
    ReportName: ReportType[1]?.value,
    ReportType: ReportType[1]?.value,
    ReportTypeId: "",
    TemplateID: TemplateName[1]?.value,
    TemplateName: TemplateName[1]?.label,
  });

  const handleShow = () => {
    setShow(false);
  };

  const handleShowImage = () => {
    setShowImage(false);
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    switch (name) {
      case "ReportType":
        setPageSetup({
          ...PageSetup,
          [name]: event.label,
          ReportName: event?.label,
        });
        break;
      case "TemplateName":
        setPageSetup({
          ...PageSetup,
          [name]: event?.label,
          TemplateID: event?.value,
        });
        break;
      default:
        setPageSetup({ ...PageSetup, [name]: event?.value });
        break;
    }
  };

  useEffect(() => {
    if (PageSetup?.ReportType === "Lab Report") {
      setPageSetup({ ...PageSetup, ReportTypeId: "2" });
    } else if (PageSetup?.ReportType === "Bill") {
      setPageSetup({ ...PageSetup, ReportTypeId: "1" });
    } else if (PageSetup?.ReportType === "TRF") {
      setPageSetup({ ...PageSetup, ReportTypeId: "3" });
    }
  }, [PageSetup?.ReportType]);

  const handleSelectDynamic = (event, rest) => {
    const { name } = rest;
    setDynamicField({
      ...DynamicField,
      [name]: event.value,
    });
  };

 

  const handleSubmit = () => {
    setLoad(true);
    axios
      .post("/api/v1/ReportMaster/UpdateReportSetting", {
        id: id,
        DynamicReportData: DynamicReport,
        pageSetup: PageSetup,
        headerSetup: headerSetupData,
      })
      .then((res) => {
        setLoad(false);
        toast.success(res.data.message);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPageSetup({ ...PageSetup, [name]: value });
  };

  const handleHeader = (e, index) => {
    const { name, value, checked } = e.target;
    if (index >= 0) {
      const data = [...headerSetupData];
      data[index][name] = value ? value : checked ? 1 : 0;
      setHeaderSetupData(data);
    } else {
      const val = headerSetupData.map((ele) => {
        return {
          ...ele,
          [name]: value ? value : checked ? 1 : 0,
        };
      });
      setHeaderSetupData(val);
    }
  };

  const handleChangeDynamic = (e) => {
    const { name, value } = e.target;
    setDynamicField({ ...DynamicField, [name]: value });
  };

  useEffect(() => {
    setDynamicField({ ...DynamicField, Text: Editor });
  }, [Editor]);

  const handleAdd = (index) => {
    if (index < 0 || index === "") {
      setDynamicReport([...DynamicReport, DynamicField]);
      setDynamicField(Dynamic);
      setEditor("");
    } else {
      const data = [...DynamicReport];
      data[index] = DynamicField;
      setDynamicReport(data);
      setDynamicField(Dynamic);
      setEditor("");
      setIndex("");
    }
  };

  const handleEdit = (data, index) => {
    setDynamicField(data);
    setIndex(index);
  };

  const handleDelete = (index) => {
    const data = DynamicReport.filter((ele, ind) => ind !== index);
    setDynamicReport(data);
    toast.success("successfully Deleted");
  };

  const fetch = () => {
    axios
      .post("/api/v1/ReportMaster/GetReportSettingData", {
        ReportTypeId: PageSetup?.ReportTypeId,
        TemplateID: PageSetup?.TemplateID,
      })
      .then((res) => {
        console.log(JSON.parse(res.data.message[0].ReportConfiguration));
        const data = JSON.parse(res.data.message[0].ReportConfiguration);
        setDynamicReport(data.DynamicReportData);
        setHeaderSetupData(data?.headerSetup);
        setPageSetup({
          ...data?.pageSetup,
          ReportType: data?.pageSetup?.ReportName,
        });
        setId(data?.Id);
      })
      .catch((err) => console.log(err));
  };

  const handleText = (data) => {
    setShow(true);
    SetModalValue({ ...ModalValue, text: data });
  };

  const handleImage = (data) => {
    setShowImage(true);
    SetModalValue({ ...ModalValue, image: data });
  };

  useEffect(() => {
    fetch();
  }, [PageSetup?.ReportTypeId, PageSetup?.TemplateID]);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      {ModalValue?.text && show && (
        <SeeText show={show} handleShow={handleShow} data={ModalValue?.text} />
      )}
      {ModalValue?.image && showImage && (
        <SeeImage
          show={showImage}
          handleShow={handleShowImage}
          data={ModalValue?.image}
        />
      )}
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Report Master</a>
          </li>
          <li className="breadcrumb-item active"></li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Page Setup
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Report Type
                </label>
                :
                <SelectBox
                  options={ReportType}
                  name="ReportType"
                  onChange={handleSelectChange}
                  selectedValue={selectedValueCheck(
                    ReportType,
                    PageSetup?.ReportType
                  )}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Template
                </label>
                :
                <SelectBox
                  name="TemplateName"
                  options={TemplateName}
                  onChange={handleSelectChange}
                  selectedValue={selectedValueCheck(
                    TemplateName,
                    PageSetup?.TemplateID
                  )}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  ActiveTemplateID
                </label>
                :
                <SelectBox
                  options={ActiveTemplateID}
                  name="ActiveTemplateID"
                  selectedValue={selectedValueCheck(
                    ActiveTemplateID,
                    PageSetup?.ActiveTemplateID
                  )}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Report Name
                </label>
                :
                <Input
                  name="TypeName"
                  className="form-control pull-right reprint-date"
                  value={PageSetup?.ReportName}
                  readOnly
                />
              </div>

              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  PageSize
                </label>
                :
                <SelectBox
                  name="PageSize"
                  options={PageSize}
                  selectedValue={selectedValueCheck(
                    PageSize,
                    PageSetup?.PageSize
                  )}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Page Orientation
                </label>
                :
                <SelectBox
                  name="PageOrientation"
                  options={PageOrientation}
                  selectedValue={selectedValueCheck(
                    PageOrientation,
                    PageSetup?.PageOrientation
                  )}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Margin Left:
                </label>

                <Input
                  name="MarginLeft"
                  className="form-control pull-right reprint-date"
                  value={PageSetup?.MarginLeft}
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Margin Right:
                </label>

                <Input
                  name="MarginRight"
                  className="form-control pull-right reprint-date"
                  value={PageSetup?.MarginRight}
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Margin Top:
                </label>

                <Input
                  name="MarginTop"
                  className="form-control pull-right reprint-date"
                  value={PageSetup?.MarginTop}
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Margin Bottom:
                </label>

                <Input
                  name="MarginBottom"
                  className="form-control pull-right reprint-date"
                  value={PageSetup?.MarginBottom}
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Header Height:
                </label>

                <Input
                  name="HeaderHeight"
                  className="form-control pull-right reprint-date"
                  value={PageSetup?.HeaderHeight}
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Footer Height:
                </label>

                <Input
                  name="FooterHeight"
                  className="form-control pull-right reprint-date"
                  value={PageSetup?.FooterHeight}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-3 p-2">
              <Table responsive bordered hover striped>
                <thead>
                  <tr>
                    <th>LabelID</th>
                    <th>LabelDetail</th>
                    <th>DetailXPosition</th>
                    <th>Top</th>
                    <th>Left</th>
                    <th>
                      <Input
                        className="form-control"
                        type="number"
                        name="FontSize"
                        onChange={handleHeader}
                      />
                    </th>
                    <th>
                      <select
                        className="form-control"
                        name="FontFamily"
                        onChange={handleHeader}
                      >
                        {FontFamily.map((item, ind) => (
                          <option value={item.value} key={ind}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </th>
                    <th>
                      <label>Bold</label>
                      <Input
                        type="checkbox"
                        name="Bold"
                        checked={
                          isChecked("Bold", headerSetupData, 1).includes(false)
                            ? false
                            : true
                        }
                        onChange={handleHeader}
                      />
                    </th>
                    <th>
                      <label>Italic</label>
                      <Input
                        type="checkbox"
                        name="Italic"
                        checked={
                          isChecked("Italic", headerSetupData, 1).includes(
                            false
                          )
                            ? false
                            : true
                        }
                        onChange={handleHeader}
                      />
                    </th>
                    <th>
                      <label>UnderLine</label>
                      <Input
                        type="checkbox"
                        name="Underline"
                        checked={
                          isChecked("Underline", headerSetupData, 1).includes(
                            false
                          )
                            ? false
                            : true
                        }
                        onChange={handleHeader}
                      />
                    </th>
                    <th>
                      <label>Print</label>
                      <Input
                        type="checkbox"
                        name="Print"
                        checked={
                          isChecked("Print", headerSetupData, 1).includes(false)
                            ? false
                            : true
                        }
                        onChange={handleHeader}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {headerSetupData.map((data, index) => (
                    <tr key={index}>
                      <td>{data?.LabelID}</td>
                      <td>
                        <Input
                          value={data?.LabelDetail}
                          className="form-control"
                          type="text"
                          name="LabelDetail"
                          onChange={(e) => handleHeader(e, index)}
                        />
                      </td>
                      <td>
                        <Input
                          value={data?.DetailXPosition}
                          className="form-control"
                          name="DetailXPosition"
                          text="number"
                          onChange={(e) => handleHeader(e, index)}
                        />
                      </td>
                      <td>
                        <Input
                          value={data?.Top}
                          name="Top"
                          type="number"
                          onChange={(e) => handleHeader(e, index)}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <Input
                          value={data?.Left}
                          name="Left"
                          type="number"
                          onChange={(e) => handleHeader(e, index)}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <Input
                          value={data?.FontSize}
                          name="FontSize"
                          type="number"
                          onChange={(e) => handleHeader(e, index)}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="FontFamily"
                          onChange={(e) => handleHeader(e, index)}
                          value={data?.FontFamily}
                        >
                          {FontFamily.map((item, ind) => (
                            <option value={item.value} key={ind}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <Input
                          type="checkbox"
                          checked={data?.Bold === 1 ? true : false}
                          name="Bold"
                          onChange={(e) => handleHeader(e, index)}
                        />
                      </td>
                      <td>
                        <Input
                          type="checkbox"
                          checked={data?.Italic === 1 ? true : false}
                          name="Italic"
                          onChange={(e) => handleHeader(e, index)}
                        />
                      </td>
                      <td>
                        <Input
                          type="checkbox"
                          checked={data?.Underline === 1 ? true : false}
                          name="Underline"
                          onChange={(e) => handleHeader(e, index)}
                        />
                      </td>
                      <td>
                        <Input
                          type="checkbox"
                          checked={data?.Print === 1 ? true : false}
                          name="Print"
                          onChange={(e) => handleHeader(e, index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>

        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Dynamic Field
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  DynamicReportType:
                </label>

                <SelectBox
                  name="DynamicReportType"
                  options={DynamicReportType}
                  onChange={handleSelectDynamic}
                  selectedValue={{
                    label: DynamicField?.DynamicReportType,
                    value: DynamicField?.DynamicReportType,
                  }}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  TypePlaceHolder:
                </label>

                <SelectBox
                  name="TypePlaceHolder"
                  options={TypePlaceHolder}
                  onChange={handleSelectDynamic}
                  selectedValue={{
                    label: DynamicField?.TypePlaceHolder,
                    value: DynamicField?.TypePlaceHolder,
                  }}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Data
                </label>
                :
                <SelectBox
                  name="Data"
                  options={DDLData}
                  onChange={handleSelectDynamic}
                  selectedValue={{
                    label: DynamicField?.Data,
                    value: DynamicField?.Data,
                  }}
                />
              </div>
              <div className="col-sm-1 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  PositionLeft
                </label>
                :
                <Input
                  name="PositionLeft"
                  className="form-control pull-right reprint-date"
                  value={DynamicField?.PositionLeft}
                  type="number"
                  onChange={handleChangeDynamic}
                />
              </div>

              <div className="col-sm-1 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  PositionTop
                </label>
                :
                <Input
                  name="PositionTop"
                  className="form-control pull-right reprint-date"
                  value={DynamicField?.PositionTop}
                  type="number"
                  onChange={handleChangeDynamic}
                />
              </div>

              <div className="col-sm-1 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Width
                </label>
                :
                <Input
                  name="Width"
                  className="form-control pull-right reprint-date"
                  value={DynamicField?.Width}
                  type="number"
                  onChange={handleChangeDynamic}
                />
              </div>

              <div className="col-sm-1 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Height
                </label>
                :
                <Input
                  name="Height"
                  className="form-control pull-right reprint-date"
                  value={DynamicField?.Height}
                  type="number"
                  onChange={handleChangeDynamic}
                />
              </div>
              <div className="col-sm-2 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  IsActive
                </label>
                :
                <SelectBox
                  name="IsActive"
                  options={Active}
                  onChange={handleSelectDynamic}
                  selectedValue={{
                    label: DynamicField?.IsActive,
                    value: DynamicField?.IsActive,
                  }}
                />
              </div>
              <div className="col-sm-6 form-group">
                <label
                  className="control-label"
                  htmlFor="TypeName"
                  style={{ fontWeight: "bold" }}
                >
                  Attach Signatures
                </label>
                :
                <Input name="TypeName" type="file" />
              </div>

              <div className="col-sm-6 form-group mt-4">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    handleAdd(index);
                  }}
                >
                  {index === "" || DynamicReport.length === 0
                    ? "Add Fields"
                    : "Update"}
                </button>
              </div>

              <div className="col-12 mb-4">
                <TextEditor value={DynamicField?.Text} setValue={setEditor} />
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Dynamic Field List
              </h6>
            </div>
          </div>
          <div className="card-body">
            {DynamicReport.length > 0 && (
              <div>
                <Table responsive hover bordered striped>
                  <thead>
                    <tr>
                      <th>Edit</th>
                      <th>Remove</th>
                      <th>DynamicReportType</th>
                      <th>TypePlaceHolder</th>
                      <th>Data</th>
                      <th>PositionLeft</th>
                      <th>PositionTop</th>
                      <th>Width</th>
                      <th>Height</th>
                      <th>Action</th>
                      <th>Text</th>
                      <th>Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DynamicReport.map((ele, index) => (
                      <tr key={index}>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() => handleEdit(ele, index)}
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              handleDelete(index);
                            }}
                          >
                            Remove
                          </button>
                        </td>
                        <td>{ele?.DynamicReportType}</td>
                        <td>{ele?.TypePlaceHolder}</td>
                        <td>{ele?.Data}</td>
                        <td>{ele?.PositionLeft}</td>
                        <td>{ele?.PositionTop}</td>
                        <td>{ele?.Width}</td>
                        <td>{ele?.Height}</td>
                        <td>{ele?.IsActive}</td>
                        <td>
                          <button
                            className="btn btn-info"
                            onClick={() => handleText(ele?.Text)}
                            disabled={ele?.Text ? false : true}
                          >
                            See Text
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-info"
                            onClick={() => handleImage(ele?.ImageData)}
                            disabled={
                              ele?.ImageData.trim() !== "undefined"
                                ? false
                                : true
                            }
                          >
                            See Image
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="row mt-3">
                  <div className="col-sm-3">
                    {load ? (
                      <Loading />
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={handleSubmit}
                      >
                        Update
                      </button>
                    )}
                  </div>
                  <div className="col-sm-3">
                    <button className="btn btn-success">
                      Lab Report Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportBill;
