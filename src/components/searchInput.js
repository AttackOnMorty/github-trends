import { Select, Spin, Tag } from 'antd';
import { useState } from 'react';

import { getRepositories } from '../api';

const COLORS = [
    'rgb(54, 162, 235)',
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)',
];

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
            const data = res.map(({ fullName, currentStars }) => ({
                value: fullName,
                text: fullName,
                currentStars,
            }));
            setData(data);
            setAllData([...allData, ...data]);
        }
        setFetching(false);
    };

    timeout = setTimeout(getRepoList, 500);
};

const SearchInput = ({
    placeholder,
    style,
    repos,
    setRepos,
    debouncedSetRepos,
}) => {
    const [value, setValue] = useState([]);
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [fetching, setFetching] = useState(false);

    const tagRender = (props) => {
        const { label, value, closable, onClose } = props;
        const index =
            repos.map((repo) => repo.fullName).indexOf(value) % COLORS.length;
        const onPreventMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                color={COLORS[index]}
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{
                    marginRight: 3,
                }}
            >
                {label}
            </Tag>
        );
    };

    const handleSearch = (newValue) => {
        fetch(newValue, setData, allData, setAllData, setFetching);
    };

    const handleChange = (newValue) => {
        if (newValue.length === 0) {
            setData([]);
        }

        setValue(newValue);

        const mappedRepos = newValue.map((fullName) => ({
            fullName,
            currentStars: allData.filter(({ value }) => value === fullName)[0]
                .currentStars,
        }));

        if (newValue.length > repos.length) {
            setRepos(mappedRepos);
        } else {
            debouncedSetRepos(mappedRepos);
        }
    };

    return (
        <Select
            mode="multiple"
            showSearch
            value={value}
            placeholder={placeholder}
            style={style}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            tagRender={tagRender}
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
