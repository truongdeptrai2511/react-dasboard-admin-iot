import React, { useState } from 'react';
import axios from 'axios';

function RegisterEmployee() {
  const [error, setError] = useState("");
  const [employeeRequests, setEmployeeRequests] = useState([]);

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

  return (
    <div className="register-employee">
      <div className="table-request">
        <div className="table-request-header">
          <button onClick={handleGetListEmployeeRequests}>Get List Employee Requests</button>
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
                {employeeRequests.map(request => (
                <tr key={request.Id}>
                    <td>{request.Id}</td>
                    <td>{request.Name}</td>
                    <td>{request.Email}</td>
                    <td>
                    <button onClick={()=>handleDelete(request.Id)}>Reject</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>    
        </div> : (
                    <div>No employee requests found.</div>
                )
        }
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
  
  export default RegisterEmployee;