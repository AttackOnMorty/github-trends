import _ from 'lodash';
import { useCallback, useState } from 'react';

import Footer from './components/footer';
import Header from './components/header';
import Home from './components/home';
import SearchInput from './components/searchInput';
import Commits from './components/trends/commits';
import Issues from './components/trends/issues';
import Releases from './components/trends/releases';
import Stars from './components/trends/stars';

function App() {
    const [repos, setRepos] = useState([]);

    const debounce = useCallback(
        _.debounce((repos) => setRepos(repos), 300),
        [],
    );

    const debouncedSetRepos = (repos) => {
        debounce(repos);
    };

    return (
        <div className="h-full flex flex-col">
            <Header />
            <div className="flex flex-1 flex-col bg-[#f5f5f5]">
                <div className="flex flex-1 justify-center">
                    <main className="max-w-6xl px-6 pb-6 flex flex-1 flex-col">
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
                            <div className="grid grid-rows-4 grid-cols-1 gap-8 flex-1">
                                <Stars repos={repos} />
                                <Commits repos={repos} />
                                <Issues repos={repos} />
                                <Releases repos={repos} />
                            </div>
                        ) : (
                            <Home />
                        )}
                    </main>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default App;
