import { GithubOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import Logo from '../assets/logo.png';

function Header() {
    return (
        <header className="px-6 sm:px-14 py-4 flex justify-between">
            <div className="flex items-center">
                <img src={Logo} alt="logo" className="w-10 h-10 mr-4" />
                <h1 className="text-lg sm:text-2xl font-mono pointer-events-none">
                    GitHub Trends
                </h1>
            </div>
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
