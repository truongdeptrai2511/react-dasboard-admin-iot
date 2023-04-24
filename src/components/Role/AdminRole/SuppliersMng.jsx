import React, { useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';
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
            console.log(store);
            setLoading(false);
        } catch (error) {
            store.dispatch({ type: 'SET_ERROR', payload: error.message });
            setLoading(false);
        }
    };

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
        } else {
            store.dispatch({ type: 'SET_SUPPLIST', payload: state.refreshDataSupp });
        }
    };

    // Delete Supplier
    const handleDelete = (id) => {
        $.ajax({
            url: `https://localhost:7199/api/supplier/${id}`,
            type: 'DELETE',
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            success: function () {
                store.dispatch({
                    type: 'SET_SUPPLIST',
                    payload: state
                        .suppList.filter((supplier) => supplier.SupplierId !== id),
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                store.dispatch({ type: 'SET_ERROR', payload: thrownError });
            },
        });
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
        <Provider store={store}>
            <div className="suppliers-mng">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search supplier"
                                value={state.search}
                                onChange={handleSearch}
                            />
                        </div>
                        <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Fax</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {state.suppList && state.suppList.map((supplier) => (
                                    <tr key={supplier.SupplierId}>
                                        <td>{supplier.SupplierId}</td>
                                        <td>{supplier.SupplierName}</td>
                                        <td>{supplier.SupplierEmail}</td>
                                        <td>{supplier.SupplierPhoneNumber}</td>
                                        <td>{supplier.SupplierFax}</td>
                                        <td>
                                            <button className='btn-del' onClick={() => handleDelete(supplier.SupplierId)}>x</button>
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
    );
}

export default SuppliersMng;    