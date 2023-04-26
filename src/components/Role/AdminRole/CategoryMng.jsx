import React, { useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';
import './styles.scss';
import { Provider, useDispatch } from 'react-redux';
import store from '../../../Redux/store';
import ReactPaginate from 'react-paginate';

function CategoryMng() {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState(store.getState());
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 5; // số mục trên mỗi trang
    const pageCount = Math.ceil(state.cateList.length / itemsPerPage); // tổng số trang

    const getCateList = async () => {
        try {
            const url = 'https://localhost:7199/api/Category';
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            store.dispatch({ type: 'SET_CATE_LIST', payload: response.data.Result });
            console.log(response.data.Result);
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
            store.dispatch({
                type: 'SET_CATE_LIST',
                payload: updateDele
            });
            store.dispatch({ type: 'SET_CATE_REfRESHDATA', payload: updateDele });
            console.log(state.cateList);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            store.dispatch({ type: 'SET_ERROR', payload: thrownError });
        },
    });
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
                    <h1> Category List</h1>
                    <div className='cate-container-header-search'>

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
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className='input-info'
                                                            type='text'
                                                            value={category.CategoryName}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className='input-info'
                                                            type='text'
                                                            value={category.CreatedAt}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className='input-info'
                                                            type='text'
                                                            value={category.UpdatedAt}
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