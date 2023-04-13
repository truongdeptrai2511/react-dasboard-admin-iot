import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useHistory } from 'react-router-dom';

import SideBar from './components/Sidebar';
import sidebar_menu from './constants/sidebar-menu';

import './App.css';
import Orders from './pages/Orders';
import Profile from './components/Profile/Profile';
import Login from './components/Login/Login';
import sidebar_unauth from './constants/sidebar-unauth';
import LogoutIcon from './assets/icons/logout.svg';
import Signup from './components/SignUp/Signup';

function App() {
  const [sidebarActive, setSidebarActive] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setSidebarActive(false);
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setSidebarActive(true);
    } else {
      setSidebarActive(false);
    }
  }, sidebarActive)

  return (
    <Router>
      <div className="dashboard-container">
        <SideBar menu={sidebarActive ? sidebar_menu : sidebar_unauth} />
        <div className="dashboard-body">
          <Routes>
            <Route path="*" element={<div></div>} />
            <Route exact path="/" element={<div></div>} />
            <Route exact path="/orders" element={<Orders />} />
            <Route exact path="/locations" element={<div></div>} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup/>} />
          </Routes>
        </div>
        <div className="sidebar-footer">
          {sidebarActive && (
            <div>
              <span className="sidebar-item-label">
                <Link to="/" onClick={handleLogout} style={{color:"black", backgroundColor:"white", textDecoration:"none"}}>
                  Logout 
                  <img src={LogoutIcon} alt="icon-logout" className="sidebar-item-icon"/>
                </Link>
              </span>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
