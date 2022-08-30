import React, {useState, useEffect} from 'react';
import Leaderboard from './components/Leaderboard';
import Player from './components/Player';
import RankSelector from './components/RankSelector';

export default function App() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [playerId, setPlayerId] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(
                    'https://78.47.147.210:9001/api/v1/ratings/all'
                );
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                let actualData = await response.json();
                setData(actualData.filter(el => el.tierNumber > 0).sort((a, b) => (a.mu < b.mu)? 1 : -1).map((el, index) => {
                    return {  
                        rank: index + 1,
                        ...el
                    }
                }));
                setError(null);
            } catch(err) {
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false);
            }
 
        }
        getData();
    }, [])

    function getPlayerId(id){
        setPlayerId(id);
    }

    return(
        <div className='background'>
            <div className="content noselect">
                <header>
                    <img id='header-logo' src='images/s2_logo.png'/>
                    <h1 id="header-title">RANKED LEADERBOARD</h1>     
                    <RankSelector/>
                </header>
                <main>     
                    <Player playerId={playerId}/>
                    <Player playerId={playerId}/>
                    <Leaderboard getPlayerId={getPlayerId} data={data} isLoading={loading}/>
                </main>
                <footer>

                </footer>
            </div>
        </div>
    )
}