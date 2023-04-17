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
    const [data, setData] = useState({
        FullName: "",
        Email: "",
        CitizenIdentification: "",
        Username: ""
    })
    //#endregion Constants

    const handleUpdate = (id, event) => {
        setData({ ...data, [event.target.name]: event.target.value });
        console.log("data" + data);
        try {
            const url = `https://localhost:7199/api/Employee/${id}`;
            const { data: res } = axios.put(url, data);
            setEmployeeList(res);
            setOriginalEmployeeList(res);
            setPagination(calculateRange(res, 5));
            setEmployeeList(sliceData(res, page, 5));
        } catch (error) {
            setError(error.message);
        }
    };




    const handleGetListEmp = async () => {
        try {
            const url = "https://localhost:7199/api/employee";
            const { data: res } = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            setEmployeeList(res);
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
        console.log(employeeList);
        setPagination(calculateRange(employeeList, 5));
        setEmployeeList(sliceData(employeeList, page, 5));
    }, [])

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
                                employeeList.map(request => (
                                    <tr key={request.Id}>
                                        <td style={{ maxWidth: "50px" }}>
                                            <input
                                                type='text'
                                                value={request.UserName}
                                                onChange={(event) => handleUpdate(request.Id, event)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='text'
                                                value={request.FullName}
                                                onChange={(event) => handleUpdate(request.Id, event)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='text'
                                                value={request.Email}
                                                onChange={(event) => handleUpdate(request.Id, event)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='text'
                                                value={request.CitizenIdentification}
                                                onChange={(event) => handleUpdate(request.Id, event)}
                                            />
                                        </td>
                                        <td>
                                            <button className='btn-del' onClick={() => handleDelete(request.Id)} style={{ display: "block" }}>x</button>
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