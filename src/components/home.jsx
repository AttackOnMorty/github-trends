import { Divider } from 'antd';

import CommitsTrend from '../assets/commits-trend.png';
import IssuesTrend from '../assets/issues-trend.png';
import ReleasesTrend from '../assets/releases-trend.png';
import StarsTrend from '../assets/stars-trend.png';

function Home() {
  return (
    <div>
      <div className="max-w-5xl mx-auto py-20 sm:py-24 lg:py-32">
        <h1 className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
          Compare GitHub repos by the history of stars, commits, releases...
        </h1>
        <p className="mt-6 text-lg text-slate-600 text-center max-w-3xl mx-auto">
          Help developers make informed decisions about which open source
          projects to use
        </p>
      </div>
      <Divider />
      {GetTrendSection('Stars Trend', StarsTrend)}
      <Divider />
      {GetTrendSection('Commits Trend', CommitsTrend)}
      <Divider />
      {GetTrendSection('Releases Trend', ReleasesTrend)}
      <Divider />
      {GetTrendSection('Issues Trend', IssuesTrend)}
    </div>
  );
}

function GetTrendSection(title, imgSrc) {
  return (
    <div className="py-2 sm:py-4 lg:py-8">
      <p className="mt-4 text-3xl sm:text-4xl text-slate-900 font-bold tracking-tight text-center">
        {title}
      </p>
      <img src={imgSrc} alt="Stars Trend" className="mt-8" />
    </div>
  );
}

export default Home;
