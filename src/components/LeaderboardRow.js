import react from 'react';

export default function LeaderboardRow(props) {



    return (
        <tr>
            <td className='rank-col'>{props.rank}</td>
            <td className='name-col'>
                <img className='rank-img-small' src={`images/tiers/${props.tierNumber}.png`}/>
                <span>{props.displayName}</span>
            </td>
            <td className='w-col'>{props.wonGames}</td>
            <td className='t-col'>{props.tiedGames}</td>
            <td className='l-col'>{props.lostGames}</td>
            <td className='sum-col'>{props.totalGames}</td>
            {/* <td className='caps-col'>200</td>
            <td className='kd-col'>1.35</td> */}
        </tr>   
    )
}