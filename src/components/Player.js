import React from 'react';
import PlayerStats from './PlayerStats';
import Spinner from './Spinner';

export default function Player(props) {

    const playerData = props.playerData;

    // Separate won, tied and lost games with "-"
    function formatGames(games) {
        return games.join('-');
    }

    // Calculace KD ratio
    function calculateKd(stats) {
        return (stats[0] / stats[1]).toFixed(2);
    }

    // Convert time provided in milliseconds to hours and minutes
    function formatTime(time) {
        const totalMinutes = Math.floor(time / (1000 * 60 ));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}mins`;
    }

    return(
        <div className='player-container'>
            <div className='player-stats-name' style={{backgroundColor:  props.isAlpha? 'rgba(228, 11, 66, 0.5)' : 'rgba(39, 143, 207, 0.5)'}}><span>{playerData? playerData.displayName : ''}</span></div>
            {(!playerData)? <Spinner/> : <img className='rank-img-big' src={`images/tiers/${playerData.playerStats.rating.tierNumber}.png`} alt='Rank icon'/>}
            <div className='player-stats-container'>
                <PlayerStats image={'star-icon'} data={playerData? playerData.playerStats.rating.formattedTier : ''} />
                <PlayerStats image={'gamepad-icon'} data={playerData? playerData.playerStats.totalGames : ''} />
                <PlayerStats image={'trophy-icon'} data={playerData? formatGames([playerData.playerStats.wonGames, playerData.playerStats.tiedGames, playerData.playerStats.lostGames]) : ''} />
                <PlayerStats image={'crosshair-icon'} data={playerData? playerData.playerStats.totalKills : ''} />
                <PlayerStats image={'skull-icon'} data={playerData? playerData.playerStats.totalDeaths : ''} />
                <PlayerStats image={'percent-icon'} data={playerData? calculateKd([playerData.playerStats.totalKills, playerData.playerStats.totalDeaths]) : ''} />
                <PlayerStats image={'flag-icon'} data={playerData? playerData.playerStats.totalCaps : ''} />
                <PlayerStats image={'clock-icon'} data={playerData? formatTime(playerData.playerStats.totalGatherTime) : ''} />
            </div>
        </div>
    )
}