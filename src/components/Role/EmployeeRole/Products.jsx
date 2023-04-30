import axios from "axios";
import React, { useEffect, useState } from "react";
import $ from "jquery";
import "./styles.scss";
import { Provider } from "react-redux";
import store from "../../../Redux/store";
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import { Alert } from 'react-bootstrap';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDYuiiMfULtEke9a2C19lJCBV-t3w8h4Mg",
    authDomain: "iot-store-image-cloud.firebaseapp.com",
    projectId: "iot-store-image-cloud",
    storageBucket: "iot-store-image-cloud.appspot.com",
    messagingSenderId: "403557199488",
    appId: "1:403557199488:web:dfc190ac20357dc453c065",
    measurementId: "G-XDEVPE7GNN"
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

function ProductsMng(show, onHide) {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState(store.getState());
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 5; // số mục trên mỗi trang
    const pageCount = Math.ceil(state.productList.length / itemsPerPage); // tổng số trang
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [file, setFile] = useState();
    const [data, setData] = useState({
        productName: "",
        code: "",
        status: "",
        quantity: "",
        price: "",
        imgName: "",
        description: "",
        supplierId: "",
        categoryId: ""
    })
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
    //Modal
    const uploadImage = async (file) => {
        const storageRef = storage.ref();
        const imagesRef = storageRef.child('images');
        const fileRef = imagesRef.child(file.name);
        await fileRef.put(file);
        const url = await fileRef.getDownloadURL();
        return url;
    };
    const handleChangeImage = async (event) => {
        const file = event.target.files[0];
        const url = await uploadImage(file); // Chờ đợi promise được giải quyết
        setFile(file);
        setData({ ...data, imgName: url });
    };
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
    const getSuppId = async () => {
        try {
            const url = 'https://localhost:7199/api/supplier';
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            const data = response.data.Result;
            store.dispatch({ type: 'SET_SUPP_ID', payload: data });
        } catch (error) {
            store.dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    }
    const handleModalClose = () => {
        setOpenModalAdd(false);
        setData({
            productName: '',
            code: '',
            status: '',
            quantity: '',
            price: '',
            imgName: '',
            description: '',
            supplierId: '',
            categoryId: ''
        });
        setShowAlert(false);
        onHide();
    };
    const handleAdd = async () => {
        try {
            const url = 'https://localhost:7199/api/Product';
            const response = await axios.post(
                url,
                {
                    ProductName: data.productName,
                    Code: data.code,
                    Status: data.status,
                    Quantity: data.quantity,
                    Price: data.price,
                    ImgName: data.imgName,
                    Description: data.description,
                    SupplierId: data.supplierId,
                    CategoryId: data.categoryId
                },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    }
                }
            );
            console.log(response);
            const updateProduct = response.data.Result;
            console.log(updateProduct);
            const updateProductList = state.productList.map((product) => {
                if (product.Id !== updateProduct.Id) {
                    return { ...product };
                } else {
                    return { ...product, ...updateProduct };
                }
            });
            setShowAlert(true);
            store.dispatch({ type: 'SET_PRODUCT_ADD', payload: updateProduct });
            store.dispatch({ type: 'SET_PRODUCTLIST', payload: updateProductList });
        } catch (error) {
            store.dispatch({ type: 'SET_ERROR', payload: error.message.response });
        }
    }
    const handleChangeAdd = ({ target: { name, value } }) => {
        setData({ ...data, [name]: value });
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

    // Delete Product
    const handleDelete = (id) => {
        console.log(id);
        $.ajax({
            url: `https://localhost:7199/api/Product/${id}`,
            type: 'DELETE',
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            success: function () {
                const updateProductList = state.productList.filter(
                    (product) => product.Id !== id

                );
                store.dispatch({
                    type: 'SET_SUPPLIST',
                    payload: updateProductList
                });
                store.dispatch({ type: 'SET_REFRESHDATA_PRODUCT', payload: updateProductList });
                console.log(state.productList);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                store.dispatch({ type: 'SET_ERROR', payload: thrownError });
            },
        });
    };
    // Follow Change input
    const handleChangeInput = async (id, field, value) => {
        try {
            console.log(id, field, value);
            const updateProductList = state.productList.map((product) => {
                if (product.Id === id) {
                    return { ...product, [field]: value };
                } else {
                    return product;
                }
            });
            store.dispatch({ type: "SET_PRODUCTLIST", payload: updateProductList });

            const url = `https://localhost:7199/api/Product/${id}`;
            const response = await axios.put(url, updateProductList.find((product) => product.Id === id), {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            console.log(response.status);
            console.log(response);

            const updateData = state.productList.map((product) => {
                if (product.Id === id) {
                    return { ...product, ...response.data.Result };
                } else {
                    return product;
                }
            });

            console.log(updateData);
            store.dispatch({ type: "SET_PRODUCTLIST", payload: updateData });
        } catch (error) {
            store.dispatch({ type: "SET_ERROR", payload: error.response.message });
        }
    };

    // Search product
    const handleSearch = (event) => {
        store.dispatch({ type: 'SET_SEARCH_PRODUCT', payload: event.target.value });
        if (event.target.value !== '') {
            const searchResults = state.productList.filter(
                (product) =>
                    (typeof product.ProductName === 'string' && product.ProductName.toLowerCase().includes(state.searchProduct.toLowerCase())) ||
                    (typeof product.Code === 'string' && product.Code.toLowerCase().includes(state.searchProduct.toLowerCase())) ||
                    (typeof product.Status === 'string' && product.Status.toLowerCase().includes(state.searchProduct.toLowerCase())) ||
                    (typeof product.Quantity === 'string' && product.Quantity.toLowerCase().includes(state.searchProduct.toLowerCase())) ||
                    (typeof product.Price === 'string' && product.Price.includes(state.searchProduct)) ||
                    (typeof product.Description === 'string' && product.Description.toLowerCase().includes(state.searchProduct.toLowerCase()))
            );

            store.dispatch({ type: 'SET_PRODUCTLIST', payload: searchResults });
        } else if (event.target.value === '') {
            refreshProductList()    // refresh supp list when search is empty
        } else
            store.dispatch({ type: 'SET_PRODUCTLIST', payload: state.refreshDataProduct });
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
        getSuppId();
        getCateList();
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
                                        value={state.searchProduct}
                                        onChange={handleSearch}
                                        style={{
                                            width: '50%',
                                            height: '30px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                            padding: '10px',
                                            fontSize: '16px',
                                            outline: 'none',
                                            marginBottom: '20px',
                                            float: 'right'
                                        }}
                                    />
                                </div>
                                <button onClick={toggleModal} className='btn-refresh' style={{ marginRight: "20px" }}>Add</button>
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
                                            placeholder="Product Name"
                                            name="productName"
                                            value={data.productName}
                                            onChange={handleChangeAdd}
                                        />
                                        <div className="cs-group">
                                            <input
                                                style={{
                                                    width: '25%',
                                                    height: '30px',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ccc',
                                                    padding: '10px',
                                                    fontSize: '16px',
                                                    outline: 'none',
                                                    marginBottom: '20px',
                                                    display: 'inline',
                                                    marginTop: '10px'
                                                }}
                                                type="text"
                                                placeholder="Code"
                                                onChange={handleChangeAdd}
                                                name="code"
                                                value={data.code}
                                                required
                                            />
                                            <input
                                                style={{
                                                    width: '25%',
                                                    height: '30px',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ccc',
                                                    padding: '10px',
                                                    fontSize: '16px',
                                                    outline: 'none',
                                                    marginBottom: '20px',
                                                    display: 'inline',
                                                    marginTop: '10px',
                                                    marginLeft: '25px'
                                                }}
                                                type="text"
                                                placeholder="Status"
                                                onChange={handleChangeAdd}
                                                name="status"
                                                value={data.status}
                                                required
                                            />
                                            <input
                                                style={{
                                                    width: '27%',
                                                    height: '30px',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ccc',
                                                    padding: '10px',
                                                    fontSize: '16px',
                                                    outline: 'none',
                                                    marginBottom: '20px',
                                                    display: 'inline',
                                                    marginTop: '10px',
                                                    marginLeft: '25px'
                                                }}
                                                type="text"
                                                placeholder="Quantity"
                                                onChange={handleChangeAdd}
                                                name="quantity"
                                                value={data.quantity}
                                                required
                                            />
                                        </div>
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
                                            placeholder="Price"
                                            onChange={handleChangeAdd}
                                            name="price"
                                            value={data.price}
                                            required
                                        />
                                        <input type="file" onChange={handleChangeImage} />
                                        <img src={file} style={{ width: "30%", height: "30%" }} />

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
                                            placeholder="Descrition"
                                            onChange={handleChangeAdd}
                                            name="description"
                                            value={data.description}
                                            required
                                        />
                                        <div className="select-opt">
                                            <div className="select-suppId">
                                                <span>
                                                    <label>Supplier</label>
                                                </span>
                                                <select name="supplierId" style={{ padding: "10px", border: "0.2 solid #ccc", borderRadius: "5px", marginLeft: "18px", width: "82%", height: "40px" }}>
                                                    {Array.isArray(state.suppIdList) && state.suppIdList.map((item, index) => {
                                                        return (

                                                            <option
                                                                key={index}
                                                                value={data.supplierId = item.Id}
                                                                style={{
                                                                    padding: "0.75rem 1rem",
                                                                    fontSize: "1rem",
                                                                    fontWeight: "revert",
                                                                    color: "#4a4a4a",
                                                                    backgroundColor: "#f7f7f7",
                                                                    backgroundImage: "linear-gradient(to bottom, #f7f7f7, #f1f1f1)",
                                                                    border: "none",
                                                                    borderBottom: "2px solid #ddd",
                                                                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                                                                    transition: "all 0.2s ease-in-out"
                                                                }}
                                                            >
                                                                {item.SupplierName}
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                            <div className="select-cateId" style={{ paddingTop: "15px" }}>
                                                <span>
                                                    <label>Category</label>
                                                </span>
                                                <select name="supplierId" style={{ padding: "10px", border: "0.2 solid #ccc", borderRadius: "5px", marginLeft: "10px", width: "82.5%", height: "40px" }}>
                                                    {Array.isArray(state.cateList) && state.cateList.map((item, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={data.categoryId = item.Id}
                                                                style={{
                                                                    padding: "0.75rem 1rem",
                                                                    fontSize: "1rem",
                                                                    fontWeight: "revert",
                                                                    color: "#4a4a4a",
                                                                    backgroundColor: "#f7f7f7",
                                                                    backgroundImage: "linear-gradient(to bottom, #f7f7f7, #f1f1f1)",
                                                                    border: "none",
                                                                    borderBottom: "2px solid #ddd",
                                                                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                                                                    transition: "all 0.2s ease-in-out"
                                                                }}>
                                                                {item.CategoryName}
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <button className='btn-add' style={{
                                            width: '10%',
                                            height: '30px',
                                            borderRadius: '5px',
                                            border: '0.5px solid #ccc',
                                            fontSize: '16px',
                                            outline: 'none',
                                            backgroundColor: 'white',
                                            marginTop: '15px'
                                        }}

                                            onClick={handleAdd}> Add
                                        </button>
                                    </div>
                                    {showAlert && (
                                        <Alert variant="success" onClose={() => { setShowAlert(false); handleModalClose() }} dismissible >
                                            Product successfully added!
                                            <button type="button" className="btn-close" onClick={() => { setShowAlert(false); handleModalClose() }} aria-label="Close">X</button>
                                        </Alert>
                                    )}
                                </Modal>
                                <button className="btn-refresh" onClick={refreshProductList}>Refresh</button>
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
                                                        onChange={(event) => handleChangeInput(product.Id, 'Id', event.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.ProductName}
                                                        onChange={(event) => handleChangeInput(product.Id, 'ProductName', event.target.value)}
                                                        style={{ width: "200px" }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.Code}
                                                        style={{ width: "50px" }}
                                                        onChange={(event) => handleChangeInput(product.Id, 'Code', event.target.value)}

                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.Status}
                                                        style={{ width: "60px" }}
                                                        onChange={(event) => handleChangeInput(product.Id, 'Status', event.target.value)}

                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.Quantity}
                                                        style={{ width: "50px" }}
                                                        onChange={(event) => handleChangeInput(product.Id, 'Quantity', event.target.value)}

                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.Price}
                                                        style={{ width: "50px" }}
                                                        onChange={(event) => handleChangeInput(product.Id, 'Price', event.target.value)}

                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className='input-info'
                                                        type='text'
                                                        value={product.Description}
                                                        onChange={(event) => handleChangeInput(product.Id, 'Description', event.target.value)}

                                                    />
                                                </td>
                                                <td>
                                                    <button className='btn-del' onClick={() => handleDelete(product.Id)}>x</button>
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