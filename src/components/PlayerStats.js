import React from 'react';

export default function PlayerStats(props){
    return(
        <div className='player-stats'>
            <div className='player-stats-icon-wrapper'>
                <img className='player-stats-icon' src={`images/icons/${props.image}.png`} alt='Stats icon'/>
            </div>
            <div className='player-stats-data'>
                {props.data}
            </div>
        </div>
    )
}