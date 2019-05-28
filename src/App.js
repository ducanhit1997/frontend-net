import React, { Component } from 'react';
import './App.css';
import Nav from "./components/Menu/Nav";
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import CartProduct from './pages/CartProduct/CartProduct';
import Admin from './pages/Admin/Admin';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Nav/>
              <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path="/cart" component={CartProduct}/>
                <Route path="/admin" component={Admin}/>
                <Route path="*" component={NotFoundPage}/>
              </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
