import React, { useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';
import './styles.scss';
import { Provider, useDispatch } from 'react-redux';
import store from '../../../Redux/store';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import { Alert } from 'react-bootstrap';
// Category mangement
function CategoryMng(show, onHide) {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState(store.getState());
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 5; // số mục trên mỗi trang
    const pageCount = Math.ceil(state.cateList.length / itemsPerPage); // tổng số trang
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [data, setData] = useState({
        categoryName: ""
    })
    const toggleModal = () => setOpenModalAdd(!openModalAdd);
    const getCateList = async () => {
        try {
            const url = 'https://localhost:7199/api/Category';
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            store.dispatch({ type: 'SET_CATE_LIST', payload: response.data.Result });
            setLoading(false);
        } catch (error) {
            store.dispatch({ type: 'SET_ERROR', payload: error.message });
            setLoading(false);
        }
    };
    // Pagination
    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    const displayedCateList = state.cateList.slice(
        pageNumber * itemsPerPage,
        (pageNumber + 1) * itemsPerPage
    );

    const refreshCateList = async () => {
        try {
            const url = 'https://localhost:7199/api/Category';
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            store.dispatch({ type: 'SET_CATE_REfRESHDATA', payload: response.data.Result });
        } catch (error) {
            store.dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const handleSearch = (event) => {
        store.dispatch({ type: 'SET_CATE_SEARCH', payload: event.target.value });
        if (event.target.value !== '') {
            const searchResults = state.cateList.filter(
                (category) =>
                    category.CategoryName.toLowerCase().includes(state.searchCate.toLowerCase())
            );
            store.dispatch({ type: 'SET_CATE_LIST', payload: searchResults });
        } else {
            refreshCateList();
        }
    };


    // Delete
    const handleDelete = async (id) => {
        $.ajax({
            url: `https://localhost:7199/api/Category/${id}`,
            type: 'DELETE',
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            success: function () {
                const updateDele = state.cateList.filter(
                    (category) => category.Id !== id

                );
                console.log(updateDele);
                store.dispatch({
                    type: 'SET_CATE_LIST',
                    payload: updateDele
                });
                store.dispatch({ type: 'SET_CATE_REFRESHDATA', payload: updateDele });
                console.log(state.cateList);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                store.dispatch({ type: 'SET_ERROR', payload: thrownError });
            },
        });
    };

    // Modal Add
    const handleAdd = async () => {
        try {
            const url = 'https://localhost:7199/api/Category';
            const response = await axios.post(
                url,
                {
                    CategoryName: data.categoryName,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    }
                }
            );
            const updateCate = response.data.Result;
            console.log(updateCate);
            const updateCateList = state.cateList.map((category) => {
                if (category.Id !== updateCate.Id) {
                    return { ...category };
                } else {
                    return { ...category, ...updateCate };
                }
            });
            setShowAlert(true);
            store.dispatch({ type: 'SET_CATE_ADD', payload: updateCate });
            store.dispatch({ type: 'SET_CATE_LIST', payload: updateCateList });
        } catch (error) {
            store.dispatch({ type: 'SET_ERROR', payload: error.message.response });
        }
    }
    const handleChangeAdd = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    }
    const handleModalClose = () => {
        setOpenModalAdd(false);
        setData({
            categoryName: '',
        });
        setShowAlert(false);
        onHide();
    };
    // Follow Change input
    const handleChangeInput = async (id, field, value) => {
        console.log(id, field, value);
        const updateCateList = state.cateList.map((category) =>
            category.Id === id ? { ...category, [field]: value } : category
        );
        store.dispatch({ type: "SET_CATE_LIST", payload: updateCateList });
        try {
            const url = `https://localhost:7199/api/Category/${id}`;
            const response = await axios.put(
                url,
                updateCateList.find((category) => category.Id === id),
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            console.log(response.status);
            console.log(response);
            const updateData = state.suppList.map((category) =>
                category.Id === id ? { ...category, ...response.data.Result } : category
            );
            store.dispatch({ type: "SET_CATE_LIST", payload: updateData });
        } catch (error) {
            store.dispatch({ type: "SET_ERROR", payload: error.message.response });
        }
    };
    // First render
    useEffect(() => {
        getCateList();
        // Subscribe to store changes
        const unsubscribe = store.subscribe(() => {
            setState(store.getState());
        });
        return () => {
            unsubscribe();
        };
    }, []);
    return (
        <div className='cate-container'>
            <Provider store={store}>
                <div className='cate-container-header'>
                    <div className='cate-container-header-search'>
                        <h1 style={{width:"350px"}}> Category List</h1>
                        <input
                            type="text"
                            placeholder="Search category"
                            value={state.searchCate}
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
                        <button className='btn-refresh'
                            onClick={toggleModal}
                            style={{
                                display: 'block',
                            }}>Add</button>
                        <Modal
                            isOpen={openModalAdd}
                            onRequestClose={toggleModal}
                            show={openModalAdd}
                            onHide={handleModalClose}
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
                            <h2 style={{ color: 'white' }}>Add Category</h2>
                            <div className='modal-body'>
                                <span>
                                    <label>Category Name</label>
                                </span>
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
                                    placeholder="Category Name"
                                    name="categoryName"
                                    value={data.categoryName}
                                    onChange={handleChangeAdd}
                                />

                                <button className='btn-add' style={{
                                    width: '10%',
                                    height: '30px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    fontSize: '16px',
                                    outline: 'none',
                                    margin: '0 auto',
                                    backgroundColor: 'white'
                                }}
                                    onClick={handleAdd}> Add
                                </button>
                            </div>
                            {showAlert && (
                                <Alert variant="success" onClose={() => { setShowAlert(false); handleModalClose() }} dismissible >
                                    Category successfully added!
                                    <button type="button" className="btn-close" onClick={() => { setShowAlert(false); handleModalClose() }} aria-label="Close">X</button>
                                </Alert>
                            )}
                        </Modal>
                        <button className="btn-refresh" onClick={refreshCateList}>Refresh</button>
                    </div>
                </div>
                <div className='cate-container-body'>
                    {
                        loading ? (<div>Loading...</div>) :
                            (
                                <><table>

                                    <tbody>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>CreatedAt</th>
                                            <th>UpdatedAt</th>
                                            <th>Action</th>
                                        </tr>


                                        {Array.isArray(displayedCateList) &&
                                            displayedCateList.map((category) => (
                                                <tr key={category.Id}>
                                                    <td>
                                                        <input
                                                            className='input-info'
                                                            type='text'
                                                            value={category.Id}
                                                            style={{ width: "50px" }}
                                                            onChange={(event) => handleChangeInput(category.Id, 'Id', event.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className='input-info'
                                                            type='text'
                                                            value={category.CategoryName}
                                                            onChange={(event) => handleChangeInput(category.Id, 'CategoryName', event.target.value)}

                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className='input-info'
                                                            type='text'
                                                            value={category.CreatedAt}
                                                            readOnly
                                                            style={{
                                                                opacity: 0.8
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className='input-info'
                                                            type='text'
                                                            value={category.UpdatedAt}
                                                            readOnly
                                                            style={{
                                                                opacity: 0.8
                                                            }}
                                                        />
                                                    </td>

                                                    <td>
                                                        <button className='btn-del' onClick={() => handleDelete(category.Id)}>x</button>
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
                                    /></>
                            )
                    }
                </div>
            </Provider>
        </div>
    )
}

export default CategoryMng