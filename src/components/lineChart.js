import { Spin } from 'antd';
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
import { merge } from 'lodash';
import { Line } from 'react-chartjs-2';

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

const LineChart = ({ title, options, data }) => {
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
            },
            y: {
                min: 0,
            },
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
            },
        },
    };

    return (
        <div className="flex flex-col">
            <h2 className="text-xl font-medium">{title}</h2>
            {data ? (
                <div className="h-64">
                    <Line options={merge(baseOptions, options)} data={data} />
                </div>
            ) : (
                <div className="h-64 flex justify-center items-center">
                    <Spin />
                </div>
            )}
        </div>
    );
};

export default LineChart;
