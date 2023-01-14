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

const LineChart = ({ title, options, data }) => (
    <div className="flex flex-col">
        <h2 className="text-xl font-medium">{title}</h2>
        <div className="flex-1">
            <Line options={options} data={data} />
        </div>
    </div>
);

export default LineChart;
