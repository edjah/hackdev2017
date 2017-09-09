import React from "react";
import { Component } from "react";
import { PageHeader, Checkbox, Table } from "react-bootstrap";
import Chart from "./Chart";

class StockPage extends Component {
  addStock = (symbol, init) => {
    fetch(`/get_stock?symbol=${symbol}`, {
      method: "GET"
    }).then(res => {
        console.log(res);
        return res.json();
      })
      .then(json => {
        console.log(json);
        if (init) {
          this.setState({ correlations: json.correlations });
        }
        let res = json.chart;
        console.log(res);
        res = res.map(e => {
          return {
            date: new Date(Date.parse(e.Date)),
            price: e.Close,
            volume: e.Volume,
            name: symbol,
            high: e.High,
            low: e.Low
          };
        });

        res.reverse();

        let dataCopy = {...this.state.data};

        dataCopy[symbol] = res;
        this.setState({ data: dataCopy });
        console.log(dataCopy);

        let temp = [];
        for (let k in dataCopy) {
            if (dataCopy.hasOwnProperty(k)) {
               temp.push(dataCopy[k]);
            }
        }

        console.log(temp);
        this.setState({ dataArray: temp });
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      stock: this.props.match.url.substring(1).toUpperCase(),
      data: {},
      dataArray: [],
      correlations: []
    };

    this.addStock(this.state.stock, true);
  }

  _handleClick = (symbol) => {
    if (symbol in this.state.data) {
      delete this.state.data[symbol];
      let dataCopy = {...this.state.data};
      let temp = [];
        for (let k in dataCopy) {
            if (dataCopy.hasOwnProperty(k)) {
               temp.push(dataCopy[k]);
            }
        }

        console.log(temp);
        this.setState({ dataArray: temp });
    } else {
      this.addStock(symbol, false);
    }
  }

  render = () => {
    return (
      <div>
        <PageHeader>{ this.props.match.url.substring(1).toUpperCase() }</PageHeader>
        <Chart data={ this.state.dataArray } />
        <Table striped condensed>
          <thead>
            <tr>
              <th/>
              <th>Symbol</th>
              <th>Company</th>
              <th>Correlation</th>
            </tr>
          </thead>
          <tbody>
            {this.state.correlations.map(e => {
              return (
                <tr key={e.symbol}>
                  <td><input type="checkbox" onClick={() => this._handleClick(e.symbol)} /></td>
                  <td>{e.symbol}</td>
                  <td>{e.name}</td>
                  <td>{e.corr}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default StockPage;
