import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Header";
import StockPage from "./StockPage";
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <Router>
    <div>
      <Header/>
      <div className="container">
        <Route path="/:stock" component={StockPage}/>
      </div>
    </div>
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
