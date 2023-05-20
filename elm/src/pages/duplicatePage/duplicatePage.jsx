import React, { Component } from "react";
import "../global/style/style.css";
import TopNavbar from "../global/components/navbar";
import MiniDrawer from "../global/components/Sidebar";
import Card from "react-bootstrap/Card";
import { Button, Modal, Input } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Alert from 'react-bootstrap/Alert';
export default class DuplicatePage extends Component {
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
      show_danger_alert: false,
      vio_type_list: [{ name: "000000" }],
      street_list: [],
      show_uploading: false,

      show_model: false,
      model_show_violation_info: {
        'vio':{
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
      },
      'main':{
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
      }
    },
      filter:filter,
    };
    this.get_all_violations = this.get_all_violations.bind(this);
    this.show_filter = this.show_filter.bind(this);
    this.clear_filter = this.clear_filter.bind(this);
    
    this.handleChange_filter = this.handleChange_filter.bind(this);
    this.handleClose_danger_alert = this.handleClose_danger_alert.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);

    this.update_violation_duplicate = this.update_violation_duplicate.bind(this);

    this.get_all_violations(pagenum_, filter);
  }
  componentDidUpdate(prevProps, prevState) {
   
    if (!prevState.show_success_alert && this.state.show_success_alert) {
      
      const timer = setTimeout(() => {
        let temp = this.state.filter;
        let value = this.state.currentPage;
        window.location.href = "/duplicatepage?p="+value+"&filter="+temp;
      }, 2000);
    }
    
  }
  showModal = (para, main_vio) => (e) => {
    const com = this;
    const axios = require("axios").default;
    axios
      .get(this.props.server + "/get_single_violation_duplicate/" + para +"/"+main_vio)
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
  
  update_violation_duplicate = (para,main_id, duplicate) => (e) => {
    const com = this;
    const server = this.props.server;
    this.setState({show_uploading:true});
    const axios = require("axios").default;
    axios
      .get(this.props.server + "/update_duplicate/"+para+"/"+main_id+"/"+duplicate+"/"+sessionStorage.getItem("user_id"))
      .then(function (response) {
        if (response.data.result === 1) {
          
          com.setState({
            show_success_alert:true,
            show_uploading: false
          });
        } else if (response.data.result === 0) {
          
          com.setState({
            show_danger_alert:true,
            show_uploading:false
          });
        }
      });
  }

  hideModal = () => {
    this.setState({ show_model: false });
  };
 
  get_all_violations(page_count, filter) {
    const com = this;
    let v = "/"+sessionStorage.getItem("user_id")+"/"+page_count+"/"+filter;
    const axios = require("axios").default;
    axios
      .get(this.props.server + "/get_all_duplicate_violation"+v)
      .then(function (response) {
        com.setState({
          show_data: response.data.myData,
          show_pages: response.data.pages,
        });
      });
  }

  
  handleChange_P = (e, value) => {
    let temp = this.state.filter;
    window.location.href = "/duplicatepage?p="+value+"&filter="+temp;
  };
  show_filter() {
    let temp = this.state.filter;
    window.location.href = "/duplicatepage?p=1&filter="+temp;
  }

  clear_filter() {
    window.location.href = "/duplicatepage?p=1&filter=";
  }
  
  handleChange_filter(e) {
    this.setState({
      filter: e.target.value,
    });
  }
  handleClose_danger_alert() {
    this.setState({
      show_danger_alert: false
    });
  }

  render() {
    const calll = () => {
      const rows = this.state.show_data.map((x, index) => {
        return (
          <tr>
            <td>{x.violation_id}</td>
            <td>{x.super_violation_id}</td>
            <td>{x.violation_name}</td>
            <td>{x.street_name}</td>
            <td>{x.city}</td>
            <td>
              {x.violation_date} at {x.violation_time}
            </td>
            <td>{x.device_id}</td>
            <td>
              {" "}
              <Button
                variant="primary"
                style={{ height: "60%" }}
                onClick={this.showModal(x.violation_id, x.super_violation_id)}
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
            
            Duplicate Violations List
            
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
              

              <div style={{ flexBasis: "70%", marginLeft: "10px" }}>
              <div
                class="input-group mb-3"
                
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
              Type: Duplicate Case ID, Main Case ID, Violation Type,	Street,	City,	Date (YYYY-MM-DD)
            </div>
            <hr />
            <div class="row" style={{ paddingRight: "50px" }}>
              <div class="table-responsive ">
                <table class="table table-striped ">
                  <thead>
                    <tr>
                   
                      <th style={{ fontFamily: "Verdana" }}>
                        Duplicate Case ID{" "}
                      </th>
                      <th style={{ fontFamily: "Verdana" }}>
                        Main Case ID{" "}
                      </th>
                      <th style={{ fontFamily: "Verdana" }}>Type </th>
                      <th style={{ fontFamily: "Verdana" }}>Street </th>
                      <th style={{ fontFamily: "Verdana" }}>City </th>

                      <th style={{ fontFamily: "Verdana" }}>Date, Time</th>
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
                <Modal.Title>Duplicate Case Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              {this.state.show_success_alert ? (
        <Alert variant="success" dismissible>
          Violation updated! Refreshing Page in 2 sec.........
        </Alert>
      ) : null}
      {this.state.show_danger_alert ? (
        <Alert variant="danger" onClose={this.handleClose_danger_alert} dismissible>
          Violation update Failed! Try Again.........
        </Alert>
      ) : null}
                <div className="container d-flex justify-content-center align-items-center h-100">
                  <div className="row">
                    <div className="col-md-6">
                      <Card>
                        <Card.Header
                          style={{ fontWidth: "bold", fontSize: "20px" }}
                        >
                          Duplicate Violation #{this.state.model_show_violation_info.vio.violation_id}
                        </Card.Header>
                        <Form style={{ paddingTop: "5%" }}>
                          <table className="model_table_">
                            <tr className="model_table_row">
                              <td
                                style={{ width: "49%", paddingRight: "20px" }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Violation Type</Form.Label>
                                  <Form.Control
                                    placeholder={
                                      this.state.model_show_violation_info.vio
                                        .violation_name
                                    }
                                    disabled
                                  />
                                </Form.Group>
                              </td>
                            {/* </tr>
                            <tr className="model_table_row"> */}
                              <td
                                style={{ width: "49%", paddingRight: "20px" }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Street</Form.Label>
                                  <Form.Control
                                    placeholder={
                                      this.state.model_show_violation_info.vio
                                        .street_name
                                    }
                                    disabled
                                  />
                                </Form.Group>
                              </td>
                            </tr>
                          </table>

                          <table className="model_table_">
                            <tr className="model_table_row">
                              <td
                                style={{ width: "49%", paddingRight: "20px" }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Risk</Form.Label>
                                  <Form.Control
                                    placeholder={
                                      this.state.model_show_violation_info.vio.risk
                                    }
                                    disabled
                                  />
                                </Form.Group>
                              </td>
                              <td
                                style={{ width: "49%", paddingRight: "20px" }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Accurate</Form.Label>
                                  <Form.Control
                                    placeholder={
                                      this.state.model_show_violation_info.vio
                                        .accurate
                                    }
                                    disabled
                                  />
                                </Form.Group>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{ width: "49%", paddingRight: "20px" }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Date & Time</Form.Label>
                                  <Form.Control
                                    placeholder={
                                      this.state.model_show_violation_info.vio
                                        .violation_date +
                                      " at " +
                                      this.state.model_show_violation_info.vio
                                        .violation_time
                                    }
                                    disabled
                                  />
                                </Form.Group>
                              </td>
                              <td
                                style={{ width: "49%", paddingRight: "20px" }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Report Status</Form.Label>
                                  <Form.Control
                                    placeholder={
                                      this.state.model_show_violation_info.vio
                                        .current_status
                                    }
                                    disabled
                                  />
                                </Form.Group>
                              </td>
                            </tr>
                          </table>
                          <img
                              src={
                                this.props.server +
                                "/show_violation_image/" +
                                this.state.model_show_violation_info.vio.display_img
                              }
                              style={{
                                width: "98%",
                                height: "200px",
                                paddingTop: "2%",
                                marginLeft: "1%",
                                marginBottom: "1%",
                              }}
                          />
                        </Form>
                        {/* <div className="Modal_verifier">
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
                            height: "30%",
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
                      </div> */}
                      </Card>
                    </div>
                    <div className="col-md-6">
                      <Card>
                        <Card.Header
                          style={{ fontWidth: "bold", fontSize: "20px" }}
                        >
                          Main Violation #{this.state.model_show_violation_info.main.violation_id}
                        </Card.Header>
                        <Form style={{ paddingTop: "5%" }}>
                          <table className="model_table_">
                            <tr className="model_table_row">
                              <td
                                style={{ width: "49%", paddingRight: "20px" }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Violation Type</Form.Label>
                                  <Form.Control
                                    placeholder={
                                      this.state.model_show_violation_info.main
                                        .violation_name
                                    }
                                    disabled
                                  />
                                </Form.Group>
                              </td>
                            {/* </tr>
                            <tr className="model_table_row"> */}
                              <td
                                style={{ width: "49%", paddingRight: "20px" }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Street</Form.Label>
                                  <Form.Control
                                    placeholder={
                                      this.state.model_show_violation_info.main
                                        .street_name
                                    }
                                    disabled
                                  />
                                </Form.Group>
                              </td>
                            </tr>
                          </table>

                          <table className="model_table_">
                            <tr className="model_table_row">
                              <td
                                style={{ width: "49%", paddingRight: "20px" }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Risk</Form.Label>
                                  <Form.Control
                                    placeholder={
                                      this.state.model_show_violation_info.main.risk
                                    }
                                    disabled
                                  />
                                </Form.Group>
                              </td>
                              <td
                                style={{ width: "49%", paddingRight: "20px" }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Accurate</Form.Label>
                                  <Form.Control
                                    placeholder={
                                      this.state.model_show_violation_info.main
                                        .accurate
                                    }
                                    disabled
                                  />
                                </Form.Group>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{ width: "49%", paddingRight: "20px" }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Date & Time</Form.Label>
                                  <Form.Control
                                    placeholder={
                                      this.state.model_show_violation_info.main
                                        .violation_date +
                                      " at " +
                                      this.state.model_show_violation_info.main
                                        .violation_time
                                    }
                                    disabled
                                  />
                                </Form.Group>
                              </td>
                              <td
                                style={{ width: "49%", paddingRight: "20px" }}
                              >
                                <Form.Group className="mb-3">
                                  <Form.Label>Report Status</Form.Label>
                                  <Form.Control
                                    placeholder={
                                      this.state.model_show_violation_info.main
                                        .current_status
                                    }
                                    disabled
                                  />
                                </Form.Group>
                              </td>
                            </tr>
                           
                          </table>
                          <img
                              src={
                                this.props.server +
                                "/show_violation_image/" +
                                this.state.model_show_violation_info.main.display_img
                              }
                              style={{
                                width: "98%",
                                height: "200px",
                                paddingTop: "2%",
                                marginLeft: "1%",
                                marginBottom: "1%",
                              }}
                          />
                        </Form>
                        {/* <div className="Modal_verifier">
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
                            height: "30%",
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
                      </div> */}
                      </Card>
                    </div>
                    <center>{this.state.show_uploading && ("Updating Wait..........")}</center>
                    <div
                      className="verifier_action_buttons"
                      style={{ marginLeft: "35%", marginTop: "25px" }}
                    >
                      <h5
                        style={{
                          fontSize: "20px",
                          color: "#322D2C",
                          marginLeft: "-10rem",
                          marginTop: "8px",
                          marginRight: "1rem",
                        }}
                      >
                        Is this a duplicate case?
                      </h5>
                      <button
                        type="button"
                        class="btnn"
                        onClick={this.update_violation_duplicate(this.state.model_show_violation_info.vio.violation_id,this.state.model_show_violation_info.main.violation_id, 1)}
                        disabled={this.state.show_uploading}
                      >
                        Yes, it's a duplicate
                      </button>
                      <button
                        type="button"
                        class="btnn"
                        onClick={this.update_violation_duplicate(this.state.model_show_violation_info.vio.violation_id,this.state.model_show_violation_info.main.violation_id, 0)}
                        disabled={this.state.show_uploading}
                      >
                        No, it's not
                      </button>
                    </div>
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
