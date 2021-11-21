# BruhBot

Custom discord bot

## Build commands
`docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t gimpflamingo/bruhbot --push .`

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
        </tr>
    </tbody>
</table>

## Troubleshooting

* If you get a node-gyp error make sure you run the following `sudo npm install -g node-gyp`
* ffmpeg is also required for the code to function