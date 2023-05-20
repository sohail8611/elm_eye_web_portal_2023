import React, { Component } from "react";
import "../global/style/style.css";
import TopNavbar from "../global/components/navbar";
import MiniDrawer from "../global/components/Sidebar";
import Card from "react-bootstrap/Card";
import { Button, Modal, Input } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import ModalMap from "../global/components/ModelMap";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import {base64DecToArr} from './base64_decode.js';

import Alert from 'react-bootstrap/Alert';

export default class AllViolations extends Component {
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
      show_success_alert: false,
      show_success_alert_msg: "",
      show_danger_alert: false,
      show_danger_alert_msg: "",
      show_danger_empty_alert: false,
      show_danger_empty_alert_msg: "",
      vio_type_list: [{ name: "000000" }],
      street_list: [],
      show_uploading: false,

      show_model: false,
      model_show_violation_info: {
        violation_id: 0,
        violation_type_id: 0,
        violation_name: "",
        street_id: 0,
        street_name: "None",
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
        new_street_name: "None",
        sensitivity: -1
      },
      filter:filter,
      
    };
    this.get_all_violations = this.get_all_violations.bind(this);
    this.get_csv_all_violation = this.get_csv_all_violation.bind(this);
    this.show_filter = this.show_filter.bind(this);
    this.clear_filter = this.clear_filter.bind(this);
    this.handleChange_filter = this.handleChange_filter.bind(this);
  
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleClose_success_alert = this.handleClose_success_alert.bind(this);
    this.handleClose_danger_alert = this.handleClose_danger_alert.bind(this);
    this.handleClose_danger_empty_alert = this.handleClose_danger_empty_alert.bind(this);

    this.update_violation_cor = this.update_violation_cor.bind(this);
    this.update_violation_incor = this.update_violation_incor.bind(this);
    this.change_violation_type_vio = this.change_violation_type_vio.bind(this);
    this.change_street_vio = this.change_street_vio.bind(this);
    this.change_vio_sensitivity = this.change_vio_sensitivity.bind(this);
    this.get_all_violations(pagenum_, filter);
  }
  componentDidUpdate(prevProps, prevState) {
   
    if (!prevState.show_success_alert && this.state.show_success_alert) {
      
      const timer = setTimeout(() => {
        let temp = this.state.filter;
        let value = this.state.currentPage;
        window.location.href = "/allviolations?p="+value+"&filter="+temp;
      }, 2000);
    }
    if (!prevState.show_danger_alert && this.state.show_danger_alert) {
      
      // const timer = setTimeout(() => {
      //   let temp = this.state.filter;
      //   let value = this.state.currentPage;
      //   window.location.href = "/allviolations?p="+value+"&filter="+temp;
      // }, 2000);
    }
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
          show_uploading: false,
          show_success_alert: false,
          show_danger_alert: false
        });
      });
  };
  update_violation_cor() {
    const com = this;
    console.log(this.state.model_show_violation_info.street_name);
    console.log(this.state.model_show_violation_info.street_name);
    if (
      this.state.model_show_violation_info.street_name.localeCompare("None") == 0 &&
      this.state.model_show_violation_info.new_street_name.localeCompare("None") == 0
    ) {
      this.setState({
        show_danger_empty_alert: true,
        show_danger_empty_alert_msg:"To make it Correct you need to Select Street!"
      });
    } else if (
      this.state.model_show_violation_info.violation_type_id == 0 &&
      this.state.model_show_violation_info.new_violation_type_id == 0
    ) {
      this.setState({
        show_danger_empty_alert: true,
        show_danger_empty_alert_msg:"To make it Correct you need to Select Violation Type!"
      });
    }else if(this.state.model_show_violation_info.sensitivity == -1){
      this.setState({
        show_danger_empty_alert: true,
        show_danger_empty_alert_msg:"To make it Correct you need to Select Sensitivity!"
      });
    } 
    else {
      const server = this.props.server;
      const axios = require("axios").default;
      
      this.setState({ show_uploading: true });
      axios
        .post(this.props.server + "/update_violation_for_verify", {
          user_id: sessionStorage.getItem("user_id"),
          violation_id: this.state.model_show_violation_info.violation_id,
          updated_vio_id:
            this.state.model_show_violation_info.new_violation_type_id,
          updated_street_id: this.state.model_show_violation_info.new_street_id,
          cor: 1,
          sensitivity: this.state.model_show_violation_info.sensitivity, 
        })
        .then(function (response) {
          com.setState({ show_uploading: false });
          if (response.data.result === 1) {
            com.setState({
              show_success_alert:true,
              show_success_alert_msg: "Violation updated! Refreshing Page in 2 sec........."
            });
          }else if (response.data.result === 2) {
            
            com.setState({
              show_success_alert:true,
              show_success_alert_msg: "Violation updated as Duplicated! Refreshing Page in 2 sec........."
            });
          } else if (response.data.result === 0) {
            com.setState({
              show_danger_alert:true,
              show_danger_alert_msg: "Violation update Failed! Try Again........."
            });
          }
        });
    }
  }
  update_violation_incor() {
    const com = this;
    const server = this.props.server;
    const axios = require("axios").default;
    axios
      .post(this.props.server + "/update_violation_for_verify", {
        user_id: sessionStorage.getItem("user_id"),
        violation_id: this.state.model_show_violation_info.violation_id,
        updated_vio_id:
          this.state.model_show_violation_info.new_violation_type_id,
        updated_street_id: this.state.model_show_violation_info.new_street_id,
          cor: 0,
          sensitivity: this.state.model_show_violation_info.sensitivity,
      })
      .then(function (response) {
        if (response.data.result === 1) {
          
          com.setState({
            show_success_alert:true,
            show_success_alert_msg: "Violation updated! Refreshing Page in 2 sec........."
          });

          
   
        } else if (response.data.result === 0) {
          
          com.setState({
            show_danger_alert:true,
            show_danger_alert_msg: "Violation update Failed! Try Again........."
          });
        }
      });
  }
  change_violation_type_vio = (e) => {
    let temp = this.state.model_show_violation_info;
    temp.new_violation_type_id = e.target.value;
    this.setState({ model_show_violation_info: temp });
  };
  change_street_vio = (e) => {
    let temp = this.state.model_show_violation_info;
    temp.new_street_id = e.target.value;
    var index = e.target.selectedIndex;
    temp.new_street_name = e.target[index].text;
    
    this.setState({ model_show_violation_info: temp });
  };
  hideModal = () => {
    this.setState({ show_model: false });
  };
  
  get_all_violations(page_count, filter) {
    let v = "/"+sessionStorage.getItem("user_id")+"/"+page_count+"/"+filter;
    
    const com = this;
    const axios = require("axios").default;
    axios
      .get(this.props.server + "/get_all_violation"+v)
      .then(function (response) {
        com.setState({
          
          show_data: response.data.myData,
          show_pages: response.data.pages,
          vio_type_list: response.data.vio,
          street_list: response.data.street_list,
        });
      });
  }

