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
import CategoryMng from './components/Role/AdminRole/CategoryMng';
import ProductsMng from './components/Role/EmployeeRole/Products';
import RegisterAdmin from './components/Role/AdminRole/RegisterAdmin';

function App() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setSidebarActive(false);
    setIsLogin(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setSidebarActive(true);
      setIsLogin(true);
    } else {
      setSidebarActive(false);
    }
  }, []);

  return (
    <Router>
      <div className="dashboard-container">
        <SideBar isLogin={isLogin} />
        <div className="dashboard-body">
          <Routes>
            <Route path="*" element={<Login/>} />
            <Route exact path="/" element={<></>} />
            <Route exact path="/orders" element={<Orders />} />
            <Route exact path="/locations" element={<div></div>} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/employeerequest" element={<EmployeeRequest />} />
            <Route exact path="/accountcustomer" element={<AccountCustomer />} />
            <Route exact path="/registeremployee" element={<RegisterEmployee />} />
            <Route exact path="/manageremployee" element={<ManageEmployee />} />
            <Route exact path='/suppliers' element={<SuppliersMng />} />
            <Route exact path='/category' element={<CategoryMng />} />
            <Route exact path="products" element={<ProductsMng />} />
            <Route exact path='/registeradmin' element={<RegisterAdmin />} />
          </Routes>
        </div>
        <div className="sidebar-footer">
          {sidebarActive && (
            <div>
              <span className="sidebar-item-label">
                <Link
                  to="/login"
                  onClick={handleLogout}
                  style={{ color: 'black', backgroundColor: 'white', textDecoration: 'none' }}
                >
                  Logout
                  <img src={LogoutIcon} alt="icon-logout" className="sidebar-item-icon" />
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
