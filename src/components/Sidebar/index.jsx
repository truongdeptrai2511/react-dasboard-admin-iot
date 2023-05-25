import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import SideBarItem from './sidebar-item';

import JwtTokenClaim from '../../utils/JwtTokenClaim';
import './styles.css';
import getSidebarMenu from '../../constants/sidebar-menu';

function SideBar(isLogin) {
  const location = useLocation();
  const [active, setActive] = useState(1);
  const payload = JwtTokenClaim();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const updateMenu = () => {
      if (payload !== null) {
        setMenu(getSidebarMenu(payload.role)); // Cập nhật menu
      } else {
        setMenu(getSidebarMenu('')); // Cập nhật menu
      }
    };

    updateMenu();
  }, [location.pathname]);

  useEffect(() => {
    const updateActive = () => {
      const newActive = menu.find((element) => location.pathname === element.path)?.id;
      if (newActive && newActive !== active) {
        setActive(newActive); // Cập nhật giá trị active
      }
    };
    updateActive();
  }, [location.pathname]);

  const formatName = (name) => {
    return decodeURIComponent(escape(name));
  };

  const navigate = (id) => {
    setActive(id); // Cập nhật giá trị active
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-logo-container">
          <h1 style={{ color: 'white', textAlign: 'center', fontFamily: 'monospace', fontSize: '30px' }}>
            IoTStore
          </h1>
        </div>
        {isLogin.isLogin ? (
          <div className="sidebar-user">
            <h4 style={{ textAlign: 'center' }}>
              <Link
                to="/profile"
                style={{
                  cursor: 'pointer',
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                }}
              >
                User {formatName(payload?.fullName)}
              </Link>
            </h4>
          </div>
        ) : ''}
        <div className="sidebar-container">
          <div className="sidebar-items">
            {menu.map((item, index) => (
              <div key={index} onClick={() => navigate(item.id)}>
                <SideBarItem active={item.id === active} item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
  
}

export default SideBar;
