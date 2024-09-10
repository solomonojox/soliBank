import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Styles/SideBar.css'

const Sidebar = () => {
    return (
      <div className="sidebar">
        <ul>
          <li>
            <NavLink to="/dashboard" activeClassName="active">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/deposit" activeClassName="active">
              Deposit
            </NavLink>
          </li>
          <li>
            <NavLink to="/request" activeClassName="active">
              Request
            </NavLink>
          </li>
          <li>
            <NavLink to="/transfer" activeClassName="active">
              Transfer Funds
            </NavLink>
          </li>
          <li>
            <NavLink to="/logout" activeClassName="active">
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
    );
};

export default Sidebar;