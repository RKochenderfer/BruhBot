const ChatMessages = require('./ChatMessages')
const TeamBuilder = require("./TeamBuilder");

const map = new Map([
    [
        '!bruh',
        {
            'desc': 'Replies to sender with bruh',
            func: msg => ChatMessages.bruh(msg)
        }
    ],
    [
        '!corpse_found',
        {
            'desc': 'Randomly chooses a user to be "sus"',
            func: msg => ChatMessages.corpseFound(msg)
        }
    ],
    [
        '!yee',
        {
            'desc': 'Replies to a user with a random length and capitalized "yee"',
            func: msg => ChatMessages.yee(msg)
        }
    ],
    [
        '!hug',
        {
            'desc': 'Sends a hug to a mentioned user',
            func: msg => ChatMessages.hug(msg)
        }
    ],
    [
        '!leftist_ass',
        {
            'desc': 'Plays a clip of I will eat you Leftist ass in the same voice channel as the user that summoned it',
            func: msg => ChatMessages.leftistAss(msg)
        }
    ],
    [
        '!bruhbot',
        {
            'desc': 'Issues a command directly to bruhbot',
            func: msg => ChatMessages.bruhBot(msg)
        }
    ],
    [
        '!insult',
        {
            'desc': 'Insults a mentioned user',
            func: msg => ChatMessages.insult(msg)
        }
    ],
    [
        '!kill',
        {
            'desc': 'Kills the user who sent the message or kills a mentioned user',
            func: msg => ChatMessages.kill(msg)
        }
    ],
    [
        '!socks',
        {
            'desc': 'Allows a user to put on or take off their socks with `!socks off` or `!socks on` and can get server status with `!socks status`',
            func: msg => ChatMessages.socks(msg)
        }
    ],
    [
        '!play',
        {
            'desc': 'Plays a youtube video from the link provided (ex: `!play https://www.youtube.com/watch?v=dQw4w9WgXcQ`)',
            func: msg => ChatMessages.play(msg)
        }
    ],
    [
        '!ye',
        {
            'desc': 'Gets a random Kanye West quote',
            func: msg => ChatMessages.ye(msg)
        }
    ],
    [
        '!roll',
        {
            'desc': 'Rolls `count` dice of type `type` (ex: `!roll 2 d20`)',
            func: msg => ChatMessages.roll(msg)
        }
    ],
    [
        '!initiative',
        {
            'desc': 'Handles initiative for a roll playing game',
            func: msg => ChatMessages.initiativeTracker(msg)
        }
    ],
    [
        '!help',
        {
            'desc': 'Shows possible top level commands for bruhbot',
            func: (msg, messageMap) => ChatMessages.help(msg, messageMap)
        }
    ],
    [
        '!team_builder',
        {
            'desc': 'Builds teams for a game',
            func: msg => {
                try {
                    const teams = TeamBuilder.messageHandler(msg)
                    teams.generateTeams()
                    const strings = teams.buildTeamStrings()
                    for (let i = 0; i < strings.length; i++) {
                        msg.channel.send(strings[i])
                    }
                    // msg.channel.send(`${teams.getTeams()}`)
                } catch (ex) {
                    msg.channel.send(`Failed to build teams: ${ex}`)
                }
            }
        }
    ]
])

module.exports = map