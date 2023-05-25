import { useState, useEffect } from "react";

function GetJwtTokenClaim() {
  const token = localStorage.getItem('token');
  const [fullName, setfullName] = useState('')

  useEffect (() => {
    if(token !== null)
    {
      setfullName(localStorage.getItem('fullName'));
      const decodedFullName = decodeURIComponent(escape(fullName));
      
      return setfullName(decodedFullName);
    }
  },[])

  if (!token) {
    return null;
  }

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error('Failed to parse JWT token claim', error);
    return null;
  }
}

export default GetJwtTokenClaim;
