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
    const [alphaPlayer, setAlphaPlayer] = useState(null);
    const [bravoPlayer, setBravoPlayer] = useState(null);
    const [teamColor, setTeamColor] = useState('bravo')

    useEffect(() => {
        setData(props.data);
    }, [props.data])

    useEffect(() => {
        if(data){
            setSortedList(sortList({sortBy, sortDirection}));
            setAlphaPlayer(data[0].playfabId);
            setBravoPlayer(data[1].playfabId);
            props.getAlphaPlayerId(data[0].playfabId);
            props.getBravoPlayerId(data[1].playfabId);
        }
    }, [data])

    useEffect(() => {
        props.getAlphaPlayerId(alphaPlayer);
    }, [alphaPlayer])

    useEffect(() => {
        props.getBravoPlayerId(bravoPlayer);
    }, [bravoPlayer])

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

    function changePlayer(player) {
        const color = document.querySelector('input[name="team-color"]:checked').value;
        if(color === 'alpha'){
            setAlphaPlayer(player);
        } else {
            setBravoPlayer(player);
        }
    }

    function setRowClass(player) {
        if(player === alphaPlayer){
            return 'leaderboard-row-alpha'
        } else if(player === bravoPlayer){
            return 'leaderboard-row-bravo'
        }
    }

    function rowRenderer({columns, key, style, rowData}){
        return(
            <div style={style} key={key}>
                <div onClick={() => changePlayer(rowData.playfabId)} className={`leaderboard-row ${setRowClass(rowData.playfabId)}`}>{columns}</div>
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
            <div>
                <input onChange={() => setTeamColor('alpha')} type='radio' name='team-color' value='alpha' checked = {teamColor === 'alpha'? true : false}></input>
                <input onChange={() => setTeamColor('bravo')} type='radio' name='team-color' value='bravo' checked = {teamColor === 'bravo'? true : false}></input>
            </div>
        </div>
    )
}