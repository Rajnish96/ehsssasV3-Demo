import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ImportExport } from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { getAccessCentres } from "../../Frontend/util/Commonservices";
import { ExcelRenderer, OutTable } from "react-excel-renderer";
import ExportFile from "./ExportFile";

function ImportExportExcelMaster() {
  const [CentreId, setCentreId] = useState([]);

  const [ExcelPreview, setExcelPreview] = useState({
    cols: [],
    rows: [],
    show: false,
  });

  const uploadFile = (event) => {
    let fileObj = event.target.files[0];
    ExcelRenderer(fileObj, (err, resp) => {
      console.log(resp);
      if (err) {
        console.log(err);
      } else {
        const { cols, rows } = resp;
        setExcelPreview({
          ...ExcelPreview,
          cols: cols,
          rows: rows,
          show: false,
        });
      }
    });
  };

  useEffect(() => {
    getAccessCentres(setCentreId);
  }, []);
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Import Export Excel Master</a>
          </li>
          <li className="breadcrumb-item active"></li>
        </ol>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">
              Search Criteria
            </span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="DataType">
                  ImportExportData:
                </label>
                <SelectBox options={ImportExport} />
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <label className="control-label" htmlFor="DataType">
                  CentreID:
                </label>
                <SelectBox options={CentreId} />
              </div>

              <ExportFile />
              
            </div>
            <div className="row mt-3">
              <div className="col-sm-2 col-md-2 form-group">
                <div className="excel-import-container">
                  <div className="file-upload">
                    <Input
                      type="file"
                      className="form-control-file"
                      onChange={uploadFile}
                    />
                  </div>
                </div>
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <button
                  className="btn btn-success w-100"
                  onClick={() => {
                    setExcelPreview({ ...ExcelPreview, show: true });
                  }}
                >
                  Upload
                </button>
              </div>

              <div className="col-sm-2 col-md-2 form-group">
                <button className="btn btn-success w-100">
                  Save To Database
                </button>
              </div>
            </div>
            {ExcelPreview?.show && (
              <div className="row p-3">
                <div className="excel-table-wrapper w-100">
                  <OutTable
                    data={ExcelPreview?.rows}
                    columns={ExcelPreview?.cols}
                    tableClassName="excel-table "
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportExportExcelMaster;
