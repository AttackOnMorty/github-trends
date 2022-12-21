import { Select, Spin } from 'antd';
import { useState } from 'react';

import octokit from '../utils/octokit';

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
        const res = await octokit.request('GET /search/repositories{?q}', {
            q: value,
        });

        if (currentValue === value) {
            const data = res.data.items.map(
                ({ full_name, stargazers_count }) => ({
                    value: full_name,
                    text: full_name,
                    stargazers_count,
                })
            );
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
        const repos = newValue.map((full_name) => ({
            full_name,
            stargazers_count: allData.filter(
                ({ value }) => value === full_name
            )[0].stargazers_count,
        }));
        setRepos(repos);
    };

    return (
        <Select
            mode="multiple"
            showSearch
            value={repos.map((repo) => repo.full_name)}
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
