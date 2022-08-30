import React, {useState, useEffect} from 'react';
import PlayerStats from './PlayerStats';
import Spinner from './Spinner';

export default function Player(props) {

    const [playerData, setPlayerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(
                    `https://78.47.147.210:9001/api/v1/ratings/playfab/${props.playerId}`
                );
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                let actualData = await response.json();
                setPlayerData(actualData);
                setError(null);
            } catch(err) {
                setError(err.message);
                setPlayerData(null);
            } finally {
                setLoading(false);
            }
 
        }
        getData();
    }, [props.playerId])

    console.log(playerData);

    function formatGames(games) {
        return games.join('-');
    }

    function calculateKd(stats) {
        return (stats[0] / stats[1]).toFixed(2);
    }

    function formatTime(time) {
        const totalMinutes = Math.floor(time / (1000 * 60 ));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}mins`;
    }

    return(
        <div className='player-container'>
            {!playerData? <Spinner /> : 
                <>
                    <div className='player-stats-name' style={{backgroundColor:  props.isAlpha? 'rgba(228, 11, 66, 0.5)' : 'rgba(39, 143, 207, 0.5)'}}>{playerData.displayName}</div>
                    <img className='rank-img-big' src={`images/tiers/${playerData.playerStats.rating.tierNumber}.png`} alt='Rank icon'/>
                    <div className='player-stats-container'>
                        <PlayerStats image={'star-icon'} data={playerData.playerStats.rating.formattedTier} />
                        <PlayerStats image={'gamepad-icon'} data={playerData.playerStats.totalGames} />
                        <PlayerStats image={'trophy-icon'} data={formatGames([playerData.playerStats.wonGames, playerData.playerStats.tiedGames, playerData.playerStats.lostGames])} />
                        <PlayerStats image={'crosshair-icon'} data={playerData.playerStats.totalKills} />
                        <PlayerStats image={'skull-icon'} data={playerData.playerStats.totalDeaths} />
                        <PlayerStats image={'percent-icon'} data={calculateKd([playerData.playerStats.totalKills, playerData.playerStats.totalDeaths])} />
                        <PlayerStats image={'flag-icon'} data={playerData.playerStats.totalCaps} />
                        <PlayerStats image={'clock-icon'} data={formatTime(playerData.playerStats.totalGatherTime)} />
                    </div>
                </>
            }
        </div>
    )
}