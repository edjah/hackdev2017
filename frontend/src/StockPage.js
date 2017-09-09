import React from "react";
import { Component } from "react";
import { PageHeader, Table, Col, FormControl } from "react-bootstrap";
import Chart from "./Chart";
import { Link } from "react-router-dom";
import { stringify } from "qs";

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
          this.setState({ correlations: json.correlations.reverse() });
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
      correlations: [],
      search: "",
      searchData: []
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

  _handleChange = e => {
    this.setState({ search: e.target.value });
  }

  _handleKeyPress = e => {
    if (e.key === "Enter") {
      let symbol = this.state.stock;

      let keywords = this.state.search.split(/\s+/);

      console.log(keywords);
      if (keywords.length < 1 || (keywords.length == 1 && keywords[0] === "")) {
        this.setState({ searchData: [] });
        return;
      }

      let keywordString = [];

      for (let i = 0; i < keywords.length; i++) {
        keywordString.push(`keywords=${keywords[i]}`);
      }

      keywordString = keywordString.join("&");

      console.log(keywordString);
      fetch(`/trends?${keywordString}&symbol=${symbol}`, {
        method: "GET"
      }).then(res => res.json())
        .then(json => {
          console.log(json);

          let keywords = json.keywords;

          let temp = []
          for (let keyword in keywords) {
            let i = keywords[keyword].data.map(e => {
              return {
                date: new Date(Date.parse(e.Date)),
                price: e.Score,
                name: keyword
              };
            });
            console.log(i);
            temp.push(i);
          }

          console.log(temp);

          this.setState({ searchData: temp });

          console.log(this.state.dataArray.concat(this.state.searchData));
        });
    }
  }
  render = () => {
    return (
      <div>
        <PageHeader>{ this.props.match.url.substring(1).toUpperCase() }</PageHeader>
        <Chart data={ this.state.dataArray.concat(this.state.searchData) } />
        <Col xs={8}>
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
                    <td><Link to={`/${e.symbol}`}>{e.symbol}</Link></td>
                    <td><Link to={`/${e.symbol}`}>{e.name}</Link></td>
                    <td>{e.corr}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
        <Col xs={4}>
          <h1>Google Trends</h1>
          <FormControl type="text" onKeyPress={this._handleKeyPress} onChange={this._handleChange} value={this.state.search} placeholder="Keywords" />
        </Col>
      </div>
    );
  }
}

export default StockPage;
