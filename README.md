# BruhBot
![Build and Deploy Status](https://github.com/RKochenderfer/BruhBot/blob/master/.github/workflows/docker-image.yml/badge.svg)

Custom discord bot


## Usage

### / Commands

<table>
    <tbody>
        <tr>
            <th>Command</th>
            <th>Description</th>
            <th>Subcommands</th>
            <th>Examples</th>
        </tr>
        <tr>
            <td>bruh</td>
            <td>Replies to the user with bruh</td>
            <td></td>
            <td>/bruh</td>
        </tr>
        <tr>
            <td>roll</td>
            <td>roll dice</td>
            <td></td>
            <td>/roll 2d6+1</td>
        </tr>
        <tr>
            <td>hug</td>
            <td>hug a user</td>
            <td></td>
            <td>/hug @user</td>
        </tr>
        <tr>
            <td>insult</td>
            <td>insult a user</td>
            <td></td>
            <td>/insult @user</td>
        </tr>
        <tr>
            <td>kill</td>
            <td>kill a user</td>
            <td></td>
            <td>/kill @user</td>
        </tr>
        <tr>
            <td>ye</td>
            <td>get a Ye quote</td>
            <td></td>
            <td>/ye</td>
        </tr>
        <tr>
            <td>clipshow</td>
            <td>bruhbot pulls a random pinned comment from the server</td>
            <td></td>
            <td>/clipshow</td>
        </tr>
        <tr>
            <td>chatty</td>
            <td>bruhbot activates chat bot features</td>
            <td></td>
            <td>/chatty</td>
        </tr>
        <tr>
            <td>leftist</td>
            <td>bruhbot plays the leftist ass mp3 in the users audio channel</td>
            <td></td>
            <td>/leftist</td>
        </tr>
    </tbody>
</table>

### ! Commands
<table>
    <tbody>
        <tr>
            <th>Command</th>
            <th>Description</th>
            <th>Examples</th>
        </tr>
        <tr>
            <td>!deploy</td>
            <td>Deploys the commands to the server that the command is ran on</td>
            <td>!deploy</td>
        </tr>
        <tr>
            <td>!ace</td>
            <td>Renders a series of messages as an ace attorney video</td>
            <td>(in a reply message) !ace 4</td>
        </tr>
    </tbody>
</table>

### Flagged Messages
<ul>
    <li>cum</li>
</ul>

## Troubleshooting

-   If you get a node-gyp error make sure you run the following `sudo npm install -g node-gyp`
-   ffmpeg is also required for the code to function
