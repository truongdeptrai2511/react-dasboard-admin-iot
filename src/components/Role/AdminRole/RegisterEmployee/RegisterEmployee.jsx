import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './styles.css';

function RegisterEmployee() {
  const [error, setError] = useState("");
  const [employeeRequests, setEmployeeRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [employeeRequestsSearch, setEmployeeRequestsSearch] = useState(employeeRequests);

  const handleGetListEmployeeRequests = async () => {
    try {
      const url = "https://localhost:7199/api/auth/get-list-employee-requests";
      const { data: res } = await axios.get(url);
      setEmployeeRequests(res);
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete(id) {
    try {
      await axios.post(`https://localhost:7199/api/auth/reject/employee/${id}`);
      setEmployeeRequests(employeeRequests.filter(request => request.Id !== id));
    } catch (error) {
      setError(error.message);
    }
  }
  async function handleAccept(id) {
    try {
      await axios.post(`https://localhost:7199/api/auth/register/employee?EmployeeRequestId=${id}`);
      console.log(id);
      setEmployeeRequests(employeeRequests.filter(request => request.Id !== id));
    }
    catch (error) {
      setError(error.message);
    }
  }

    useEffect(() => {
      handleGetListEmployeeRequests();
    }, []);
    
    useEffect(() => {
      setEmployeeRequestsSearch(employeeRequests);
      console.log(employeeRequestsSearch);
    },[])

    // Search
    const handleSearch = (event) => {
      setSearch(event.target.value);
      if (event.target.value !== '') {
          let search_results = employeeRequestsSearch.filter((item) =>
              item.Id.toLowerCase().includes(search.toLowerCase()) ||
              item.Name.toLowerCase().includes(search.toLowerCase()) ||
              item.Email.toLowerCase().includes(search.toLowerCase())
          );
          setEmployeeRequestsSearch(search_results);
      }
      else {
          //__handleChangePage(1);
      }
      };

  return (
    <div className='register-request-container'>
      <div className="register-employee">
        <div className="table-request">
          <div className="table-request-header" style={{paddingLeft:"1em"}}>
            <h2>List of Employee Requests</h2>
          </div>
          <div className='register-employee-content-header'>
                    <div className='register-employee-content-search'>
                        <input
                            type='text'
                            value={search}
                            placeholder='Search..'
                            className='register-employee-content-input'
                            onChange={e => handleSearch(e)} />
                    </div>
                </div>
          {employeeRequests.length > 0 ? 
              <div className="employee-request-list">
                <table>
                  <tbody>
                      <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Action</th>
                      </tr>
                      {
                        employeeRequests.map(request => (
                        <tr key={request.Id}>
                            <td>{request.Id}</td>
                            <td>{request.Name}</td>
                            <td>{request.Email}</td>
                            <td>
                            <button className='btn-action' onClick={()=>handleDelete(request.Id)} style={{display:"block"}}>Reject</button>
                            <button className='btn-action' onClick={()=>handleAccept(request.Id)}>Accept</button>
                            </td>
                        </tr>
                      ))}
                  </tbody>
                </table>    
              </div> :  (
                          <div style={{padding:" 1em 0 0 1em"}}>No employee requests found.</div>
                        )
          }
        </div>
      </div>      
    </div>
  );
}
  
  export default RegisterEmployee;