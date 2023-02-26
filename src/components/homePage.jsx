function HomePage() {
    return (
        <div className="pt-28 sm:pt-40 flex-1 flex flex-col items-center text-2xl sm:text-3xl font-mono">
            <div>Compare GitHub repos by the history of</div>
            <div>
                <span className="text-red-600">stars</span>,{' '}
                <span className="text-red-600">commits</span> and{' '}
                <span className="text-red-600">releases</span>
            </div>
        </div>
    );
}

export default HomePage;
