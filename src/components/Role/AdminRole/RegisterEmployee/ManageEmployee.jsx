import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { calculateRange, sliceData } from "../../../../utils/table-pagination";
import './styles.css';
import GetJwtTokenClaim from "../../../../utils/JwtTokenClaim"

function ManageEmployee() {
    //#region Constants
    const [error, setError] = useState("");
    const [employeeList, setEmployeeList] = useState([]);
    const payload = GetJwtTokenClaim();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState([]);
    const [originalEmployeeList, setOriginalEmployeeList] = useState([]);
    const [reload, setReload] = useState(false);
    //#endregion Constants

    const handleGetListEmp = async () => {
        try {
            const url = "https://localhost:7199/api/employee";
            const { data: res } = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            setOriginalEmployeeList(res);
            setPagination(calculateRange(res, 5));
            setEmployeeList(sliceData(res, page, 5));
        } catch (error) {
            setError(error.message);
        }
    }

    async function handleDelete(id) {
        try {
            await axios.delete(`https://localhost:7199/api/Employee/id?id=${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            setEmployeeList(employeeList.filter(request => request.Id !== id));
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        handleGetListEmp();
    }, [])
    useEffect(() => {
        setPagination(calculateRange(originalEmployeeList, 5));
        setEmployeeList(sliceData(originalEmployeeList, page, 5));
    }, [originalEmployeeList, page]);    

    // Search
    const handleSearch = (event) => {
        setSearch(event.target.value);
        if (event.target.value !== '') {
            let search_results = originalEmployeeList.filter((item) =>
                item.Id.toString().toLowerCase().includes(search.toLowerCase()) ||
                item.FullName.toString().toLowerCase().includes(search.toLowerCase()) ||
                item.Email.toString().toLowerCase().includes(search.toLowerCase())
            );
            setEmployeeList(search_results);
            setPagination(calculateRange(search_results, 5));
            setPage(1);
        }
        else {
            setEmployeeList(sliceData(originalEmployeeList, page, 5));
            setPagination(calculateRange(originalEmployeeList, 5));
        }
    };

    // Change Page 
    const handleChangePage = (new_page) => {
        setPage(new_page);
        setEmployeeList(sliceData(originalEmployeeList, new_page, 5));
    }
    // Update info
    const handleInputChange = (id, field, value) => {
        setEmployeeList((prevList) =>
            prevList.map((employee) => (employee.Id === id ? { ...employee, [field]: value } : employee))
        );
        setReload(!reload);
    };
    const handleSubmit =async (id) => {
        try {
            const url = `https://localhost:7199/api/Employee/${id}`;
            const { data: res } = await axios.put(
                url,
                employeeList.find((employee) => employee.Id === id),
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            console.log(res)
            const newPage = Math.ceil(res.findIndex((employee) => employee.Id === id) / 5) + 1;
            setPage(newPage);
            setEmployeeList(res);
        } catch (error) {
            setError(error.message);
        }
    };
    return (
        <div className="manage-employee-container">
            <div className='manage-employee-header'>
                <h1>Manage Employee</h1>
                <input
                    type='text'
                    value={search}
                    placeholder='Search..'
                    className='register-employee-content-input'
                    onChange={e => handleSearch(e)} />
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