get_csv_all_violation() {
  let v = "/"+sessionStorage.getItem("user_id")+"/"+this.state.filter;
    
    const com = this;
    const axios = require("axios").default;
    axios
      .get(this.props.server + "/get_csv_all_violation"+v)
      .then(function (response) {
        
        var bufferExcelFile = base64DecToArr( response.data.data[0] ).buffer;
        const blobExcelFile = new Blob( [ bufferExcelFile ] );
        const url = window.URL.createObjectURL( blobExcelFile );
        const hiddenAnchor = document.createElement( "a" );
        hiddenAnchor.style.display = "none";
        hiddenAnchor.href = url;
        hiddenAnchor.download = response.data.name;
        document.body.appendChild( hiddenAnchor );
        hiddenAnchor.click();
        window.URL.revokeObjectURL( url );
      });
  }
  handleChange_P = (e, value) => {
    let temp = this.state.filter;
    window.location.href = "/allviolations?p="+value+"&filter="+temp;
  };
  show_filter() {
    let temp = this.state.filter;
    window.location.href = "/allviolations?p=1&filter="+temp;
  }

  clear_filter() {
    window.location.href = "/allviolations?p=1&filter=";
  }
  
  
  handleChange_filter(e) {
    this.setState({
      filter: e.target.value,
    });
  }

  change_vio_sensitivity = (e) => {
    
    const temp = parseInt(e.target.value);
    this.state.model_show_violation_info.sensitivity = temp;
    
  };


  handleClose_success_alert() {
    this.setState({
      show_success_alert: false
    });
  }
  handleClose_danger_alert() {
    this.setState({
      show_danger_alert: false
    });
  }
  handleClose_danger_empty_alert() {
    this.setState({
      show_danger_empty_alert: false
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
    const xyz = this.state.street_list.filter((i) => {
      return i.city === this.state.model_show_violation_info.city
  });
    return (
      <div>
        
        <MiniDrawer />
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
                style={{ flexbasis: "60%", marginLeft: "10px" }}
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
              <button
                type="button"
                class="btn btn-success mb-3"
                onClick={() => {this.get_csv_all_violation();}}
                style={{ width: "300px" }}
              >
                Get CSV{" "}
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
                      <th style={{ fontFamily: "Verdana" }}>Date, Time</th>
                      <th style={{ fontFamily: "Verdana" }}>
                        Correct?
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
              {this.state.show_success_alert ? (
        <Alert variant="success" onClose={this.handleClose_success_alert} dismissible>
          {this.state.show_success_alert_msg}
        </Alert>
      ) : null}
      {this.state.show_danger_alert ? (
        <Alert variant="danger" onClose={this.handleClose_danger_alert} dismissible>
          {this.state.show_danger_alert_msg}
        </Alert>
      ) : null}
      {this.state.show_danger_empty_alert ? (
        <Alert variant="danger" onClose={this.handleClose_danger_empty_alert} dismissible>
          {this.state.show_danger_empty_alert_msg}
        </Alert>
      ) : null}
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
                      {this.state.model_show_violation_info.correct == -1 && (
                        <td style={{ width: "49%", paddingRight: "20px" }}>
                          <Form.Group className="mb-3">
                            <Form.Label>Change to</Form.Label>
                            <Form.Select
                              class="violation_select"
                              aria-label="Default select example"
                              onChange={this.change_violation_type_vio}
                            >
                              <option
                                value={
                                  this.state.model_show_violation_info
                                    .violation_type_id
                                }
                              >
                                {
                                  this.state.model_show_violation_info
                                    .violation_name
                                }
                              </option>
                              {this.state.vio_type_list.map((h) => (
                                <option value={h.vio_id}>{h.name}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </td>
                      )}
                    </tr>
                    <tr className="model_table_row">
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
                      
                      {this.state.model_show_violation_info.correct == -1 && (
                        <td style={{ width: "49%", paddingRight: "20px" }}>
                          <Form.Group className="mb-3">
                            <Form.Label>Change to</Form.Label>
                            <Form.Select
                              class="violation_select"
                              aria-label="Default select example"
                              onChange={this.change_street_vio}
                            >
                              <option
                                value={
                                  this.state.model_show_violation_info.street_id
                                }
                              >
                                {
                                  this.state.model_show_violation_info
                                    .street_name
                                }
                              </option>
                              { 
                              xyz.map((h) => (
                                <option value={h.street_id}>
                                  {h.street_name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </td>
                      )}
                    </tr>
                  </table>
                  <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            placeholder={
                              this.state.model_show_violation_info.city
                            }
                            disabled
                          />
                        </Form.Group>
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
                  </table>
                </Form>
                <div style={{ marginLeft: "40%", marginTop: "10px" }}>
                  <label>
                    {this.state.show_uploading && "Updating Wait......"}
                  </label>
                </div>
                {this.state.model_show_violation_info.correct === -1 && (
                  <div>
                    <div
                      className="verifier_action_buttons"
                      style={{ marginLeft: "35%", marginTop: "10px" }}
                    >
                      <h5
                        style={{
                          fontSize: "20px",
                          color: "#322D2C",
                          marginTop: "8px",
                          marginLeft: "-5rem",
                          marginRight: "1rem",
                        }}
                      >
                        Confirm Sensitivity
                      </h5>
                      <FormControl>
                        {/* <FormLabel id="demo-row-radio-buttons-group-label">
                          Gender
                        </FormLabel> */}
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          onChange={this.change_vio_sensitivity}
                          disabled = {this.state.show_uploading}
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="YES"
                            disabled = {this.state.show_uploading}
                          />
                          <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="NO"
                            disabled = {this.state.show_uploading}
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <div
                      className="verifier_action_buttons"
                      style={{ marginLeft: "35%", marginTop: "10px" }}
                    >
                      <h5
                        style={{
                          fontSize: "20px",
                          color: "#322D2C",
                          marginLeft: "-5rem",
                          marginTop: "8px",
                          marginRight: "1rem",
                        }}
                      >
                        AI Button
                      </h5>
                      <button
                        type="button"
                        class="btnn"
                        onClick={this.update_violation_cor}
                        disabled={this.state.show_uploading}
                      >
                        Correct
                      </button>
                      <button
                        type="button"
                        class="btnn"
                        onClick={this.update_violation_incor}
                        disabled={this.state.show_uploading}
                      >
                        Incorrect
                      </button>
                    </div>
                    
                  </div>
                )}

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
                defaultPage={this.state.currentPage}
              />
            </Stack>
          </div>
        </Card>
      </div>
    );
  }
}
