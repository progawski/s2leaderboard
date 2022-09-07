import React, {useState, useEffect} from 'react';
import Leaderboard from './components/Leaderboard';
import Player from './components/Player';
import RankSelector from './components/RankSelector';

export default function App() {

    const [data, setData] = useState(null); // Filtered and sorted data from API's response
    // const [error, setError] = useState(null);
    const [alphaPlayerData, setAlphaPlayerData] = useState(null); // Data of selected alpha player
    const [bravoPlayerData, setBravoPlayerData] = useState(null); // Data of selected bravo player

    const [bravoPlayerVisible, setBravoPlayerVisible] = useState(true);
    const [playersContainerVisible, setPlayersContainerVisible] = useState(false);

    const currentYear = new Date().getFullYear(); // Get current year to display in footer
    const playersContainer = document.querySelector('.players-container'); // Alpha and bravo players' container

    // Media queries
    const mediaQuerySmall = window.matchMedia('(max-width: 767.98px)'); // Show only alpha player in a modal
    const mediaQueryLarge = window.matchMedia('(max-width: 1199.98px)'); // Show only alpha player next to the leaderboard

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(
                    'https://stats.soldat2.com:9001/api/v1/ratings/all?withPlayerStats=true'
                );
                if (!response.ok) {
                    throw new Error(
                        `HTTP error status: ${response.status}`
                    );
                }
                // Filter data so the leaderboard shows only ranked players. Sort them in ascending order basing on "mu" indicator
                let responseData = await response.json();
                responseData = responseData.filter(el => el.tierNumber > 0).sort((a, b) => (a.mu < b.mu)? 1 : -1);
                setData(responseData.map((el, index) => {
                    return {  
                        rank: index + 1,
                        ...el
                    }
                }));
                // setError(null);
            } catch(err) {
                // setError(err.message);
                console.log(err.message);
                setData(null);
            }
        }
        getData();
    }, [])

    console.log(playersContainerVisible);

    // Get alpha player's data from Leaderboard in order to pass it to the Player component
    const getAlphaPlayerData = (data) => {
        setAlphaPlayerData(data);
        setPlayersContainerVisible(true);
    }

    // Get bravo player's data from Leaderboard in order to pass it to the Player component
    const getBravoPlayerData = (data) => {
        setBravoPlayerData(data);
    }

    mediaQuerySmall.addEventListener('change', (e) => {
      e.matches? setPlayersContainerVisible(false) : setPlayersContainerVisible(true);
    });
    
    if(mediaQueryLarge.matches && bravoPlayerVisible){
        setBravoPlayerVisible(false);
    }

    mediaQueryLarge.addEventListener('change', (e) => {
      e.matches? setBravoPlayerVisible(false) : setBravoPlayerVisible(true);
    });

    // Close modal on click anywhere
    document.addEventListener('click', () => {
        if(playersContainerVisible && playersContainer.style.display === 'flex'){
            setPlayersContainerVisible(false); 
        }
    });
    
    return(
        <div className='background'>
            <div className="content noselect">
                <header>
                    <div>
                        <img id='header-logo' src='images/s2_logo.png' alt='Soldat 2 Logo'/>
                        <h1 id="header-title">RANKED LEADERBOARD</h1>   
                    </div>
                    <RankSelector/>
                </header>
                <main>
                    <div className='players-container' style={{display: (playersContainerVisible || !mediaQuerySmall.matches)?  'flex' : 'none'}}>
                        <Player playerData={alphaPlayerData} isAlpha={true}/>
                        {bravoPlayerVisible? <Player playerData={bravoPlayerData} isAlpha={false}/> : null}
                    </div>
                    <Leaderboard getAlphaPlayerData={getAlphaPlayerData} getBravoPlayerData={getBravoPlayerData} data={data}/>
                </main>
                <footer>
                    <div>COPYRIGHT @ {currentYear} BY PIOTR 'PROTO' ROGAWSKI</div>
                </footer>
            </div>
        </div>
    )
}