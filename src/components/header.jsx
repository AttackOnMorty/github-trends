import { GithubOutlined } from '@ant-design/icons';
import { Button } from 'antd';

function Header() {
    return (
        <header className="px-6 sm:px-14 py-4 flex justify-between">
            <h1 className="text-lg sm:text-2xl font-mono pointer-events-none">
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
    );
}

export default Header;
