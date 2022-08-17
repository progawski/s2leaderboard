import react from 'react';
import Leaderboard from './components/Leaderboard';
import PlayerStats from './components/PlayerStats';
import RankSelector from './components/RankSelector';

export default function App() {
    return(
        <div className='background'>
            <div className="content">
                <header>
                    <img id='header-logo' src='images/s2_logo.png'/>
                    <h1 id="header-title">RANKED LEADERBOARD</h1>     
                    <RankSelector/>
                </header>
                <main>
                    <PlayerStats/>
                    <Leaderboard/>
                </main>
                <footer>

                </footer>
            </div>
        </div>
    )
}