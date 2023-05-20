import { React, Component } from "react";
import "../global/style/style.css";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";

class TopNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Navbar
          className="dashboard_navbar"
          bg="dark"
          variant="dark"
          fixed="top"
        >
          <Navbar.Brand className="dashboard_navbar_logo">
            <Form.Label htmlFor="inputPassword5">Eye</Form.Label>
          </Navbar.Brand>
        </Navbar>
      </div>
    );
  }
}
export default TopNavbar;
