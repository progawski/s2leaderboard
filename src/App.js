import { set } from 'lodash';
import React, {useState, useEffect} from 'react';
import Leaderboard from './components/Leaderboard';
import Player from './components/Player';
import RankSelector from './components/RankSelector';

export default function App() {

    const [data, setData] = useState(null); // Filtered and sorted data from API's response
    // const [error, setError] = useState(null);

    const [playlistCode, setPlaylistCode] = useState("CTF-Standard-6"); // Playlist code from select input
    const [resetLeaderboard, setResetLeaderboard] = useState(false);

    const [alphaPlayerData, setAlphaPlayerData] = useState(null); // Data of selected alpha player
    const [bravoPlayerData, setBravoPlayerData] = useState(null); // Data of selected bravo player

    const [bravoPlayerVisible, setBravoPlayerVisible] = useState(true);
    const [playersContainerVisible, setPlayersContainerVisible] = useState(true);

    const currentYear = new Date().getFullYear(); // Get current year to display in footer
    const playersContainer = document.querySelector('.players-container'); // Alpha and bravo players' container

    // Media queries
    const mediaQuerySmall = window.matchMedia('(max-width: 767.98px)'); // Show only alpha player in a modal
    const mediaQueryLarge = window.matchMedia('(max-width: 1199.98px)'); // Show only alpha player next to the leaderboard

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(
                    `https://stats.soldat2.com:9001/api/v1/ratings/all?withPlayerStats=true&playlistCode=${playlistCode}`
                );
                if (!response.ok) {
                    throw new Error(
                        `HTTP error status: ${response.status}`
                    );
                }
                // Filter data so the leaderboard shows only ranked players. Sort them in ascending order basing on "mu" indicator
                let responseData = await response.json();
                responseData = responseData.filter(el => el.tierNumber > 0).sort((a, b) => (a.lowerSkillEstimate < b.lowerSkillEstimate)? 1 : -1);
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
    }, [playlistCode])

    const getPlaylistCode = (data) => {
        setPlaylistCode(data);
        setResetLeaderboard(!resetLeaderboard);
    }

    // Get alpha player's data from Leaderboard in order to pass it to the Player component
    const getAlphaPlayerData = (data) => { 
        setAlphaPlayerData(data);
        setPlayersContainerVisible(true);    
    }

    // Get bravo player's data from Leaderboard in order to pass it to the Player component
    const getBravoPlayerData = (data) => {
        setBravoPlayerData(data);
    }

    if(mediaQueryLarge.matches && bravoPlayerVisible){
        setBravoPlayerVisible(false);
    }

    if(mediaQuerySmall.matches && playersContainerVisible){
        setPlayersContainerVisible(false);
    }

    mediaQueryLarge.addEventListener('change', (e) => {
        if(e.matches){
            setBravoPlayerVisible(false);
        } else {
            setBravoPlayerVisible(true);
        }
    });

    mediaQuerySmall.addEventListener('change', (e) => {
      if(!e.matches){
        setPlayersContainerVisible(true);
      } else{
        setPlayersContainerVisible(false);
      }
    });

    // Close modal on click anywhere
    // document.addEventListener('click', () => {
    //     if(mediaQuerySmall.matches && playersContainerVisible && playersContainer.style.display === 'flex'){
    //         playersContainer.style.display = 'none';
    //         setPlayersContainerVisible(false);
    //     }
    // });
    
    return(
        <div className='background'>
            <div className="content noselect">
                <header>
                    <div>
                        <img id='header-logo' src='images/s2_logo.png' alt='Soldat 2 Logo'/>
                        <h1 id="header-title">RANKED LEADERBOARD</h1>   
                    </div>
                    <RankSelector getPlaylistCode={getPlaylistCode}/>
                </header>
                <main>
                    <div className='players-container' style={{display: (playersContainerVisible)? 'flex' : 'none'}}>
                        <Player playerData={alphaPlayerData} isAlpha={true}/>
                        {bravoPlayerVisible? <Player playerData={bravoPlayerData} isAlpha={false} resetLeaderboard={resetLeaderboard}/> : null}
                    </div>
                    <Leaderboard playlistCode={playlistCode} getAlphaPlayerData={getAlphaPlayerData} getBravoPlayerData={getBravoPlayerData} data={data} resetLeaderboard={resetLeaderboard}/>
                </main>
                <footer>
                    <div>COPYRIGHT @ {currentYear} BY PIOTR 'PROTO' ROGAWSKI</div>
                </footer>
            </div>
        </div>
    )
}