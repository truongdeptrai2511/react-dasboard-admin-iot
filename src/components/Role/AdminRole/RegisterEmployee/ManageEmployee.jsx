import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { calculateRange, sliceData } from '../../../../utils/table-pagination';
import './styles.css';
import GetJwtTokenClaim from '../../../../utils/JwtTokenClaim';

function ManageEmployee() {
  // Define state variables
  const [error, setError] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [originalEmployeeList, setOriginalEmployeeList] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(false);
  const [search, setSearch] = useState('');
  const [updatedFields, setUpdatedFields] = useState({});
  // Get the JWT token claim
  const payload = GetJwtTokenClaim();

  // Fetch the list of employees from the API
  const handleGetListEmp = async () => {
    try {
      const url = 'https://localhost:7199/api/employee';
      const response = await axios.get(url, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      const employeeList = response.data;
      setOriginalEmployeeList(employeeList);
      setPagination(calculateRange(employeeList, 5));
      setEmployeeList(sliceData(employeeList, page, 5));
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete an employee from the list
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7199/api/Employee/id?id=${id}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setEmployeeList(employeeList.filter((employee) => employee.Id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  // Search for employees
  const handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== '') {
      const searchResults = originalEmployeeList.filter(
        (employee) =>
          employee.Id.toString().toLowerCase().includes(search.toLowerCase()) ||
          employee.FullName.toString().toLowerCase().includes(search.toLowerCase()) ||
          employee.Email.toString().toLowerCase().includes(search.toLowerCase())
      );
      setEmployeeList(searchResults);
      setPagination(calculateRange(searchResults, 5));
      setPage(1);
    } else {
      setEmployeeList(sliceData(originalEmployeeList, page, 5));
      setPagination(calculateRange(originalEmployeeList, 5));
    }
  };

  // Change the current page
  const handleChangePage = (newPage) => {
    setPage(newPage);
    setEmployeeList(sliceData(originalEmployeeList, newPage, 5));
  };

  // Update an employee's information
  const handleInputChange = (id, field, value) => {
    setEmployeeList((prevList) =>
      prevList.map((employee) =>
        employee.Id === id ? { ...employee, [field]: value } : employee
      )
    );
    setUpdatedFields((prevFields) => ({ ...prevFields, [id]: true }));
  };

  // Submit updated information to the API
  const handleSubmit = async (employee) => {
    try {
      if (updatedFields[employee.Id]) {
        const url = `https://localhost:7199/api/Employee/${employee.Id}`;
        const response = await axios.put(url, employee, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        
        // Update the employeeList state with the new data
        const updatedEmployeeList = employeeList.map((item) => {
          if (item.Id === employee.Id) {
            return {
              ...item,
              ...employee,
            };
          }
          return item;
        });
        setEmployeeList(updatedEmployeeList);
        
        // Reset the updatedFields state for the updated employee
        setUpdatedFields((prevFields) => ({ ...prevFields, [employee.Id]: false }));
      }
    } catch (error) {
      setError(error.message);
    }
  };
  

  // Load employee list when component mounts
  useEffect(() => {
    handleGetListEmp();
  }, []);
  return (
    <div className="manage-employee-container">
      <div className='manage-employee-header'>
        <h1>Manage Employee</h1>
        <input
          type='text'
          value={search}
          placeholder='Search..'
          className='register-employee-content-input'
          onChange={handleSearch}
        />
      </div>
      {employeeList.length > 0 ?
        <div className="employee-list">
          <table>
            <tbody>
              <tr>
                <th>Username</th>
                <th>FullName</th>
                <th>Email</th>
                <th>CitizenIdentification</th>
                <th>Action</th>
              </tr>
              {
                                Array.isArray(employeeList) && employeeList.map(request => (
                                    <tr key={request.Id}>
                                        <td style={{ maxWidth: "50px" }}>
                                            <input
                                                style={{width: "100px"}}
                                                className="input-info"
                                                type="text"
                                                value={request.UserName}
                                                onChange={(event) => handleInputChange(request.Id, "UserName", event.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="input-info"
                                                type="text"
                                                value={request.FullName}
                                                onChange={(event) => handleInputChange(request.Id, "FullName", event.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="input-info"
                                                type="text"
                                                value={request.Email}
                                                onChange={(event) => handleInputChange(request.Id, "Email", event.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="input-info"
                                                type="text"
                                                value={request.CitizenIdentification}
                                                onChange={(event) => handleInputChange(request.Id, "CitizenIdentification", event.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button className="btn-save" onClick={() => handleSubmit(request.Id)}>Save</button>
                                            <button className='btn-del' onClick={() => handleDelete(request.Id)}>x</button>
                                        </td>
                                    </tr>
                                ))}

            </tbody>
          </table>
        </div> : (
          <div style={{ padding: " 1em 0 0 1em" }}>No employee found.</div>
        )
      }
      {employeeList.length !== 0 ?
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
  )
}

export default ManageEmployee