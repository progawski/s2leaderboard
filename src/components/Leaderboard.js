import React from 'react';
import { List, Table, Column, SortDirection, AutoSizer, defaultTableRowRenderer} from "react-virtualized";
import LeaderboardRow from './LeaderboardRow';
import Spinner from './Spinner';
import Immutable from "immutable";
import _, { transform } from "lodash";
import 'react-virtualized/styles.css'; // only needs to be imported once

export default function Leaderboard(props) {

    // const sortedData = props.data?.filter(el => el.tierNumber > 0).sort((a, b) => (a.mu < b.mu)? 1 : -1);

    // const [sorting, setSorting] = React.useState({by: 'rank', asc: true})
    const [data, setData] = React.useState(props.data)
    const [sortBy, setSortBy] = React.useState('rank');
    const [sortDirection, setSortDirection] = React.useState(SortDirection.ASC);
    const [sortedList, setSortedList] = React.useState(null);
    const [alphaPlayer, setAlphaPlayer] = React.useState(null);
    const [bravoPlayer, setBravoPlayer] = React.useState(null);

    console.log('alphaPlayer:', alphaPlayer);
    console.log('bravoPlayer:', bravoPlayer);

    React.useEffect(() => {
        setData(props.data);
    }, [props.data])

    React.useEffect(() => {
        if(data) setSortedList(sortList({sortBy, sortDirection}));
    }, [data])

    function sort({sortBy, sortDirection}) {
        const sortedList = sortList({sortBy, sortDirection});
        setSortBy(sortBy);
        setSortDirection(sortDirection);
        setSortedList(sortedList);
    }

    function sortList({sortBy, sortDirection}) {
        let newList = _.sortBy(data, [sortBy]);
        if (sortDirection === SortDirection.DESC) {
            newList.reverse();
        }
        return newList;
    }

    function nameColumn({cellData,rowData}){
        return (
            <div className='name-cell'>
                <img className='rank-img-small' src={`images/tiers/${rowData.tierNumber}.png`}/>
                <span>{cellData}</span>
            </div>
        )
    }
    
    function headerRowRenderer({columns, style}) {
        return(

            <div className='leaderboard-header' style={{...style, ...headerStyle}}>
                {columns}
            </div>
        )   
    }



    function showAlphaPlayer(e, rowData) {

        setAlphaPlayer(rowData.playfabId);

        // const leaderboardRow = e.currentTarget;

        // leaderboardRow.classList.add('leaderboard-row-active')

        // console.log(e.currentTarget.classList);
    }

    function showBravoPlayer(e, rowData) {
        setBravoPlayer(rowData.playfabId);
    }


    function rowRenderer({columns, key, style, rowData}){
        return(
            <div style={style} key={key}>
                <div onMouseEnter={(e) => showBravoPlayer(e, rowData)} onClick={(e) => showAlphaPlayer(e, rowData)} className={alphaPlayer === rowData.playfabId? 'leaderboard-row leaderboard-row-alpha' : 'leaderboard-row'}>{columns}</div>
            </div>
        )
    }

    function headerRenderer({label, sortBy, dataKey, sortDirection}){
        return(
            <div style={{position: 'relative'}}>
                <div style={{color: sortBy === dataKey? '#A1D880' : '#fff'}}>{label}</div>      
                {sortBy === dataKey? <img className='sort-icon' style={{transform: sortDirection === 'ASC'? 'rotate(0deg) translateX(-50%)' : 'rotate(180deg) translateX(50%)'}} src='images/sort-icon.png'/> : null}
            </div>
        )
    }

    function noRowsRenderer(){
        return(
            <Spinner />
        )
    }

    function onRowClick(e){
        console.log(e);
    }

    const headerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Montserrat',
        backgroundColor: '#11201B', 
        margin: '0', 
        padding: '0',
    }
    


    return(
        <div id='leaderboard-container'>
            <div id='leaderboard'>  
                <AutoSizer>
                    {({ height, width }) => (
                    <Table
                        width = {width}
                        height = {height}
                        headerHeight = {60}
                        rowHeight = {48}
                        rowCount = {sortedList? sortedList.length : 0}
                        rowGetter = {({index}) => sortedList[index]}
                        sort = {sort}
                        sortBy = {sortBy}
                        sortDirection = {sortDirection}
                        headerRowRenderer = {headerRowRenderer}
                        rowRenderer = {rowRenderer}
                        noRowsRenderer = {noRowsRenderer}
                        onRowClick = {onRowClick}
                    >
                    <Column label="RANK" dataKey="rank" width={100} headerRenderer = {headerRenderer} />
                    <Column label="NAME" dataKey="displayName" width = {300} headerRenderer = {headerRenderer} cellRenderer = {nameColumn} />
                    <Column label="W" dataKey="wonGames" width={80} headerRenderer = {headerRenderer}/>
                    <Column label="T" dataKey="tiedGames" width={80} headerRenderer = {headerRenderer}/>
                    <Column label="L" dataKey="lostGames" width={80} headerRenderer = {headerRenderer}/>
                    <Column label="SUM" dataKey="totalGames" width={80} headerRenderer = {headerRenderer}/>
                    </Table>
                    )}
                </AutoSizer>
            </div>   
        </div>
    )
}