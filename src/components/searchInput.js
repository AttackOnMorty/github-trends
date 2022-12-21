import { Select, Spin } from 'antd';
import { useState } from 'react';

import { getRepositories } from '../api';

let timeout;
let currentValue;

const fetch = (value, setData, allData, setAllData, setFetching) => {
    setData([]);

    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }

    currentValue = value;

    const getRepoList = async () => {
        if (value === '') {
            return;
        }

        setFetching(true);
        const res = await getRepositories(value);

        if (currentValue === value) {
            const data = res.map(({ fullName, stargazersCount }) => ({
                value: fullName,
                text: fullName,
                stargazersCount,
            }));
            setData(data);
            setAllData([...allData, ...data]);
        }
        setFetching(false);
    };

    timeout = setTimeout(getRepoList, 500);
};

const SearchInput = ({ placeholder, style, repos, setRepos }) => {
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [fetching, setFetching] = useState(false);

    const handleSearch = (newValue) => {
        fetch(newValue, setData, allData, setAllData, setFetching);
    };

    const handleChange = (newValue) => {
        const repos = newValue.map((fullName) => ({
            fullName,
            stargazersCount: allData.filter(
                ({ value }) => value === fullName
            )[0].stargazersCount,
        }));
        setRepos(repos);
    };

    return (
        <Select
            mode="multiple"
            showSearch
            value={repos.map((repo) => repo.fullName)}
            placeholder={placeholder}
            style={style}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            options={(data || []).map((d) => ({
                value: d.value,
                label: d.text,
            }))}
        />
    );
};

export default SearchInput;
