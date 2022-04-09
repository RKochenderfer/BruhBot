# BruhBot

Custom discord bot

## Build commands

`docker build . -t ghcr.io/rkochenderfer/bruhbot --push`

## Adding a new command

1. Add the command to the Command enum at Command.ts
2. Add the command to the methodMao in MessageMap.ts

### Usage

<table>
    <tbody>
        <tr>
            <th>Command</th>
            <th>Description</th>
            <th>Subcommands</th>
            <th>Examples</th>
        </tr>
        <tr>
            <td>court</td>
            <td>Handles court proceedings</td>
            <td>
                <ul>
                    <li>start - Initializes the court</li>
                    <li>prosecutor - sets the current user as the prosecutor for this case</li>
                    <li>defendant - sets the current user to be the defendent for this case</li>
                    <li>vote - Call for jury vote</li>
                    <li>yea - vote in pro of motion</li>
                    <li>nay - vote against motion</li>
                    <li>give - Gives court points</li>
                    <li>deduct - Removes court points</li>
                    <li>total - gives a user their current court points</li>
                    <li>judge - replies with the name of the judge in the current court session</li>
                    <li>buy - buy an upgrade with your current court points</li>
                    <li>store - lists items in the store</li>
                </ul>
            </td>
            <td></td>
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
            <td>socks</td>
            <td>the socks commands</td>
            <td>
                <ul>
                    <li>on - put your socks on</li>
                    <li>off - take your socks off</li>
                    <li>status - get the status of people's socks</li>
                </ul>
            </td>
            <td>/socks on</td>
        </tr>
        <tr>
            <td>ye</td>
            <td>get a Ye quote</td>
            <td></td>
            <td>/ye</td>
        </tr>
        <tr>
            <td>yee</td>
            <td>bruhbot says yee</td>
            <td></td>
            <td>/yee</td>
        </tr>
    </tbody>
</table>

### Flagged Messages
<table>

</table>

## Troubleshooting

-   If you get a node-gyp error make sure you run the following `sudo npm install -g node-gyp`
-   ffmpeg is also required for the code to function
