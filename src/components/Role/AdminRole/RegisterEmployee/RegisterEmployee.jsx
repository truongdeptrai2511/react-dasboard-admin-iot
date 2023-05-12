import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { calculateRange, sliceData } from "../../../../utils/table-pagination";
import './styles.css';

function RegisterEmployee() {
  const [error, setError] = useState("");
  const [employeeRequests, setEmployeeRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [originalEmployeeRequests, setOriginalEmployeeRequests] = useState([]);

  const handleGetListEmployeeRequests = async () => {
    try {
      const url = "https://localhost:7199/api/auth/get-list-employee-requests";
      const { data: res } = await axios.get(url);
      setEmployeeRequests(res);

      setOriginalEmployeeRequests(res);
      setPagination(calculateRange(res, 5));
      setEmployeeRequests(sliceData(res, page, 5));
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
  function handleAccept(id) {
    try {
      axios.post(`https://localhost:7199/api/auth/register/employee?EmployeeRequestId=${id}`);
      console.log(id);
      setEmployeeRequests(employeeRequests.filter(request => request.Id !== id));
    }
    catch (error) {
      setError(error.message);
    }
  }



  useEffect(() => {
    handleGetListEmployeeRequests();
    setPagination(calculateRange(employeeRequests, 5));
    setEmployeeRequests(sliceData(employeeRequests, page, 5));
  }, []);

  // Search
  const handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== '') {
      let search_results = originalEmployeeRequests.filter((item) =>
        item.Id.toString().toLowerCase().includes(search.toLowerCase()) ||
        item.Name.toString().toLowerCase().includes(search.toLowerCase()) ||
        item.Email.toString().toLowerCase().includes(search.toLowerCase())
      );
      setEmployeeRequests(search_results);
      setPagination(calculateRange(search_results, 5));
      setPage(1);
    }
    else {
      setEmployeeRequests(sliceData(originalEmployeeRequests, page, 5));
      setPagination(calculateRange(originalEmployeeRequests, 5));
    }
  };

  // Change Page 
  const handleChangePage = (new_page) => {
    setPage(new_page);
    setEmployeeRequests(sliceData(originalEmployeeRequests, new_page, 5));
  }

  return (
    <div className='register-request-container'>
      <div className="register-employee">
        <div className="table-request">
          <div className="table-request-header" style={{ paddingLeft: "1em", display: "flex" }}>
            <h2>Employee Requests</h2>
            <input
              type='text'
              value={search}
              placeholder='Search..'
              className='register-employee-content-input'
              onChange={e => handleSearch(e)} />
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
                          <button className='btn-action' onClick={() => handleDelete(request.Id)} style={{ display: "block", marginBottom: "0.5em", backgroundColor:"red" }}>Reject</button>
                          <button className='btn-action' onClick={() => handleAccept(request.Id)}>Accept</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div> : (
              <div style={{ padding: " 1em 0 0 1em" }}>No employee requests found.</div>
            )
          }
        </div>
        {employeeRequests.length !== 0 ?
          <div className='dashboard-content-footer'>
            {pagination.map((item, index) => (
              <span
                key={index}
                className={item === page ? 'active-pagination' : 'pagination'}
                onClick={() => handleChangePage(item)}>
                {item}
              </span>
            ))}
          </div>
          :
          <div className='dashboard-content-footer'>
            <span className='empty-table'>No data</span>
          </div>
        }
      </div>
    </div>
  );
}

export default RegisterEmployee;