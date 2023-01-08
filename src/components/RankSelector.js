import React, {useState, useEffect} from 'react';

export default function RankSelector(props) {

    const [data, setData] = useState(null); // Data from API's response
    const [code, setCode] = useState('CTF-Standard-6');

    const getPlaylistCode = props.getPlaylistCode

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(
                    'https://stats.soldat2.com:9001/api/v1/matchmaking/playlist'
                );
                if (!response.ok) {
                    throw new Error(
                        `HTTP error status: ${response.status}`
                    );
                }
                let responseData = await response.json();
                setData(responseData);
            } catch(err) {
                console.log(err.message);
                setData(null);
            }
        }
        getData();
    }, [])

    useEffect(() => {
        getPlaylistCode(code);
    }, [code])

    const playListOptions = data?.map(playListOption => {
        return (
            <option key = {playListOption.code}> 
                {playListOption.code}
            </option>
        )
    })

    const handleChange = (e) => {
        setCode(e.target.value)
    }


    return(
        <select value={code} onChange={handleChange}>
            {playListOptions}
        </select>
    )
}