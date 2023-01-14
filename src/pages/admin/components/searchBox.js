import { React, useState } from 'react';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { axiosInstance } from "../../../config/axios";
import {getToken} from '../../../utils/getToken';

import './searchBox.css'

const SearchBox = (props) => {
    const { searchValue, searchValueChange, searchState } = props;
    const searchIconClick = () => {
        searchValueChange("");
    }

    const searchSubmit = async (e) => {
        e.preventDefault();
        axiosInstance.get(`admin/findChat?customer=${searchValue}`, { headers: { Authorization: `Bearer ${getToken()}` } }).then((res) => {
            searchState(res.data.data)
        }).catch(err => console.log("eror on searching => ", err))
    }

    return (
        <div className="searchDiv">
            <form className="search_container" onSubmit={searchSubmit}>
                <SearchOutlined style={{ margin: "3px" }} />
                <input
                    placeholder={"Search"}
                    type="text"
                    value={props.searchValue}
                    onChange={e => searchValueChange(e.target.value)}
                />
                {<CloseOutlined className={searchValue.length == 0 ? "invisible_icon" : "close_icon"} onClick={searchIconClick} />}
            </form>
        </div>
    )
}

export default SearchBox;