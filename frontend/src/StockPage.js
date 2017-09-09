import React from "react";
import { Component } from "react";
import { PageHeader } from "react-bootstrap";

class StockPage extends Component {
  constructor() {
    super();
    this.state = {
      prices: null
    };
  }

  render = () => {
    return (
      <div>
        <PageHeader>{ this.props.match.url.substring(1).toUpperCase() }</PageHeader>
      </div>
    );
  }
}

export default StockPage;
