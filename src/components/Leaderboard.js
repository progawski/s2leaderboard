import React, {useState, useEffect} from 'react';
import { Table, Column, SortDirection, AutoSizer} from "react-virtualized";
import Spinner from './Spinner';
import _, { set } from "lodash";
import 'react-virtualized/styles.css';

export default function Leaderboard(props) {
    const [data, setData] = useState(props.data)
    const [sortBy, setSortBy] = useState('rank');
    const [sortDirection, setSortDirection] = useState(SortDirection.ASC);
    const [sortedList, setSortedList] = useState(null);
    const [alphaPlayerData, setAlphaPlayerData] = useState(null);
    const [bravoPlayerData, setBravoPlayerData] = useState(null);

    useEffect(() => {
        setData(props.data);
    }, [props.data])

    useEffect(() => {
        if(data){
            setSortedList(sortList({sortBy, sortDirection}));
            setAlphaPlayerData(data[0]);
            setBravoPlayerData(data[1]);
            props.getAlphaPlayerData(data[0]);
            props.getBravoPlayerData(data[1]);
        }
    }, [data])

    useEffect(() => {
        props.getAlphaPlayerData(alphaPlayerData);
    }, [alphaPlayerData])

    useEffect(() => {
        props.getBravoPlayerData(bravoPlayerData);
    }, [bravoPlayerData])

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
                <img className='rank-img-small' src={`images/tiers/${rowData.tierNumber}.png`} alt='Rank icon'/>
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

    function changeAlphaPlayer(playerData) {
        setAlphaPlayerData(playerData);
        if(playerData.playfabId === bravoPlayerData.playfabId){
            changeBravoPlayer(alphaPlayerData, true);
        }
    }

    function changeBravoPlayer(playerData, switchPlayers) {
        if(playerData.playfabId !== alphaPlayerData.playfabId || switchPlayers){
            setBravoPlayerData(playerData);
        }
    }
    function setRowClass(playerId) {
        if(playerId === alphaPlayerData.playfabId){
            return 'leaderboard-row-alpha'
        } else if(playerId === bravoPlayerData.playfabId){
            return 'leaderboard-row-bravo'
        }
    }

    function rowRenderer({columns, key, style, rowData}){
        return(
            <div style={style} key={key}>
                <div onMouseEnter={() => changeBravoPlayer(rowData)} onClick={() => changeAlphaPlayer(rowData)} className={`leaderboard-row ${setRowClass(rowData.playfabId)}`}>{columns}</div>
            </div>
        )
    }

    function headerRenderer({label, sortBy, dataKey, sortDirection}){
        return(
            <div style={{position: 'relative'}}>
                <div style={{color: sortBy === dataKey? '#A1D880' : '#fff'}}>{label}</div>      
                {sortBy === dataKey? <img className='sort-icon' style={{transform: sortDirection === 'ASC'? 'rotate(0deg) translateX(-50%)' : 'rotate(180deg) translateX(50%)'}} src='images/icons/sort-icon.png'/> : null}
            </div>
        )
    }

    function noRowsRenderer(){
        return(
            <Spinner />
        )
    }

    const headerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Montserrat',
        backgroundColor: '#11201B', 
        margin: '0', 
        paddingRight: '17px'
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