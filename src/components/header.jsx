import { GithubOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import GitHubRanking from '../assets/github-ranking.png';
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
            <div className="flex items-center">
                <a
                    href="https://www.github-ranking.dev/"
                    target="_black"
                    rel="noreferrer"
                >
                    <Tooltip title="Search top repos, devs and orgs via GitHub Ranking">
                        <Button type="text">
                            <img
                                src={GitHubRanking}
                                alt="GitHub Ranking"
                                style={{ width: 20, height: 20 }}
                            />
                        </Button>
                    </Tooltip>
                </a>
                <a
                    href="https://github.com/AttackOnMorty/github-trends"
                    target="_black"
                    rel="noreferrer"
                >
                    <Button type="text">
                        <GithubOutlined className="text-xl" />
                    </Button>
                </a>
            </div>
        </header>
    );
}

export default Header;
