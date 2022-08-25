import React from 'react';
import { List, Table, Column, SortDirection } from "react-virtualized";
import LeaderboardRow from './LeaderboardRow';
import Spinner from './Spinner';
import Immutable from "immutable";
import _ from "lodash";

export default function Leaderboard(props) {

    // const sortedData = props.data?.filter(el => el.tierNumber > 0).sort((a, b) => (a.mu < b.mu)? 1 : -1);

    // const [sorting, setSorting] = React.useState({by: 'rank', asc: true})
    // const [data, setData] = React.useState(props.data)

    // React.useEffect(() => {
    //     setData(props.data);

    // }, [props.data])

    // React.useEffect(() => {
    //     if(data) setData(sortTable(data))
    //     window.scrollBy(0, 100);
    //     console.log(sorting);
    // }, [sorting])

    // function sortTable(data) {
    //     let sortedData;
    //     if(sorting.by === 'rank'){
    //         sortedData = sorting.asc? (data.sort((a, b) => (a.rank > b.rank)? 1 : -1)) : (data.sort((a, b) => (a.rank < b.rank)? 1 : -1));
    //     }

    //     else if(sorting.by === 'name'){
    //         sortedData = sorting.asc? (data.sort((a, b) => (a.displayName > b.displayName)? 1 : -1)) : (data.sort((a, b) => (a.displayName < b.displayName)? 1 : -1));
    //     }

    //     else if(sorting.by === 'wins'){
    //         sortedData = sorting.asc? (data.sort((a, b) => (a.winGames > b.winGames)? 1 : -1)) : (data.sort((a, b) => (a.wonGames < b.wonGames)? 1 : -1));
    //     }

    //     else if(sorting.by === 'ties'){
    //         sortedData = sorting.asc? (data.sort((a, b) => (a.tiedGames > b.tiedGames)? 1 : -1)) : (data.sort((a, b) => (a.tiedGames < b.tiedGames)? 1 : -1));
    //     }

    //     else if(sorting.by === 'loses'){
    //         sortedData = sorting.asc? (data.sort((a, b) => (a.lostGames > b.lostGames)? 1 : -1)) : (data.sort((a, b) => (a.lostGames < b.lostGames)? 1 : -1));
    //     }

    //     else if(sorting.by === 'sum'){
    //         sortedData = sorting.asc? (data.sort((a, b) => (a.totalGames > b.totalGames)? 1 : -1)) : (data.sort((a, b) => (a.totalGames < b.totalGames)? 1 : -1));
    //     }


    //     return sortedData
    // }

    // function changeSorting(e) {
    //     setSorting(prevSorting => ({by: e.target.getAttribute('data-sort'), asc: !prevSorting.asc}))
    // }

    const list = [
        {name: 'Brian Vaughn', description: 'Software engineer'},
        {name: 'Drian Vaughn', description: 'Software engineer'},
        {name: 'Crian Vaughn', description: 'Software engineer'},
        {name: 'Arian Vaughn', description: 'Software engineer'},
        {name: 'Frian Vaughn', description: 'Software engineer'},
        // And so on...
      ];

    const [sortBy, setSortBy] = React.useState('name');
    const [sortDirection, setSortDirection] = React.useState(SortDirection.ASC);
    const [sortedList, setSortedList] = React.useState(sortList({sortBy, sortDirection}));

    function sort({sortBy, sortDirection}) {
        const sortedList = sortList({sortBy, sortDirection});
        setSortBy(sortBy);
        setSortDirection(sortDirection);
        setSortedList(sortedList);
      }



    function sortList({sortBy, sortDirection}) {
        let newList = _.sortBy(list, [sortBy]);
        if (sortDirection === SortDirection.DESC) {
            newList.reverse();
        }
        return newList
        // return list.sortBy(item => item[sortBy]).update(list => sortDirection === SortDirection.DESC ? list.reverse() : list)
      }



    return(
        <div id='leaderboard-container'>      
            <div id="leaderboard">
                {/* <div id="leaderboard-header">
                    <div onClick={changeSorting} data-sort='rank' className='rank-col'>RANK</div>
                    <div onClick={changeSorting} data-sort='name' className='name-col'>NAME</div>
                    <div onClick={changeSorting} data-sort='wins' className='w-col'>W</div>
                    <div onClick={changeSorting} data-sort='ties' className='t-col'>T</div>
                    <div onClick={changeSorting} data-sort='loses' className='l-col'>L</div>
                    <div onClick={changeSorting} data-sort='sum' className='sum-col'>SUM</div>
                </div>
                <div id="leaderboard-content">
                    {!data? <Spinner /> :                 
                        <List
                            forceRender = {Math.random()}
                            width = {770}
                            height = {472}
                            rowHeight = {48}
                            rowCount = {data.length}
                            rowRenderer = 
                            {({key, index, style}) => {
                                return (
                                    <LeaderboardRow
                                        style = {style}
                                        key = {key}
                                        {...data[index]}
                                    />
                                );
                            }}
                        />
                    }     
                </div>                  */}
                <Table
                    width={400}
                    height={300}
                    headerHeight={20}
                    rowHeight={100}
                    rowCount={sortedList.length}
                    rowGetter={({index}) => sortedList[index]}
                    sort={sort}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                >  
                    <Column label="Name" dataKey="name" width={200} />
                    <Column width={200} label="Description" dataKey="description" />
                </Table>
            </div>   
        </div>
    )
}