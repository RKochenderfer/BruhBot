# BruhBot

Custom discord bot

## Build commands
`docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t gimpflamingo/bruhbot --push .`

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
                    <li>Start - Initializes the court</li>
                    <li>vote - Call for jury vote</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

## Troubleshooting

* If you get a node-gyp error make sure you run the following `sudo npm install -g node-gyp`
* ffmpeg is also required for the code to function