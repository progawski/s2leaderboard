import React, {useState, useEffect} from 'react';
import Leaderboard from './components/Leaderboard';
import Player from './components/Player';
import RankSelector from './components/RankSelector';

export default function App() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alphaPlayerData, setAlphaPlayerData] = useState(null);
    const [bravoPlayerData, setBravoPlayerData] = useState(null);
    const [bravoPlayerVisible, setBravoPlayerVisible] = useState(true);
    const [playersContainerVisible, setPlayersContainerVisible] = useState(false);

    const currentYear = new Date().getFullYear();
    const mediaQuerySmall = window.matchMedia('(max-width: 767.98px)');
    const mediaQueryLarge = window.matchMedia('(max-width: 1199.98px)');
    const playersContainer = document.querySelector('.players-container');

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(
                    'http://78.47.147.210:9000/api/v1/ratings/all?withPlayerStats=true'
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

    function getAlphaPlayerData(data){
        setAlphaPlayerData(data);
        setPlayersContainerVisible(true);
        console.log(playersContainerVisible);
    }

    function getBravoPlayerData(data){
        setBravoPlayerData(data);
    }

    // if(mediaQuerySmall.matches && playersContainerVisible){
    //     setPlayersContainerVisible(false);
    // }

    mediaQuerySmall.addEventListener('change', event => {
      if (event.matches) {
        setPlayersContainerVisible(false);
      } else {
        setPlayersContainerVisible(true);
      }
    })
    
    if(mediaQueryLarge.matches && bravoPlayerVisible){
        setBravoPlayerVisible(false);
    }

    mediaQueryLarge.addEventListener('change', event => {
      if (event.matches) {
        setBravoPlayerVisible(false);
      } else {
        setBravoPlayerVisible(true);
      }
    })

    // if(playersContainerVisible){
    //     playersContainer.style.display = 'fixed';
    // } else {
    //     playersContainer.style.display = 'none';
    // }

    document.addEventListener('click', (e) => {
        if(playersContainerVisible && playersContainer.style.display === 'flex') setPlayersContainerVisible(false);
      });
    
    return(
        <div className='background'>
            <div className="content noselect">
                <header>
                    <div>
                        <img id='header-logo' src='images/s2_logo.png'/>
                        <h1 id="header-title">RANKED LEADERBOARD</h1>   
                    </div>
                    <RankSelector/>
                </header>
                <main>
                    {/* {playersContainerVisible? */}
                    <div className='players-container' style={{display: (playersContainerVisible || !mediaQuerySmall.matches)?  'flex' : 'none'}}>
                        <Player playerData={alphaPlayerData} isAlpha={true}/>
                        {bravoPlayerVisible? <Player playerData={bravoPlayerData} isAlpha={false}/> : null}
                    </div>
                    {/* : null} */}
                    <Leaderboard getAlphaPlayerData={getAlphaPlayerData} getBravoPlayerData={getBravoPlayerData} data={data} isLoading={loading}/>
                </main>
                <footer>
                    <div>COPYRIGHT @ {currentYear} BY PIOTR 'PROTO' ROGAWSKI</div>
                </footer>
            </div>
        </div>
    )
}