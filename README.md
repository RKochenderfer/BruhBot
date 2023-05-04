# BruhBot
[![Docker Image CI](https://github.com/RKochenderfer/BruhBot/actions/workflows/docker-image.yml/badge.svg?branch=master)](https://github.com/RKochenderfer/BruhBot/actions/workflows/docker-image.yml)

A custom Discord Bot

## Development Requirements
* TypeScript > 5.0
* Docker
* Docker Compose

## Usage
To start application run `./bash-scripts/up.sh`

## Applications in Repo
* Bruhbot - The discord bot
* Chatty - The chatbot service
* Objection Engine - The ace attorney rendering engine

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
            <td>addphrase</td>
            <td>Adds a flagged message phrase that bruhbot will issue a response to</td>
            <td></td>
            <td>/addphrase regex_phrase:gonk response:gonk</td>
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

### Flagged Message Syntax
#### Regex Syntax
For detailed information about EMCAScript regex syntax check out [Regex 101](https://regex101.com/)

#### Response Syntax
Description|Syntax|Example
-|-|-
Date only last instance seen|$d|`Last seen on $d.` -> `Last seen on 5/1/2023`
Timestamp last instance seen|$t|`Last seen on $t` -> `Last seen on 5/1/2023 12:30:32`
Time since last seen in seconds|$s|`Was seen $s seconds ago` -> `Was seen 157.25 seconds ago`
Time since last seen in seconds|$m|`Was seen $m minutes ago` -> `Was seen 58 minutes ago`
Time since last seen in hours|$h|`Was seen $h hours ago` -> `Was seen 12 hours ago`
Message Key|$k|`Word $k detected` -> `Word KEY detected`
Count|$c|`Word seen $c times` -> `Word seen 102 times`

## Troubleshooting

- You can find the assets I use here: https://drive.google.com/file/d/1pSPUah0csO5XLEtw7OMxX-IzS37_Z6fd/view?usp=share_link
- If you get a node-gyp error make sure you run the following `sudo npm install -g node-gyp`
- ffmpeg is also required for the code to function

## FAQ
- "Why can't I render more than 100 comments?": The Objection Engine has a cap of 100 messages
