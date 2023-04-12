import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import SideBarItem from './sidebar-item';

import './styles.css';

function SideBar ({ menu }) {
    const location = useLocation();
    const [active, setActive] = useState(1);

    useEffect(() => {
        menu.forEach(element => {
            if (location.pathname === element.path) {
                setActive(element.id);
            }
        });
    }, [location.pathname])

    const __navigate = (id) => {
        setActive(id);
    }
    return(
        <nav className='sidebar'>
            <div className='sidebar-container'>
                <div className='sidebar-logo-container'>
                    <h1 style={{color:"white", textAlign:"center", fontFamily:"monospace", fontSize:"30px"}}>IoTStore</h1>
                </div>

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