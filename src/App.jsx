import { GithubOutlined, HeartFilled } from '@ant-design/icons';
import { Button } from 'antd';
import _ from 'lodash';
import { useCallback, useState } from 'react';

import SearchInput from './components/searchInput';
import CommitTrend from './components/trends/commitTrend';
import ReleaseTrend from './components/trends/releaseTrend';
import StarTrend from './components/trends/starTrend';

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
        <div className="h-full flex flex-col">
            <header className="px-14 py-4 flex justify-between">
                <h1 className="text-2xl font-mono pointer-events-none">
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
            <div className="flex flex-1 flex-col bg-[#f5f5f5]">
                <div className="flex flex-1 justify-center">
                    <main className="max-w-6xl px-10 pb-6 flex flex-1 flex-col">
                        <div className="my-6">
                            <SearchInput
                                className="mb-8"
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
                            <div className="grid grid-rows-3 grid-cols-1 gap-8 flex-1">
                                <StarTrend repos={repos} />
                                <CommitTrend repos={repos} />
                                <ReleaseTrend repos={repos} />
                            </div>
                        ) : (
                            <div className="pt-40 flex-1 flex flex-col items-center text-3xl font-mono">
                                <div>
                                    Compare GitHub repos by the history of
                                </div>
                                <div>
                                    <span className="text-red-600">stars</span>,{' '}
                                    <span className="text-red-600">
                                        commits
                                    </span>{' '}
                                    and{' '}
                                    <span className="text-red-600">
                                        releases
                                    </span>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
                <footer className="pb-6 flex justify-center">
                    <p className="text-sm font-light">
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
                </footer>
            </div>
        </div>
    );
}

export default App;
