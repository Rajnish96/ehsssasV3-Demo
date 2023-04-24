import React from "react";

const ConcentForm = () => {
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid ">
        <div className="row mt-5">
          <div className="col-sm-6">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <div className="clearfix">
                  <h6 className="m-0 font-weight-bold text-primary float-left">
                    Concent Form
                  </h6>
                  <a className="float-right" href="/ConcentFormMaster/Create">
                    Create New
                  </a>
                </div>
              </div>
              <div className="card-body">
                <div className="col-sm-12">
                  <div className="row">
                    <div className="col-sm-3 form-group">
                      <label className="control-label">Concent Form Name</label>
                      :
                      <input className="form-control pull-right reprint-date" />
                    </div>
                    <div className="col-sm-3 form-group">
                      <label className="control-label">Upload File</label>
                      :
                      <input
                        className="form-control pull-right reprint-date"
                        type="file"
                      />
                    </div>
                    <div className="col-sm-1 col-md-1 form-group"></div>
                  </div>
                </div>
                <div className="row">
                  <table
                    id="tblData"
                    className="table table-striped table-bordered no-more-tables"
                  >
                    <thead>
                      <tr>
                        <th>Fields</th>
                        <th>Left</th>
                        <th>Top</th>
                        <th>Font</th>
                        <th>Size</th>
                        <th>Bold</th>
                        <th>Print</th>
                      </tr>
                    </thead>
                  </table>
                </div>
                <button type="button" className="btn  btn-success">
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card shadow mb-4">
              <div className="card-header  py-3">
                <h6
                  className="m-0 font-weight-bold text-primary "
                  style={{ textAlign: "center" }}
                >
                  Preview
                </h6>
              </div>
              <div className="card-body">
                <p>
                  <img />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcentForm;
