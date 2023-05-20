import React, { Component } from "react";
import "../../global/style/style.css";
import TopNavbar from "../../global/components/navbar";
import Exe_MiniDrawer from "../../global/components/exe_Sidebar";
import Card from "react-bootstrap/Card";
import { Button, Modal, Input } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import ModalMap from "../../global/components/ModelMap";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default class Exe_AllViolations extends Component {
  constructor(props) {
    super(props);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const pagenum_ = parseInt(urlParams.get('p'));
    const filter = (urlParams.get('filter'));
   
    this.state = {
      show_data: [],
      show_pages: 0,
      currentPage: pagenum_,

      show_uploading: false,

      show_model: false,
      model_show_violation_info: {
        violation_id: 0,
        violation_type_id: 0,
        violation_name: "",
        street_id: 0,
        street_name: "",
        accurate: 0,
        risk: 0,
        display_img: "",
        violation_date: "",
        violation_time: "",
        lat: 0,
        lng: 0,
        correct: 0,
        current_status: "Not Reported",
        new_violation_type_id: 0,
        new_street_id: 0,
        sensitivity: -1
      },
      filter:filter,
    };
    this.get_all_violations = this.get_all_violations.bind(this);
    this.show_filter = this.show_filter.bind(this);
    this.clear_filter = this.clear_filter.bind(this);
    this.handleChange_filter = this.handleChange_filter.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.get_all_violations(pagenum_, filter);
  }
  showModal = (para) => (e) => {
    const com = this;
    const axios = require("axios").default;
    axios
      .get(this.props.server + "/get_single_violation_Verify/" + para)
      .then(function (response) {
        com.setState({
          model_show_violation_info: response.data,
          show_model: true,
        });
      });
  };
  
  hideModal = () => {
    this.setState({ show_model: false });
  };
  
  get_all_violations(page_count, filter) {
    let v = "/"+sessionStorage.getItem("user_id")+"/"+page_count+"/"+filter;
    const com = this;
    const axios = require("axios").default;
    axios
      .get(this.props.server + "/get_all_violation_exe"+v)
      .then(function (response) {
        com.setState({
          show_data: response.data.myData,
          show_pages: response.data.pages,
        });
      });
  }

  
  handleChange_P = (e, value) => {
    let temp = this.state.filter;
    window.location.href = "/exe_allviolations?p="+value+"&filter="+temp;
  };
  show_filter() {
    let temp = this.state.filter;
    window.location.href = "/exe_allviolations?p=1&filter="+temp;
  }

  clear_filter() {
    window.location.href = "/exe_allviolations?p=1&filter=";
  }
  handleChange_filter(e) {
    this.setState({
      filter: e.target.value,
    });
  }


  render() {
    const calll = () => {
      const rows = this.state.show_data.map((x) => {
        return (
          <tr>
            <td>{x.violation_id}</td>
            <td>{x.violation_name}</td>
            <td>{x.street_name}</td>
            <td>{x.city}</td>
            <td>{x.accurate}</td>
            <td>{x.risk}</td>
            <td>{x.api_called}</td>
            <td>
              {x.violation_date} at {x.violation_time}
            </td>
            <td>{x.cor}</td>
            <td>{x.Operation_Status}</td>
            <td>{x.dev_id}</td>
            <td>
              {" "}
              <Button
                variant="primary"
                style={{ height: "60%" }}
                onClick={this.showModal(x.violation_id)}
              >
                Show Details
              </Button>
            </td>
          </tr>
        );
      });
      return rows;
    };

    return (
      <div>
        <Exe_MiniDrawer />
        <TopNavbar />
        <Card
          className="card_bg"
          style={{
            marginLeft: "7%",
            marginTop: "-5%",
            paddingRight: "20px",
            marginRight: "20px",
          }}
        >
           <center>
          <h2 style={{
            marginTop:"20px"
          }}>
            
            All Violations List
            
          </h2>
          </center>
          
          <div className="verifier_cases_details_table">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingRight: "50px",
              }}
            >
              <div
                class="input-group mb-3"
                style={{ flexBasis: "70%", marginLeft: "10px" }}
              >
                <span class="input-group-text" id="basic-addon1">
                  Search:{" "}
                </span>
                <input
                  type="text"
                  class="form-control"
                  value={this.state.filter}
                  onChange={this.handleChange_filter}
                />
              </div>
              
              <button
                type="button"
                class="btn btn-primary mb-3"
                onClick={this.show_filter}
                style={{ width: "300px" }}
              >
                Filter{" "}
              </button>
              <button
                type="button"
                class="btn btn-danger mb-3"
                onClick={this.clear_filter}
                style={{ width: "300px" }}
              >
                Reset Filter{" "}
              </button>
            </div>
            <div class="form-text w-100" style={{marginTop:"-10px", marginLeft:"10px"}}>
              Type: Case ID, Violation Type,	Street,	City, Correct Status,	Date (YYYY-MM-DD)
            </div>
            <hr />
            <div class="row" style={{ paddingRight: "50px" }}>
              <div class="table-responsive ">
                <table class="table table-striped ">
                  <thead>
                    <tr>
                      <th style={{ fontFamily: "Verdana" }}>ID </th>
                      <th style={{ fontFamily: "Verdana" }}>Type </th>
                      <th style={{ fontFamily: "Verdana" }}>Street </th>
                      <th style={{ fontFamily: "Verdana" }}>City </th>

                      <th style={{ fontFamily: "Verdana" }}>Accuracy</th>
                      <th style={{ fontFamily: "Verdana" }}>Risk</th>
                      <th style={{ fontFamily: "Verdana" }}>API Called</th>

                      <th style={{ fontFamily: "Verdana" }}>Date && Time</th>
                      <th style={{ fontFamily: "Verdana" }}>
                        Correct
                      </th>
                      <th style={{ fontFamily: "Verdana" }}>
                      Operation Status
                      </th>
                      <th style={{ fontFamily: "Verdana" }}>Device ID</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>{calll()}</tbody>
                </table>
              </div>
            </div>
          </div>
          <div style={{ width: "100%" }} className="model_box">
            <Modal
              dialogClassName="modal_width_styles"
              contentClassName="modal_height_styles"
              isOpen={this.state.show_model}
              onRequestClose={this.hideModal}
              show={this.state.show_model}
              onHide={this.hideModal}
              keyboard={false}
              style={{ width: "100%", height: "100%" }}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  Violation #{this.state.model_show_violation_info.violation_id}{" "}
                  Details
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <table className="model_table_">
                    <tr className="model_table_row">
                      <td style={{ width: "49%", paddingRight: "20px" }}>
                        <Form.Group className="mb-3">
                          <Form.Label>Violation Type</Form.Label>
                          <Form.Control
                            placeholder={
                              this.state.model_show_violation_info
                                .violation_name
                            }
                            disabled
                          />
                        </Form.Group>
                      </td>
                      <td style={{ width: "49%", paddingRight: "20px" }}>
                        <Form.Group className="mb-3">
                          <Form.Label>Street</Form.Label>
                          <Form.Control
                            placeholder={
                              this.state.model_show_violation_info.street_name
                            }
                            disabled
                          />
                        </Form.Group>
                      </td>
                      
                    </tr>
                    
                  </table>

                  <table className="model_table_">
                    <tr className="model_table_row">
                      <td style={{ width: "49%", paddingRight: "20px" }}>
                        <Form.Group className="mb-3">
                          <Form.Label>Risk</Form.Label>
                          <Form.Control
                            placeholder={
                              this.state.model_show_violation_info.risk
                            }
                            disabled
                          />
                        </Form.Group>
                      </td>
                      <td style={{ width: "49%", paddingRight: "20px" }}>
                        <Form.Group className="mb-3">
                          <Form.Label>Accurate</Form.Label>
                          <Form.Control
                            placeholder={
                              this.state.model_show_violation_info.accurate
                            }
                            disabled
                          />
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "49%", paddingRight: "20px" }}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date & Time</Form.Label>
                          <Form.Control
                            placeholder={
                              this.state.model_show_violation_info
                                .violation_date +
                              " at " +
                              this.state.model_show_violation_info
                                .violation_time
                            }
                            disabled
                          />
                        </Form.Group>
                      </td>
                      <td style={{ width: "49%", paddingRight: "20px" }}>
                        <Form.Group className="mb-3">
                          <Form.Label>Report Status</Form.Label>
                          <Form.Control
                            placeholder={
                              this.state.model_show_violation_info
                                .current_status
                            }
                            disabled
                          />
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "49%", paddingRight: "20px" }}>
                        <Form.Group className="mb-3">
                          <Form.Label>Sensitivity</Form.Label>
                          <Form.Control
                            placeholder={this.state.model_show_violation_info.correct === -1 && (
                                "Pending"
                            )}
                            disabled
                          />
                        </Form.Group>
                      </td>
                      <td style={{ width: "49%", paddingRight: "20px" }}>
                        <Form.Group className="mb-3">
                          <Form.Label>AI Correct</Form.Label>
                          <Form.Control
                            placeholder={this.state.model_show_violation_info.correct === -1 && (
                                "Pending"
                                )}
                            disabled
                          />
                        </Form.Group>
                      </td>
                    </tr>
                  </table>
                </Form>
                

                <div className="Modal_verifier">
                  <img
                    src={
                      this.props.server +
                      "/show_violation_image/" +
                      this.state.model_show_violation_info.display_img
                    }
                    style={{
                      width: "45%",
                      height: "60%",
                      paddingTop: "5%",
                      marginLeft: "2%",
                    }}
                  />
                  <div
                    className="map_size"
                    style={{
                      width: "10%",
                      minWidth: "10%",
                      height: "40%",
                      paddingTop: "2%",
                      float: "right",
                      marginRight: "30%",
                      paddingBottom: "5%",
                    }}
                  >
                    <ModalMap
                      latlng={{
                        lat: this.state.model_show_violation_info.lat,
                        lng: this.state.model_show_violation_info.lng,
                      }}
                    />
                  </div>
                </div>

                {/* 
            <img
              src={
                "http://67.205.163.34:2626/show_violation_image/" +
                this.state.model_show_violation_info.display_img
              }
              style={{ width: "50%", height: "300px" }}
            /> */}

                <br />
                <br />
              </Modal.Body>

              <Modal.Footer onClick={this.hideModal}></Modal.Footer>
            </Modal>

            {/* Model Box Finsihs */}
          </div>
          <div className="pagination_style">
            <Stack spacing={2}>
              <Pagination
                count={this.state.show_pages}
                onChange={this.handleChange_P}
              />
            </Stack>
          </div>
        </Card>
      </div>
    );
  }
}
