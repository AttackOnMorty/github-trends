import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { getWeeklyCommits } from '../../api';
import { ReactComponent as CommitIcon } from '../../assets/commit.svg';
import LineChart from '../charts/lineChart';

const options = {
  scales: {
    x: {
      time: {
        unit: 'month',
        tooltipFormat: 'MMM DD',
      },
    },
  },
  interaction: {
    mode: 'index',
  },
  plugins: {
    tooltip: {
      position: 'nearest',
      callbacks: {
        title(context) {
          return `The week of ${context[0].label}`;
        },
      },
    },
  },
};

function Commits({ repos }) {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (repos.length === 0) {
        setData(null);
        return;
      }

      const results = await Promise.all(repos.map(getWeeklyCommits));
      const totalWeeks = results[0].data.length;
      const labels = getLabels(totalWeeks);
      const datasets = getDatasets(results);

      setData({
        labels,
        datasets,
      });
    };

    fetchData();
  }, [repos]);

  return (
    <LineChart
      title={
        <div className="flex items-center">
          <CommitIcon className="mr-1 inline fill-green-600" />
          <span>Commits</span>
        </div>
      }
      options={options}
      data={data}
    />
  );
}

function getLabels(totalWeeks) {
  const dates = [];
  let currentWeek = dayjs().subtract(7, 'day');

  for (let i = 0; i < totalWeeks; i++) {
    dates.push(currentWeek.format('YYYY-MM-DD'));
    currentWeek = currentWeek.subtract(7, 'day');
  }

  return dates.reverse();
}

function getDatasets(results) {
  return results.map(({ name, data }) => ({
    label: name,
    data,
    spanGaps: true,
    cubicInterpolationMode: 'monotone',
  }));
}

export default Commits;
