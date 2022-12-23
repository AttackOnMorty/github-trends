import _ from 'lodash';
import { useCallback, useState } from 'react';

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
        <div className="px-14 py-8 flex h-full flex-col">
            <header className="mb-6 text-3xl font-bold font-sans">
                GitHub Trends
            </header>
            <div className="mb-6">
                <SearchInput
                    placeholder="Enter a repository name"
                    style={{
                        width: '50%',
                    }}
                    repos={repos}
                    setRepos={setRepos}
                    debouncedSetRepos={debouncedSetRepos}
                />
            </div>
            <div className="flex flex-1">
                <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
                    <StarTrends repos={repos} />
                </div>
            </div>
        </div>
    );
};

export default App;
