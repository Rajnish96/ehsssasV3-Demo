import React from "react";
import { Table } from "react-bootstrap";
import Input from "../../ChildComponents/Input";

function SmsMaster() {
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <div className="card shadow mb-4 mt-5">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                SMS Master
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row p-2 px-4">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Template</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>
                      <Input type="checkbox" />
                    </td>
                  </tr>
                </tbody>
              </Table>

              <div className="mt-2">
                <button className="btn btn-success">Update</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmsMaster;
