import { useState } from 'react';
import SearchInput from './components/searchInput';
import StarTrends from './components/starTrends';

const App = () => {
    const [repos, setRepos] = useState([]);

    return (
        <div className="px-10 py-4">
            <header className="mb-6 text-2xl font-bold">GitHub Trends</header>
            <div className="mb-6">
                <SearchInput
                    placeholder="Enter a repository name"
                    style={{
                        width: '50%',
                    }}
                    repos={repos}
                    setRepos={setRepos}
                />
            </div>
            <div className="grid grid-cols-2 gap-10">
                <StarTrends repos={repos} />
            </div>
        </div>
    );
};

export default App;
