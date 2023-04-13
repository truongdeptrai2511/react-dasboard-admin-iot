import React, {useEffect, useState} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import SideBarItem from './sidebar-item';

import JwtTokenClaim from '../../utils/JwtTokenClaim';
import './styles.css';

function SideBar ({ menu }) {
    const location = useLocation();
    const [active, setActive] = useState(1);
    const [isLogin, setIsLogin] = useState(false);
    const payload = JwtTokenClaim();

    console.log(payload);
    useEffect(() => {
        menu.forEach(element => {
            if (location.pathname === element.path) {
                setActive(element.id);
            }
        });
    }, [location.pathname])

    useEffect(() => {
        if (localStorage.getItem('token')) {
            console.log(localStorage.getItem('token'));
            setIsLogin(true);
        }
        else {
            setIsLogin(false);
        }
    },[isLogin])

    const formatName = (name) => {
        return decodeURIComponent(escape(name));
      };

    const __navigate = (id) => {
        setActive(id);
    }
    return(
        <nav className='sidebar'>
            <div className='sidebar-container'>
                <div className='sidebar-logo-container'>
                    <h1 style={{color:"white", textAlign:"center", fontFamily:"monospace", fontSize:"30px"}}>IoTStore</h1>
                </div>
                {isLogin && (
                    <div className='sidebar-user'>
                        <h4 style={{textAlign:"center"}}>
                            <Link to={'/profile'} 
                                style={
                                        {
                                            cursor:"pointer",
                                            color:"white", 
                                            textAlign:"center", 
                                            fontWeight:"bold", 
                                            textDecoration:"none"
                                        }
                                       }>Hello {formatName(payload?.fullName)}</Link></h4>
                    </div>
                )}
                <div className='sidebar-container'>
                    <div className='sidebar-items'>
                        {menu.map((item, index) => (
                            <div key={index} onClick={() => __navigate(item.id)}>
                                <SideBarItem
                                    active={item.id === active}
                                    item={item} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default SideBar;