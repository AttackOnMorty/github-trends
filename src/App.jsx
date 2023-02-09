import { GithubOutlined, HeartFilled } from '@ant-design/icons';
import { Button } from 'antd';
import _ from 'lodash';
import { useCallback, useState } from 'react';

import SearchInput from './components/searchInput';
import CommitsTrend from './components/trends/commitsTrend';
import ReleasesTrend from './components/trends/releasesTrend';
import StarsTrend from './components/trends/starsTrend';

function App() {
    const [repos, setRepos] = useState([]);

    const debounce = useCallback(
        _.debounce((repos) => setRepos(repos), 300),
        []
    );

    const debouncedSetRepos = (repos) => {
        debounce(repos);
    };

    return (
        <div className="max-w-6xl m-auto h-full flex flex-col">
            <header className="px-14 py-4 flex justify-between">
                <h1 className="text-2xl font-semibold font-mono pointer-events-none">
                    GitHub Trends
                </h1>
                <a
                    href="https://github.com/AttackOnMorty/github-trends"
                    target="_black"
                    rel="noreferrer"
                >
                    <Button type="text">
                        <GithubOutlined className="text-xl" />
                    </Button>
                </a>
            </header>
            <main className="px-14 pb-5 flex flex-col flex-1">
                <div className="mb-4">
                    <SearchInput
                        placeholder="Enter a repository name"
                        style={{
                            width: '100%',
                        }}
                        repos={repos}
                        setRepos={setRepos}
                        debouncedSetRepos={debouncedSetRepos}
                    />
                </div>

                {repos.length !== 0 ? (
                    <div className="grid grid-rows-3 grid-cols-1 gap-4 flex-1">
                        <StarsTrend repos={repos} />
                        <CommitsTrend repos={repos} />
                        <ReleasesTrend repos={repos} />
                    </div>
                ) : (
                    <div className="pt-40 flex-1 flex flex-col items-center text-3xl font-mono">
                        <div>Compare GitHub repos by the history of</div>
                        <div>
                            <span className="text-red-600">stars</span>,{' '}
                            <span className="text-red-600">commits</span> and{' '}
                            <span className="text-red-600">releases</span>
                        </div>
                    </div>
                )}
            </main>
            <footer>
                <div className="py-4 flex justify-center">
                    <p className="text-sm">
                        Crafted with{' '}
                        <HeartFilled style={{ color: '#eb2f96' }} /> by{' '}
                        <a
                            className="text-blue-500 hover:underline"
                            href="https://github.com/AttackOnMorty"
                            target="_black"
                            rel="noreferrer"
                        >
                            Luke Mao
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
