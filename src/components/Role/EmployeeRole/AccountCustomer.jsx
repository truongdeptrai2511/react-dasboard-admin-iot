import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { calculateRange, sliceData } from '../../../utils/table-pagination';
import GetJwtTokenClaim from '../../../utils/JwtTokenClaim';
import './styles.scss';

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
            const filteredData = response.data.filter(element => element.CitizenIdentification === null);
            setCusList(filteredData);
            // setOriginalCusList(cusList);
            // setPagination(calculateRange(cusList, 5));
            // setCusList(sliceData(cusList, page, 5));
        } catch (error) {
            setError(error.message);
        }
    };

      // Delete an cus from the list
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7199/api/customer/${id}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setCusList(cusList.filter((customer) => customer.Id !== id));
      setOriginalCusList(cusList);
    } catch (error) {
      setError(error.message);
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

    useEffect(() => {
        getCusList();
        console.log(cusList);
    }, [originalCusList])
    useEffect(() => {
        getCusList();
        console.log(cusList);
    }, [])
    return (
        <div className="account-cus-container">
            <div className='account-cus-header'>
                <h1>
                    Account Customer
                </h1>
            </div>
            <div className='account-cus-body'>
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
                                    Array.isArray(cusList) && cusList.map(request => (
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
            </div>
        </div>
    );
}

export default AccountCustomer;