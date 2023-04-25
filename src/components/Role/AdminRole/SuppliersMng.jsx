import React, { useEffect, useState } from 'react';
import axios from 'axios';
import $, { event } from 'jquery';
import './styles.scss';
import { Provider } from 'react-redux';
import store from '../../../Redux/store';


function SuppliersMng() {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState(store.getState());

    // Get all supp list
    const getSuppList = async () => {
        try {
            const url = 'https://localhost:7199/api/supplier';
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            store.dispatch({ type: 'SET_SUPPLIST', payload: response.data.Result });
            setLoading(false);
        } catch (error) {
            store.dispatch({ type: 'SET_ERROR', payload: error.message });
            setLoading(false);
        }
    };

    // Refresh supp list
    const refreshSuppList = async () => {
        try {
            const url = 'https://localhost:7199/api/supplier';
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            store.dispatch({ type: 'SET_REFRESHDATA', payload: response.data.Result });
        } catch (error) {
            store.dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    // Search for supp list
    const handleSearch = (event) => {
        store.dispatch({ type: 'SET_SEARCH', payload: event.target.value });
        if (event.target.value !== '') {
            const searchResults = state.suppList.filter(
                (supplier) =>
                    supplier.SupplierName.toLowerCase().includes(state.search.toLowerCase()) ||
                    supplier.SupplierEmail.toLowerCase().includes(state.search.toLowerCase()) ||
                    supplier.SupplierFax.toLowerCase().includes(state.search.toLowerCase()) ||
                    supplier.SupplierPhoneNumber.toLowerCase().includes(state.search.toLowerCase())
            );
            store.dispatch({ type: 'SET_SUPPLIST', payload: searchResults });
        } else if (event.target.value === '') {
            refreshSuppList()    // refresh supp list when search is empty
        } else
            store.dispatch({ type: 'SET_SUPPLIST', payload: state.refreshDataSupp });
    };

    // Delete Supplier
    const handleDelete = (id) => {
        console.log(id);
        $.ajax({
            url: `https://localhost:7199/api/supplier/${id}`,
            type: 'DELETE',
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            success: function () {
                const updatedSuppList = state.suppList.filter(
                    (supplier) => supplier.Id !== id

                );
                store.dispatch({
                    type: 'SET_SUPPLIST',
                    payload: updatedSuppList
                });
                store.dispatch({ type: 'SET_REFRESHDATA', payload: updatedSuppList });
                console.log(state.suppList);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                store.dispatch({ type: 'SET_ERROR', payload: thrownError });
            },
        });
    };

    const handleSubmit = (Id) => {
        try {
            const url = `https://localhost:7199/api/supplier/${Id}`;
            const response = axios.put(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            })
            const updateData = state.suppList.map((supplier) => {
                if (supplier.Id === Id) {
                    return { ...supplier, ...response.data.Result };
                }
                return supplier;
            });
            store.dispatch({ type: 'SET_SUPPLIST', payload: updateData });
        }
        catch (error) {
            store.dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    }

    // Follow Change input
    const handleChangeInput = (id, field, value) => {
        console.log(id, field, value);
        const updatedSuppList = state.suppList.map((supplier) =>
            supplier.Id === id ? { ...supplier, [field]: value } : supplier
        );
        store.dispatch({ type: 'SET_SUPPLIST', payload: updatedSuppList });
        handleSubmit(id);
    };


    useEffect(() => {
        getSuppList();
        // Subscribe to store changes
        const unsubscribe = store.subscribe(() => {
            setState(store.getState());
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className='sup-container'>
            <Provider store={store}>
                <div className="suppliers-mng">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            <div className="supp-header">
                                <h1 style={{ marginTop: "-0.05em" }}>Suppliers</h1>
                                <input
                                    type="text"
                                    placeholder="Search supplier"
                                    value={state.search}
                                    onChange={handleSearch}
                                    style={{
                                        width: '50%',
                                        height: '30px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        marginBottom: '20px'

                                    }}
                                />
                            </div>
                            <table>

                                <tbody>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone Number</th>
                                        <th>Fax</th>
                                        <th>Action</th>
                                    </tr>


                                    {Array.isArray(state.suppList) && state.suppList.map((supplier) => (
                                        <tr key={supplier.Id}>
                                            <td>
                                                <input
                                                    className='input-info'
                                                    type='text' 
                                                    value={supplier.Id}
                                                    style={{ width: "50px" }}
                                                    onChange={(event) => handleChangeInput(supplier.Id, 'Id', event.target.value )} />
                                            </td>
                                            <td>
                                                <input
                                                    className='input-info'
                                                    type='text' 
                                                    value={supplier.SupplierName}
                                                    onChange={(event) => handleChangeInput(supplier.Id, 'SupplierName', event.target.value )} />
                                            </td>
                                            <td>
                                                <input
                                                    className='input-info'
                                                    type='text' 
                                                    value={supplier.SupplierEmail}
                                                    onChange={(event) => handleChangeInput(supplier.Id, 'SupplierEmail', event.target.value )} />
                                            </td>
                                            <td>
                                                <input
                                                    className='input-info'
                                                    type='text' 
                                                    value={supplier.SupplierPhoneNumber}
                                                    onChange={(event) => handleChangeInput(supplier.Id, 'SupplierPhoneNumber', event.target.value )} />
                                            </td>
                                            <td>
                                                <input
                                                    className='input-info'
                                                    type='text' 
                                                    value={supplier.SupplierFax}
                                                    onChange={(event) => handleChangeInput(supplier.Id, 'SupplierFax', event.target.value )} />
                                            </td>
                                            <td>
                                                <button className='btn-del' onClick={() => handleDelete(supplier.Id)}>x</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                            <div className="refresh-container">
                                <button onClick={refreshSuppList}>Refresh</button>
                            </div>
                        </>
                    )}
                </div>
            </Provider>
        </div>
    );
}

export default SuppliersMng;    