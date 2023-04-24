import React from "react";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

function ExportFile() {
  const filetype =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
  const fileExtension = ".xlsx";
  const ExportToExcel = async () => {
    debugger;
    const ws = XLSX.utils.json_to_sheet([{ name: "sahil", lastname: "Kumar" }]); //json data;
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: filetype });
    FileSaver.saveAs(data, "excel" + fileExtension);
  };

  return (
    <div className="col-sm-2 col-md-2 form-group" style={{ alignSelf: "end" }}>
      <button
        className="btn btn-success w-100"
        onClick={ExportToExcel}
      >
        Download
      </button>
    </div>
  );
}

export default ExportFile;
