import SearchInput from './components/searchInput';

function App() {
    return (
        <div className="px-10 py-4">
            <header className="mb-6 text-2xl font-bold">GitHub Trends</header>
            <SearchInput
                placeholder="Enter a repository name"
                style={{
                    width: '50%',
                }}
            />
        </div>
    );
}

export default App;
