import { GithubOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import _ from 'lodash';
import { useCallback, useState } from 'react';

import CommitTrends from './components/commitTrends';
import SearchInput from './components/searchInput';
import StarTrends from './components/starTrends';

const App = () => {
    const [repos, setRepos] = useState([]);

    const debouncedSetRepos = (repos) => {
        debounce(repos);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounce = useCallback(
        _.debounce((repos) => setRepos(repos), 300),
        []
    );

    return (
        <div className="max-w-6xl m-auto h-full flex flex-col">
            <header className="px-14 py-4 flex justify-between">
                <h1 className="text-2xl font-bold font-mono pointer-events-none">
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
            <main className="px-14 pb-4 flex flex-col flex-1">
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
                <div className="grid grid-cols-1 grid-rows-2 gap-4 flex-1">
                    <StarTrends repos={repos} />
                    <CommitTrends repos={repos} />
                </div>
            </main>
        </div>
    );
};

export default App;
