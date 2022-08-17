import react from 'react';
import LeaderboardRow from './LeaderboardRow';

export default function Leaderboard(props) {

   

    const sortedData = props.data?.sort((a, b) => (a.mu < b.mu)? 1 : -1);
    
    const rows = sortedData?.map((row, index) => {
        return (
            <LeaderboardRow
                rank = {index + 1}
                key = {row.playfabId}
                {...row}
            />
        )
    })

    return(
        <div id='leaderboard-container'>
            <div id='leaderboard-scrollable'>
                <table id='leaderboard'>
                    <thead>
                        <tr>
                            <th className="rank-col">RANK</th>
                            <th className="name-col">NAME</th>
                            <th className="w-col">W</th>
                            <th className="t-col">T</th>
                            <th className="l-col">L</th>
                            <th className="sum-col">SUM</th>
                            {/* <th className="caps-col">CAPS</th>
                            <th className="kd-col">K/D</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {props.data && rows}
                    </tbody>
                </table>
            </div>

            <div id='scrollbar-container'>

            </div>
        </div>
    )
}