import React, { useEffect, useState } from 'react';
import axios from 'axios';
import $, { event } from 'jquery';
import './styles.scss';
import { Provider, useDispatch } from 'react-redux';
import store from '../../../Redux/store';
import GetJwtTokenClaim from '../../../utils/JwtTokenClaim';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import { CSSTransition } from 'react-transition-group';
function SuppliersMng() {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState(store.getState());
    const loadToken = GetJwtTokenClaim();
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 5; // số mục trên mỗi trang
    const pageCount = Math.ceil(state.suppList.length / itemsPerPage); // tổng số trang
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const toggleModal = () => setOpenModalAdd(!openModalAdd);
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

    // Add Supplier
    const handleAdd =async () => {
        try {
            const url = 'https://localhost:7199/api/supplier';
            const response = await axios.post(
                url,
                {
                    [field]: value,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    }
                }
            );
            const updatedSupplier = response.data.Result;
            const updatedSuppList = state.suppList.map((supplier) => {
                if (supplier.Id !== updatedSupplier.Id) {
                    return { ...supplier };
                } else {
                    return { ...supplier, ...updatedSupplier };
                }
            });
            console.log(updatedSupplier);
            store.dispatch({ type: 'SET_SUPP_ADD', payload: updatedSupplier });
            store.dispatch({ type: 'SET_SUPPLIST', payload: updatedSuppList });
        } catch (error) {
            store.dispatch({ type: 'SET_ERROR', payload: error.message.response });
        }
    }

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

    // Follow Change input
    const handleChangeInput = async (id, field, value) => {
        console.log(id, field, value);
        const updatedSuppList = state.suppList.map((supplier) =>
            supplier.Id === id ? { ...supplier, [field]: value } : supplier
        );
        store.dispatch({ type: "SET_SUPPLIST", payload: updatedSuppList });
        try {
            const url = `https://localhost:7199/api/supplier/${id}`;
            const response = await axios.put(
                url,
                updatedSuppList.find((supplier) => supplier.Id === id),
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            console.log(response.status);
            console.log(response);
            const updateData = state.suppList.map((supplier) =>
                supplier.Id === id ? { ...supplier, ...response.data.Result } : supplier
            );
            store.dispatch({ type: "SET_SUPPLIST", payload: updateData });
        } catch (error) {
            store.dispatch({ type: "SET_ERROR", payload: error.message.response });
        }
    };

    // Add Supplier
    const handleChangeAdd = async (event) => {
        const { name, value } = event.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Pagination
    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    const displayedSuppList = state.suppList.slice(
        pageNumber * itemsPerPage,
        (pageNumber + 1) * itemsPerPage
    );


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
                                <span>
                                    <button onClick={toggleModal} className='btn-refresh'>Add</button>
                                    <CSSTransition
                                        in={openModalAdd}
                                        timeout={300}
                                        classNames="modal"
                                        unmountOnExit
                                    >
                                        <Modal
                                            isOpen={openModalAdd}
                                            onRequestClose={toggleModal}

                                            style={
                                                {
                                                    content: {
                                                        top: '50%',
                                                        left: '50%',
                                                        right: 'auto',
                                                        bottom: 'auto',
                                                        marginRight: '-50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        width: '500px',
                                                        backgroundImage: 'linear-gradient(#2D83B5, #2D83B5, #89CCF6)',
                                                        backdropFilter: 'blur(100px)',
                                                    }
                                                }
                                            }
                                        >
                                            <button
                                                onClick={toggleModal}
                                                style={
                                                    {
                                                        border: 'none',
                                                        width: '20px',
                                                        height: '20px',
                                                        backgroundColor: 'transparent',
                                                        position: 'absolute',
                                                        right: '10px',
                                                        top: '10px',
                                                        color: 'white',

                                                    }}
                                            >x
                                            </button>
                                            <h2 style={{ color: 'white' }}>Add Supplier</h2>
                                            <div className='modal-body'
                                                style={{
                                                }}
                                            >
                                                <span>
                                                    <label>Name</label>
                                                    <input
                                                        style={{
                                                            width: '95%',
                                                            height: '30px',
                                                            borderRadius: '5px',
                                                            border: '1px solid #ccc',
                                                            padding: '10px',
                                                            fontSize: '16px',
                                                            outline: 'none',
                                                            marginBottom: '20px',
                                                            display: 'block',
                                                            marginTop: '10px'

                                                        }}
                                                        type="text"
                                                        placeholder="Supplier Name"
                                                        onChange={handleChangeAdd}
                                                    />
                                                </span>
                                                <span>
                                                    <label>Email</label>
                                                    <input
                                                        style={{
                                                            width: '95%',
                                                            height: '30px',
                                                            borderRadius: '5px',
                                                            border: '1px solid #ccc',
                                                            padding: '10px',
                                                            fontSize: '16px',
                                                            outline: 'none',
                                                            marginBottom: '20px',
                                                            display: 'block',
                                                            marginTop: '10px'
                                                        }}
                                                        type="text"
                                                        placeholder="Supplier Email"
                                                        onChange={handleChangeAdd}
                                                    />
                                                </span>
                                                <span>
                                                    <label>Phone Number</label>
                                                    <input
                                                        style={{
                                                            width: '95%',
                                                            height: '30px',
                                                            borderRadius: '5px',
                                                            border: '1px solid #ccc',
                                                            padding: '10px',
                                                            fontSize: '16px',
                                                            outline: 'none',
                                                            marginBottom: '20px',
                                                            display: 'block',
                                                            marginTop: '10px'
                                                        }}
                                                        type="text"
                                                        placeholder="Supplier Phone Number"
                                                        onChange={handleChangeAdd}
                                                    />
                                                </span>
                                                <span>
                                                    <label>Fax</label>
                                                    <input
                                                        style={{
                                                            width: '95%',
                                                            height: '30px',
                                                            borderRadius: '5px',
                                                            border: '1px solid #ccc',
                                                            padding: '10px',
                                                            fontSize: '16px',
                                                            outline: 'none',
                                                            marginBottom: '20px',
                                                            display: 'block',
                                                            marginTop: '10px'
                                                        }}
                                                        type="text"
                                                        placeholder="Supplier Fax"
                                                        onChange={handleChangeAdd}
                                                    />
                                                </span>
                                                <button className='btn-add' style={{
                                                    width: '10%',
                                                    height: '30px',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ccc',
                                                    fontSize: '16px',
                                                    outline: 'none',
                                                    margin: '0 auto',
                                                    backgroundColor: 'white',
                                                }}
                                                    onClick={handleAdd}
                                                >
                                                    Add
                                                </button>
                                            </div>

                                        </Modal>
                                    </CSSTransition>
                                </span>
                                <button className="btn-refresh" onClick={refreshSuppList}>Refresh</button>
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


                                    {Array.isArray(displayedSuppList) &&
                                        displayedSuppList.map((supplier) => (
                                            <tr key={supplier.Id}>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={supplier.Id}
                                                        style={{ width: "50px" }}
                                                        onChange={(event) => handleChangeInput(supplier.Id, 'Id', event.target.value)} />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={supplier.SupplierName}
                                                        onChange={(event) => handleChangeInput(supplier.Id, 'SupplierName', event.target.value)} />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={supplier.SupplierEmail}
                                                        onChange={(event) => handleChangeInput(supplier.Id, 'SupplierEmail', event.target.value)} />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={supplier.SupplierPhoneNumber}
                                                        onChange={(event) => handleChangeInput(supplier.Id, 'SupplierPhoneNumber', event.target.value)} />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={supplier.SupplierFax}
                                                        onChange={(event) => handleChangeInput(supplier.Id, 'SupplierFax', event.target.value)} />
                                                </td>
                                                <td>
                                                    <button className='btn-del' onClick={() => handleDelete(supplier.Id)}>x</button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>

                            </table>
                            <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                pageCount={pageCount}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />

                        </>
                    )}
                </div>
            </Provider>
        </div>
    );
}

export default SuppliersMng;    