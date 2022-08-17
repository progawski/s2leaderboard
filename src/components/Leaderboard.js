import react from 'react';

export default function Leaderboard() {
    return(
        <div id='leaderboard-container'>
            <table>
                <th>
                    <td>RANK</td>
                    <td>NAME</td>
                    <td>W</td>
                    <td>T</td>
                    <td>L</td>
                    <td>SUM</td>
                    <td>CAPS</td>
                    <td>K/D</td>
                </th>
                <tr>
                    <td>1</td>
                    <td>Papu</td>
                    <td>86</td>
                    <td>18</td>
                    <td>62</td>
                    <td>166</td>
                    <td>200</td>
                    <td>1.35</td>
                </tr>
            </table>
        </div>
    )
}