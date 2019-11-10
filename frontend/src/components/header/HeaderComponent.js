import React from 'react';
import { NavLink } from 'react-router-dom';

import './HeaderComponent.css';

const headerComponent = props => (
    <header className="main-navigation">
        <div className="main-navigation__logo">
            <h1>myEventBook</h1>
        </div>
        <nav className="main-navigation__item">
            <ul>
                <li>
                    <NavLink to="/events">Events</NavLink>
                </li>
                <li>
                    <NavLink to="/booking">Bookings</NavLink>
                </li>
                <li>
                    <NavLink to="/auth">Login</NavLink>
                </li>
            </ul>
        </nav>
    </header>
);

export default headerComponent;