import react from 'react';
import { List } from "react-virtualized";
import LeaderboardRow from './LeaderboardRow';

export default function Leaderboard(props) {

    const sortedData = props.data?.filter(el => el.tierNumber > 0).sort((a, b) => (a.mu < b.mu)? 1 : -1);

    // const rows = sortedData?.map((row, index) => {
    //     return (
    //         <LeaderboardRow
    //             rank = {index + 1}
    //             key = {row.playfabId}
    //             {...row}
    //         />
    //     )
    // })

    return(
        <div id='leaderboard-container'>      
                <div id="leaderboard">
                    <div id="leaderboard-header">
                        <div className='rank-col'>RANK</div>
                        <div className='name-col'>NAME</div>
                        <div className='w-col'>W</div>
                        <div className='t-col'>T</div>
                        <div className='l-col'>L</div>
                        <div className='sum-col'>SUM</div>
                    </div>
                    
                    {props.isLoading? 'Loading...' :                 
                        <List
                            width = {770}
                            height = {472}
                            rowHeight = {48}
                            rowCount = {sortedData.length}
                            rowRenderer = 
                            {({key, index, style}) => {
                                return (
                                    <LeaderboardRow 
                                        style = {style}
                                        rank = {index + 1}
                                        key = {key}
                                        {...sortedData[index]}
                                    />
                                );
                            }}
                        />
                    }           
                </div>    
        </div>
    )
}