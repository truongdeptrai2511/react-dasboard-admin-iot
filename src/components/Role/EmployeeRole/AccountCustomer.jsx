import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { calculateRange, sliceData } from '../../../utils/table-pagination';
import GetJwtTokenClaim from '../../../utils/JwtTokenClaim';
import './styles.scss';
import $ from 'jquery';

function AccountCustomer() {
    const [error, setError] = useState('');
    const [cusList, setCusList] = useState([]);
    const [originalCusList, setOriginalCusList] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const payload = GetJwtTokenClaim();
    const getCusList = async () => {
        try {
            const url = 'https://localhost:7199/api/customer';
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            setOriginalCusList(response.data.filter(customer => customer.CitizenIdentification === null));
        } catch (error) {
            setError(error.message);
        }
    };


// Delete an cus from the list
const handleDelete = (id) => {
    $.ajax({
        url: `https://localhost:7199/api/customer/${id}`,
        type: "DELETE",
        headers: {
            Authorization: localStorage.getItem('token'),
        },
        success: function() {
            setOriginalCusList(originalCusList.filter((customer) => customer.Id !== id));
            setCusList(originalCusList.filter((customer) => customer.Id !== id));
        }
    });
};

    // Search for employees
    const handleSearch = (event) => {
        setSearch(event.target.value);
        if (event.target.value !== '') {
            const searchResults = originalCusList.filter(
                (customer) =>
                    customer.UserName.toString().toLowerCase().includes(search.toLowerCase()) ||
                    customer.FullName.toString().toLowerCase().includes(search.toLowerCase()) ||
                    customer.Email.toString().toLowerCase().includes(search.toLowerCase()) ||
                    customer.Address.toString().toLowerCase().includes(search.toLowerCase())
            );
            setCusList(searchResults);
            setPagination(calculateRange(searchResults, 5));
            setPage(1);
        } else {
            setCusList(sliceData(originalCusList, page, 5));
            setPagination(calculateRange(originalCusList, 5));
        }
    };

    // Update an cus's information
    const handleInputChange = (id, field, value) => {
        setCusList((prevList) =>
            prevList.map((cus) =>
                cus.Id === id ? { ...cus, [field]: value } : cus
            )
        );
        //setUpdatedFields((prevFields) => ({ ...prevFields, [id]: true }));
    };
    // Change the current page
    const handleChangePage = (newPage) => {
        setPage(newPage);
        const filteredData = originalCusList.filter(element => element.CitizenIdentification === null);
        setCusList(sliceData(filteredData, newPage, 5));
    };

    useEffect(() => {
        getCusList();
    }, []);

    useEffect(() => {
        const filteredData = originalCusList.filter(element => element.CitizenIdentification === null);
        setPagination(calculateRange(filteredData, 5));
        setCusList(sliceData(filteredData, page, 5));
    }, [originalCusList, page]);

    return (
        <div className="account-cus-container">
            <div className='account-cus-header'>
                <h1>
                    Account Customer
                </h1>
                <input
                    type='text'
                    value={search}
                    placeholder='Search..'
                    className='register-employee-content-input'
                    onChange={handleSearch}
                />
            </div>
            <div className='account-cus-body'>
                {console.log(cusList)}
                {cusList.length > 0 ?
                    <div className="cus-list">
                        <table>
                            <tbody>
                                <tr>
                                    <th>Username</th>
                                    <th>FullName</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Action</th>
                                </tr>
                                {
                                    cusList.map(request => (
                                        <><tr key={request.Id}>
                                            <td style={{ maxWidth: "50px" }}>
                                                <input
                                                    style={{ width: "100px" }}
                                                    className="input-info"
                                                    type="text"
                                                    value={request.UserName}
                                                    onChange={(event) => handleInputChange(request.Id, "UserName", event.target.value)} />
                                            </td>
                                            <td>
                                                <input
                                                    className="input-info"
                                                    type="text"
                                                    value={request.FullName}
                                                    onChange={(event) => handleInputChange(request.Id, "FullName", event.target.value)} />
                                            </td>
                                            <td>
                                                <input
                                                    className="input-info"
                                                    type="text"
                                                    value={request.Email}
                                                    onChange={(event) => handleInputChange(request.Id, "Email", event.target.value)} />
                                            </td>
                                            <td>
                                                <input
                                                    className="input-info"
                                                    type="text"
                                                    value={request.Address}
                                                    onChange={(event) => handleInputChange(request.Id, "Address", event.target.value)} />
                                            </td>
                                            <td>
                                                {/* <button className="btn-save" onClick={() => handleSubmit(request.Id)}>Save</button> */}
                                                <button className='btn-del' onClick={() => handleDelete(request.Id)}>x</button>
                                            </td>
                                        </tr></>
                                    ))}
                            </tbody>
                        </table>
                    </div> : (
                        <div style={{ padding: " 1em 0 0 1em" }}>No employee found.</div>
                    )
                }
                {cusList.length !== 0 ?
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

export default AccountCustomer;