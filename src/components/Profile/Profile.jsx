import { useState, useEffect } from "react";
import styles from './styles.scss';
import JwtTokenClaim from '../../utils/JwtTokenClaim';
import UserProfile from '../../assets/icons/userprofileicon.png'
import ResetPassword from "./ResetPassword";
function Profile () {
    const [isLogin, setIsLogin] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const payload = JwtTokenClaim();
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
    const handleShowChange = () => {
        setShowChangePassword(!showChangePassword);
    }
    return (
        <div className="profile_container">
            <h2 style={{textAlign:"center"}}>Profile user</h2>
            <div className={styles.profile_form_container}>
                <img alt="profile" src={UserProfile} style={{width:"100px", height:"100px"}}/>
                <ul className="list_group">
                    <li className="list_group_item">
                        <span>Fullname: </span>{formatName(payload?.fullName)}
                    </li>
                    <li className="list_group_item">
                        <span>Email: </span>{formatName(payload?.email)+ "@gmail.com"}
                    </li>
                    <li className="list_group_item">
                        <span>Permission: </span>{formatName(payload?.role)}
                    </li>
                    <li className="list_group_item">
                        <span>Password: </span>
                        <a onClick={handleShowChange} style={{textDecoration:"none", paddingLeft:"10px", color:"#4da6ff", paddingBottom:"10px", cursor:"pointer"}}>Click to change password</a>
                        {showChangePassword && <ResetPassword />}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Profile