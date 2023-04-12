import React from 'react';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import { useState } from "react"

import SideBar from './components/Sidebar';
import sidebar_menu from './constants/sidebar-menu';

import './App.css';
import Orders from './pages/Orders';
import Profile from './components/Profile/Profile';
import Login from './components/Login/Login';
import sidebar_unauth from './constants/sidebar-unauth';

function App () {
  const [active, setActive] = useState(false);
  if(localStorage.getItem("token") !== null)
  {
    setActive(true);
  }
  return(
    <Router>
      <div className='dashboard-container'>
          <SideBar menu={active ? sidebar_menu : sidebar_unauth}/>
          <div className='dashboard-body'>
              <Routes>
                  <Route path="*" element={<div></div>} />
                  <Route exact path="/" element={<div></div>} />
                  <Route exact path="/orders" element={< Orders/>} />
                  <Route exact path="/locations" element={<div></div>} />
                  <Route exact path="/profile" element={<Profile/>} />
                  <Route exact path="/login" element={<Login/>} />
              </Routes>
          </div>
      </div>
    </Router>
  )
}

export default App;