import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { getCommitCountWeekly } from '../api';
import LineChart from './lineChart';

const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'month',
                tooltipFormat: 'MMM DD',
            },
        },
        y: {
            min: 0,
        },
    },
    interaction: {
        mode: 'index',
    },
    plugins: {
        legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
            },
        },
        colors: {
            forceOverride: true,
        },
        tooltip: {
            usePointStyle: true,
            position: 'nearest',
            callbacks: {
                title: function (context) {
                    return `The week of ${context[0].label}`;
                },
            },
        },
    },
};

const CommitTrends = ({ repos }) => {
    const [data, setData] = useState();

    useEffect(() => {
        if (repos.length === 0) {
            setData(null);
            return;
        }

        Promise.all(repos.map(getData)).then((data) =>
            setData(getDataBy(data, repos))
        );
    }, [repos]);

    return (
        <>
            {data && (
                <LineChart title="Commits" options={options} data={data} />
            )}
        </>
    );
};

function getData({ fullName, pages }) {
    const [owner, repo] = fullName.split('/');
    return getCommitCountWeekly({ owner, repo });
}

function getDataBy(data, repos) {
    const labels = getLabels();
    const datasets = getDatasets();

    return {
        labels,
        datasets,
    };

    function getLabels() {
        const res = [];
        const totalWeeks = data[0].length;
        let current = dayjs().weekday(0);

        for (let i = 0; i < totalWeeks; i++) {
            res.unshift(current.format());
            current = current.weekday(-7);
        }

        return res;
    }

    function getDatasets() {
        const res = [];

        for (let i = 0; i < repos.length; i++) {
            const { fullName: label } = repos[i];
            res.push({
                label,
                data: data[i],
                spanGaps: true,
                cubicInterpolationMode: 'monotone',
            });
        }

        return res;
    }
}

export default CommitTrends;
