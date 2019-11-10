import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';

import AuthPage from './pages/AuthPage';
import EventsPage from './pages/EventsPage';
import BookingPage from './pages/BookingPage';

import HeaderComponent from './components/header/HeaderComponent';

function App() {
  return (
    <BrowserRouter>
        <HeaderComponent />
        <main>
          <Switch>
            <Redirect from="/" to="/auth" exact/>
            <Route path="/auth" component={AuthPage}/>
            <Route path="/events" component={EventsPage}/>
            <Route path="/booking" component={BookingPage}/>
          </Switch>
        </main>
    </BrowserRouter>
  );
}

export default App;
