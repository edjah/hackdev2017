import React from "react";
import { Component } from "react";
import { Navbar, FormGroup, FormControl, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import logo from "./jensho.png";
class Header extends Component {
  constructor() {
    super();
    this.state = {
      stock: ""
    };
  }

  _handleChange = (e) => {
    this.setState({ stock: e.target.value.toLowerCase() });
  }

  _handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.props.history.push(`/${this.state.stock}`)
      this.setState({ stock: "" });
    }
  }

  _onClick = () => {
    this.props.history.push(`/${this.state.stock}`)
    this.setState({ stock: "" });
  }

  render = () => {
    return (
      <Navbar staticTop={true}>
        <Navbar.Header>
          <Navbar.Brand>
            <img src={logo} alt="Jensho"/>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Form pullLeft>
            <FormGroup>
              <FormControl type="text" onKeyPress={this._handleKeyPress} onChange={this._handleChange} value={this.state.stock} placeholder="Search" />
            </FormGroup>
            {' '}
            <Button onClick={this._onClick} type="submit">Submit</Button>
          </Navbar.Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(Header);
