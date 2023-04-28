import axios from "axios";
import React, { useEffect, useState } from "react";
import $ from "jquery";
import "./styles.scss";
import { Provider } from "react-redux";
import store from "../../../Redux/store";
import ReactPaginate from 'react-paginate';
function ProductsMng() {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState(store.getState());
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 5; // số mục trên mỗi trang
    const pageCount = Math.ceil(state.productList.length / itemsPerPage); // tổng số trang
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const toggleModal = () => setOpenModalAdd(!openModalAdd);
    const getListProducts = async () => {
        try {
            const url = 'https://localhost:7199/api/Product';
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            store.dispatch({ type: 'SET_PRODUCTLIST', payload: response.data.Result });
            setLoading(false);
        } catch (error) {
            store.dispatch({ type: 'SET_ERROR', payload: error.message });
            setLoading(false);
        }
    }
    // Refresh product list
    const refreshProductList = async () => {
        try {
            const url = 'https://localhost:7199/api/Product';
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            store.dispatch({ type: 'SET_REFRESHDATA_PRODUCT', payload: response.data.Result });
        } catch (error) {
            store.dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };
    const displayedProductList = state.productList.slice(
        pageNumber * itemsPerPage,
        (pageNumber + 1) * itemsPerPage
    );
    useEffect(() => {
        getListProducts();
        // Subscribe to store changes
        const unsubscribe = store.subscribe(() => {
            setState(store.getState());
        });
        return () => {
            unsubscribe();
        };
    }, [])
    return (
        <div className='prod-container'>
            <Provider store={store}>
                <div className="product-mng">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            <div className="product-header">
                                <h1 style={{ marginTop: "-0.05em" }}>Products</h1>
                                <div className="product-item-bd">
                                    <input
                                        type="text"
                                        placeholder="Search product"
                                        // value={state.search}
                                        // onChange={handleSearch}
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
                                <div className="product-item-btm">
                                    <button onClick={toggleModal} className='btn-refresh'>Add</button>
                                    {/* <CSSTransition
                                        in={openModalAdd}
                                        timeout={300}
                                        classNames="modal"
                                        unmountOnExit
                                    >
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
                                            <h2 style={{ color: 'white' }}>Add product</h2>
                                            <div className='modal-body'>
                                                <span>
                                                    <label>Name</label>
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
                                                    placeholder="product Name"
                                                    name="productName"
                                                    value={data.productName}
                                                    onChange={handleChangeAdd}
                                                />
                                                <span>
                                                    <label>Email</label>
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
                                                    placeholder="product Email"
                                                    onChange={handleChangeAdd}
                                                    name="productEmail"
                                                    value={data.productEmail}
                                                    required
                                                />
                                                <span>
                                                    <label>Phone Number</label>
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
                                                    placeholder="product Phone Number"
                                                    onChange={handleChangeAdd}
                                                    name="productPhoneNumber"
                                                    value={data.productPhoneNumber}
                                                    required
                                                />

                                                <span>
                                                    <label>Fax</label>
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
                                                    placeholder="product Fax"
                                                    onChange={handleChangeAdd}
                                                    name="productFax"
                                                    value={data.productFax}
                                                    required
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
                                                <Alert variant="success" onClose={() => {setShowAlert(false); handleModalClose()}} dismissible >
                                                    product successfully added!
                                                <button type="button" className="btn-close" onClick={() => {setShowAlert(false); handleModalClose()}} aria-label="Close">X</button>
                                                </Alert>
                                            )}
                                        </Modal>
                                    </CSSTransition> */}
                                    <button className="btn-refresh" onClick={refreshProductList}>Refresh</button>
                                </div>
                            </div>
                            <table>

                                <tbody>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Code</th>
                                        <th>Status</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>


                                    {Array.isArray(displayedProductList) &&
                                        displayedProductList.map((product) => (
                                            <tr key={product.Id}>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.Id}
                                                        style={{ width: "30px" }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.ProductName}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.Code}
                                                        style={{ width: "50px" }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.Status}
                                                        style={{ width: "50px" }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.Quantity}
                                                        style={{ width: "50px" }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.Price}
                                                        style={{ width: "50px" }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.Description}
                                                    />
                                                </td>
                                                <td>
                                                    <button className='btn-del'>x</button>
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

export default ProductsMng;