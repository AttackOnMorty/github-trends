import { Select, Spin, Tag } from 'antd';
import { useState } from 'react';

import { getRepositories } from '../api';

const { Option } = Select;

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
        const data = await getRepositories(value);

        if (currentValue === value) {
            setData(data);
            setAllData([...allData, ...data]);
        }
        setFetching(false);
    };

    timeout = setTimeout(getRepoList, 800);
};

function SearchInput({
    placeholder,
    style,
    repos,
    setRepos,
    debouncedSetRepos,
}) {
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
        const { htmlUrl } = data.find((repo) => repo.fullName === value);

        return (
            <Tag
                color={COLORS[index]}
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{
                    margin: 2,
                    fontSize: 14,
                    lineHeight: '26px',
                }}
            >
                <a href={htmlUrl} target="_blank" rel="noopener noreferrer">
                    {label}
                </a>
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
            currentStars: allData.filter(
                (item) => item.fullName === fullName
            )[0].currentStars,
        }));

        if (newValue.length > repos.length) {
            setRepos(mappedRepos);
        } else {
            debouncedSetRepos(mappedRepos);
        }
    };

    const renderOptions = (data) =>
        data.map(({ fullName, avatarUrl, description }) => (
            <Option key={fullName} value={fullName} label={fullName}>
                <div className="flex items-center">
                    <img
                        className="w-5 h-5 mr-2 rounded-full"
                        src={avatarUrl}
                        alt="avatar"
                    />
                    <div className="font-medium">{fullName}</div>
                </div>
                <div className="font-extralight">{description}</div>
            </Option>
        ));

    return (
        <Select
            mode="multiple"
            size="large"
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
            optionLabelProp="label"
            listHeight={270}
        >
            {renderOptions(data)}
        </Select>
    );
}

export default SearchInput;
