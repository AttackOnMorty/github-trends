import React, { useState } from 'react';
import { Select } from 'antd';
import octokit from '../utils/octokit';

let timeout;
let currentValue;

const fetch = (value, callback) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;
    const getRepoList = async () => {
        const res = await octokit.request('GET /search/repositories{?q}', {
            q: value,
        });
        if (currentValue === value) {
            const {
                data: { items },
            } = res;
            const data = items.map((item: any) => ({
                value: item.id,
                text: item.full_name,
            }));
            callback(data);
        }
    };
    timeout = setTimeout(getRepoList, 300);
};

const SearchInput = (props) => {
    const [data, setData] = useState([]);
    const [value, setValue] = useState();
    const handleSearch = (newValue) => {
        if (newValue) {
            fetch(newValue, setData);
        } else {
            setData([]);
        }
    };
    const handleChange = (newValue) => {
        setValue(newValue);
    };
    return (
        <Select
            mode="multiple"
            showSearch
            value={value}
            placeholder={props.placeholder}
            style={props.style}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
            options={(data || []).map((d) => ({
                value: d.value,
                label: d.text,
            }))}
        />
    );
};

export default SearchInput;
