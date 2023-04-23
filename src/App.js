import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './App.css';

import SideBar from './components/Sidebar';
import Orders from './pages/Orders';
import Profile from './components/Profile/Profile';
import Login from './components/Login/Login';
import LogoutIcon from './assets/icons/logout.svg';
import Signup from './components/SignUp/Signup';
import EmployeeRequest from './components/SignUp/EmployeeRequest';
import AccountCustomer from './components/Role/EmployeeRole/AccountCustomer';
import RegisterEmployee from './components/Role/AdminRole/RegisterEmployee/RegisterEmployee';
import ManageEmployee from './components/Role/AdminRole/RegisterEmployee/ManageEmployee';
import SuppliersMng from './components/Role/AdminRole/SuppliersMng';

function App() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setSidebarActive(false);
    setIsLogin(false);
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setSidebarActive(true);
      setIsLogin(true);
    } else {
      setSidebarActive(false);
    }
  }, sidebarActive)

  return (
    <Router>
      <div className="dashboard-container">
        <SideBar isLogin={isLogin}/>
        <div className="dashboard-body">
          <Routes>
            <Route path="*" element={<div></div>} />
            <Route exact path="/" element={<div></div>} />
            <Route exact path="/orders" element={<Orders />} />
            <Route exact path="/locations" element={<div></div>} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup/>} />
            <Route exact path="/employeerequest" element={<EmployeeRequest/>} />
            <Route exact path="/accountcustomer" element={<AccountCustomer/>} />
            <Route exact path="/registeremployee" element={<RegisterEmployee/>} />
            <Route exact path="/manageremployee" element={<ManageEmployee/>}/>
            <Route exact path='/suppliers' element={<SuppliersMng/>} />
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
