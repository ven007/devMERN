import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './component/layout/Navbar';
import Landing from './component/layout/Landing';
import Register from './component/Auth/Register';
import Login from './component/Auth/Login';
import Alert from './component/layout/alert';
//redux

import { Provider } from 'react-redux';
import store from './store';

import './App.css';
const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />

        <Route exact path='/' component={Landing} />
        <section className='container'>
          <Alert />
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
