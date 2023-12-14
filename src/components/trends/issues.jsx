import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { getIssues } from '../../api';
import { ReactComponent as IssueIcon } from '../../assets/issue.svg';
import BarChart from '../charts/barChart';

const options = {
    scales: {
        x: {
            time: {
                unit: 'month',
                tooltipFormat: 'MMM YYYY',
            },
        },
    },
    interaction: {
        mode: 'index',
    },
    plugins: {
        tooltip: {
            position: 'nearest',
        },
    },
};

function Issues({ repos }) {
    const [data, setData] = useState();

    useEffect(() => {
        if (repos.length === 0) {
            setData(null);
            return;
        }

        Promise.all(repos.map(transformRepoAsync)).then((repos) => {
            const labels = Object.keys(repos[0].issues);
            const datasets = getDatasets(repos);

            setData({
                labels,
                datasets,
            });
        });
    }, [repos]);

    return (
        <BarChart
            title={
                <div className="flex items-center">
                    <IssueIcon className="mr-1 inline fill-green-600" />
                    <span> Issues</span>
                </div>
            }
            options={options}
            data={data}
        />
    );
}

async function transformRepoAsync({ fullName }) {
    const [owner, repo] = fullName.split('/');
    const dateRange = getDateRange();

    return {
        fullName,
        issues: await getIssues({ owner, repo, dateRange }),
    };
}

function getDateRange() {
    const endMonth = dayjs().endOf('month');
    const startMonth = endMonth.subtract(6, 'month');

    return [startMonth.toISOString(), endMonth.toISOString()];
}

function getDatasets(repos) {
    const res = [];
    const barPercentage = repos.length === 1 ? 0.5 : 1;

    repos.forEach(({ fullName, issues }) => {
        res.push(
            ...[
                {
                    label: `${fullName} - closed`,
                    data: Object.values(issues).map((item) => item[1]),
                    spanGaps: true,
                    backgroundColor: '#57A1E5',
                    hoverBackgroundColor: '#57A1E5',
                    barPercentage,
                    stack: fullName,
                },
                {
                    label: `${fullName} - open`,
                    data: Object.values(issues).map((item) => item[0]),
                    spanGaps: true,
                    backgroundColor: '#ED6E86',
                    hoverBackgroundColor: '#ED6E86',
                    barPercentage,
                    stack: fullName,
                },
            ],
        );
    });

    return res;
}

export default Issues;
