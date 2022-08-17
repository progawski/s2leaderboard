import react, {useState, useEffect} from 'react';
import Leaderboard from './components/Leaderboard';
import PlayerStats from './components/PlayerStats';
import RankSelector from './components/RankSelector';

export default function App() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setData(actualData);
                setError(null);
                console.log(actualData);
            } catch(err) {
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false);
            }
 
        }
        getData();
    }, [])


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
                    <Leaderboard data={data}/>
                </main>
                <footer>

                </footer>
            </div>
        </div>
    )
}