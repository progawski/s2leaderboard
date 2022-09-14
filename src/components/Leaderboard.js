import React, {useState, useEffect} from 'react';
import { Table, Column, SortDirection, AutoSizer} from "react-virtualized"; // Thanks to AutoSizer the Table is flexible 
import Spinner from './Spinner';
import _ from "lodash"; // Use lodash for sortBy function
import 'react-virtualized/styles.css';

export default function Leaderboard(props) {

    const data = props.data; // Data with all players' stats
    const getAlphaPlayerData = props.getAlphaPlayerData; // Access to the function from the parent component in order to pass data to the Player component
    const getBravoPlayerData = props.getBravoPlayerData;

    // Media queries
    const mediaQueryLarge = window.matchMedia('(max-width: 1198.98px)');
    const mediaQuerySmall = window.matchMedia('(max-width: 767.98px)'); // Show only alpha player in a modal
    const mediaQueryVerySmall = window.matchMedia('(max-width: 575.98px)');

    const [sortBy, setSortBy] = useState('rank'); // Sort by rank by default
    const [sortDirection, setSortDirection] = useState(SortDirection.ASC); // Sorting direction set as ascending on default
    const [sortedList, setSortedList] = useState(null);
    const [alphaPlayerData, setAlphaPlayerData] = useState(null);
    const [bravoPlayerData, setBravoPlayerData] = useState(null);

    useEffect(() => {
        if(data){
            setSortedList(sortList({sortBy, sortDirection}));
            setAlphaPlayerData(data[0]); // Set 1st player as alpha
            getAlphaPlayerData(data[0]); // Pass data of 1st player to parent component and then to Player
            setBravoPlayerData(data[1]); // Set 2nd player as alpha
            getBravoPlayerData(data[1]); // Pass data of 2nd player to parent component and then to Player
        }
    }, [data])

    useEffect(() => {
        getAlphaPlayerData(alphaPlayerData); // Execture parent's function every time the alpha player is changed
    }, [alphaPlayerData])

    useEffect(() => {
        getBravoPlayerData(bravoPlayerData); // Execture parent's function every time the bravo player is changed
    }, [bravoPlayerData])

    const sortList = ({sortBy, sortDirection}) => {
        // Use lodash sortBy function in order to sort the table with dynamically changing sorting value
        let newList = _.sortBy(data, [sortBy]);
        if (sortDirection === SortDirection.DESC) {
            newList.reverse();
        }
        return newList;
    }

    const sort = ({sortBy, sortDirection}) => {
        const list = sortList({sortBy, sortDirection});
        setSortBy(sortBy);
        setSortDirection(sortDirection);
        setSortedList(list);
    }

    // Change alpha player's data on row click
    const changeAlphaPlayer = (playerData) => {
        setAlphaPlayerData(playerData);
        if(playerData.playfabId === bravoPlayerData.playfabId){
            changeBravoPlayer(alphaPlayerData, true); // Switch alpha with bravo player
        }
    }

    // Change alpha player's data on row hover
    const changeBravoPlayer = (playerData, switchPlayers) => {
        if(playerData.playfabId !== alphaPlayerData.playfabId || switchPlayers){
            setBravoPlayerData(playerData);
        }
    }

    // Customize header's row in order to overwrite default style
    const headerRowRenderer = ({columns, style}) => {
        return(
            <div className='leaderboard-header' style={{...style, ...headerStyle}}>
                {columns}
            </div>
        )   
    }

    const headerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Montserrat',
        backgroundColor: '#11201B', 
        margin: '0', 
    }

    // Customize header's cell style and add custom sorting indicator
    const headerRenderer = ({label, sortBy, dataKey, sortDirection}) => {
        return(
            <div style={{position: 'relative'}}>
                <div style={{color: sortBy === dataKey? '#A1D880' : '#fff', textOverflow: 'ellipsis', overflow: 'hidden'}}>{label}</div>      
                {sortBy === dataKey? <img className='sort-icon' style={{transform: sortDirection === 'ASC'? 'rotate(0deg) translateX(-50%)' : 'rotate(180deg) translateX(50%)'}} src='images/icons/sort-icon.png' alt='Sort icon'/> : null}
            </div>
        )
    }

    // Set row's class
    const setRowClass = (playerId) => {
        if(playerId === alphaPlayerData?.playfabId){ // If the player's id taken from the table equals to player's id from state
            return 'leaderboard-row-alpha'
        } else if(playerId === bravoPlayerData.playfabId && !mediaQueryLarge.matches){ // If the player's id taken from the table equals to player's id from state and bravo player's selection is enabled (for larger screens only)
            return 'leaderboard-row-bravo'
        }
    }

    // Customize rows in order to add mouse events and custom style
    const rowRenderer = ({columns, key, style, rowData}) => {
        return(
            <div style={style} key={key}>
                <div onMouseEnter={!mediaQueryLarge.matches? () => changeBravoPlayer(rowData) : null} onClick={() => changeAlphaPlayer(rowData)} className={`leaderboard-row ${setRowClass(rowData.playfabId)}`}>{columns}</div>
            </div>
        )
    }

    // Show spinner while data loading
    const noRowsRenderer = () => {
        return(
            <Spinner />
        )
    }

    // Customize a name column in order to display image and name within one cell
    const nameColumn = ({cellData, rowData}) => {
        return (
            <div className='name-cell'>
                <img className='rank-img-small' src={`images/tiers/${rowData.tierNumber}.png`} alt='Rank icon'/>
                <span>{cellData}</span>
            </div>
        )
    }

    return(
        <div id='leaderboard-container'>
            <div id='leaderboard'>  
                <AutoSizer>
                    {({ height, width }) => (
                    <Table
                        width = {width}
                        height = {height}
                        headerHeight = {(width > 543 || height > 446)? 60 : 50}
                        rowHeight = {(width > 543 || height > 446)? 48 : 40}
                        rowCount = {sortedList? sortedList.length : 0} /* If sorted list is ready to display use its length, otherwise set it to 0 to run noRowsRenderer function */
                        rowGetter = {({index}) => sortedList[index]}
                        sort = {sort}
                        sortBy = {sortBy}
                        sortDirection = {sortDirection}
                        headerRowRenderer = {headerRowRenderer}
                        rowRenderer = {rowRenderer}
                        noRowsRenderer = {noRowsRenderer}
                    >
                    <Column label="RANK" dataKey="rank" width={100} headerRenderer = {headerRenderer} />
                    <Column label="NAME" dataKey="displayName" width = {300} headerRenderer = {headerRenderer} cellRenderer = {nameColumn}/>
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