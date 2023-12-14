import { Empty, Spin } from 'antd';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
} from 'chart.js';
import { merge } from 'lodash';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    Legend,
    LinearScale,
    BarElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
);

const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'time',
            stacked: true,
        },
        y: {
            stacked: true,
            ticks: {
                precision: 0,
            },
        },
    },
};

function BarChart({ title, options, data }) {
    return (
        <div className="p-4 flex flex-col rounded-md shadow bg-white">
            <h2 className="text-xl font-medium">{title}</h2>
            {/* eslint-disable-next-line no-nested-ternary */}
            {data ? (
                data.labels.length === 0 ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                ) : (
                    <div className="h-64">
                        <Bar
                            options={merge(baseOptions, options)}
                            data={data}
                        />
                    </div>
                )
            ) : (
                <div className="h-64 flex justify-center items-center">
                    <Spin />
                </div>
            )}
        </div>
    );
}

export default BarChart;
