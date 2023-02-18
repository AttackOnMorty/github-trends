import _ from 'lodash';
import { useCallback, useState } from 'react';
import Footer from './components/footer';
import Header from './components/header';
import HomePage from './components/homePage';

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
            <Header />
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
                            <HomePage />
                        )}
                    </main>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default App;
