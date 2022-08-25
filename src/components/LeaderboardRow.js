import React from 'react';

export default function LeaderboardRow(props) {

    return (
        // <tr>
        //     <td className='rank-col'>{props.rank}</td>
        //     <td className='name-col'>
        //         <img className='rank-img-small' src={`images/tiers/${props.tierNumber}.png`}/>
        //         <span>{props.displayName}</span>
        //     </td>
        //     <td className='w-col'>{props.wonGames}</td>
        //     <td className='t-col'>{props.tiedGames}</td>
        //     <td className='l-col'>{props.lostGames}</td>
        //     <td className='sum-col'>{props.totalGames}</td>
        //     <td className='caps-col'>200</td>
        //     <td className='kd-col'>1.35</td>
        // </tr>
        <div style = {props.style} className='leaderboard-row-container'>
            <div className='leaderboard-row'>
                    <div className='rank-col'>{props.rank}</div>
                    <div className='name-col'>
                        <img className='rank-img-small' src={`images/tiers/${props.tierNumber}.png`}/>
                        <div>{props.displayName}</div>
                    </div>
                    <div className='w-col'>{props.wonGames}</div>
                    <div className='t-col'>{props.tiedGames}</div>
                    <div className='l-col'>{props.lostGames}</div>
                    <div className='sum-col'>{props.totalGames}</div>
            </div>
        </div>
    )
}