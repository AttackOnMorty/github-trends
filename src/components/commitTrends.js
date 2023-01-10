import {
    CategoryScale,
    Chart as ChartJS,
    Colors,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
} from 'chart.js';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { getCommitCountWeekly } from '../api';

ChartJS.register(
    CategoryScale,
    Colors,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip
);

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
        title: {
            display: true,
            // TODO: Commit icon
            text: 'Commits',
        },
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

    return <div>{data && <Line options={options} data={data} />}</div>;
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
