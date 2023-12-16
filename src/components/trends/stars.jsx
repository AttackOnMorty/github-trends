import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { getStargazerFirstStaredAt } from '../../api';
import LineChart from '../charts/lineChart';

const GITHUB_COUNT_LIMIT = 40000;
const MAX_REQUEST_AMOUNT = 20;
const DATE_FORMAT = 'YYYY-MM';

const options = {
  scales: {
    x: {
      time: {
        unit: 'year',
        tooltipFormat: 'MMM YYYY',
      },
    },
    y: {
      ticks: {
        callback(value) {
          return value < 1000 ? value : `${value / 1000}k`;
        },
      },
    },
  },
};

function Stars({ repos }) {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (repos.length === 0) {
        setData(null);
        return;
      }

      const results = await Promise.all(repos.map(transformRepoAsync));
      const labels = getLabels(results);
      const datasets = getDatasets(results, labels);

      setData({
        labels,
        datasets,
      });
    };

    fetchData();
  }, [repos]);

  return <LineChart title="⭐ Stars" options={options} data={data} />;
}

async function transformRepoAsync({ fullName, currentStars }) {
  const [owner, repo] = fullName.split('/');
  const pages = getPages(currentStars);

  const data = await Promise.all(
    pages.map(async (page) => {
      const date = await getStargazerFirstStaredAt({
        owner,
        repo,
        page,
      });

      return {
        date: dayjs(date).format(DATE_FORMAT),
        stars: page,
      };
    }),
  );

  data.push({
    date: dayjs().format(DATE_FORMAT),
    stars: currentStars,
  });

  return {
    fullName,
    data,
  };
}

function getPages(currentStars) {
  const res = [];
  let index = 1;

  const count =
    currentStars > GITHUB_COUNT_LIMIT ? GITHUB_COUNT_LIMIT : currentStars;
  const interval = Math.floor(count / MAX_REQUEST_AMOUNT);

  res.push(index);

  for (let i = 0; i < MAX_REQUEST_AMOUNT; i++) {
    index += interval;
    res.push(index <= count ? index : count);
  }

  return res;
}

function getLabels(repos) {
  const startDate = dayjs
    .min(repos.map((repo) => dayjs(repo.data[0].date)))
    .format(DATE_FORMAT);
  const totalMonths = dayjs().diff(startDate, 'month');

  const res = [];
  let current = dayjs().format(DATE_FORMAT);

  // NOTE: using <= to include current month
  for (let i = 0; i <= totalMonths; i++) {
    res.unshift(dayjs(current).format(DATE_FORMAT));
    current = dayjs(current).add(-1, 'month').format(DATE_FORMAT);
  }

  return res;
}

function getDatasets(repos, labels) {
  return repos.map(({ fullName, data }) => ({
    label: fullName,
    data: getData(data, labels),
    spanGaps: true,
    cubicInterpolationMode: 'monotone',
  }));
}

function getData(data, labels) {
  const res = [];

  const dates = data.map((item) => item.date);
  const stars = data.map((item) => item.stars);

  for (let i = 0; i < labels.length; i++) {
    const index = dates.indexOf(labels[i]);
    res.push(index === -1 ? null : stars[index]);
  }

  return res;
}

export default Stars;
