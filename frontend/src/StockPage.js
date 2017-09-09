import React from "react";
import { Component } from "react";
import { PageHeader } from "react-bootstrap";
import Chart from "./Chart";

class StockPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: this.props.match.url.substring(1).toUpperCase(),
      data: []
    };

    fetch(`/get_stock?stock=${this.state.stock}`, {
      method: "GET"
    }).then(res => res.json())
      .then(json => {
        let res = json.result;
        console.log(res);
        res = res.map(e => {
          return {
            date: new Date(Date.parse(e.Date)),
            price: e.Close,
            volume: e.Volume,
            name: this.state.stock,
            high: e.High,
            low: e.Low
          };
        });

        res.reverse();
        this.setState({ data: res });
      });
  }

  render = () => {
    return (
      <div>
        <PageHeader>{ this.props.match.url.substring(1).toUpperCase() }</PageHeader>
        <Chart data={ this.state.data } />
      </div>
    );
  }
}

export default StockPage;
