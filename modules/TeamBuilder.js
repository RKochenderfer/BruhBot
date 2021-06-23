class TeamBuilder {
    /** The players that will be added to teams */
    #players = []
    #teams = []

    /**
     * Constructs a new team builder
     * @param numTeams {number} - The number of teams to be created
     * @param players {string[]} - The players
     */
    constructor(numTeams = 2, players = []) {
        this.numTeams = numTeams
        this.#players = players
    }

    static validate(args) {
        if (args.length < 3 || isNaN(args[1]))
            throw new TeamBuilderError('The second argument must be the number of teams to divide into.')
    }

    static parseMessage(msg) {
        const args = msg.content.split(' ')
        this.validate(args)
        return new TeamBuilder(parseInt(args[1]), args.slice(2))
    }

    static messageHandler(msg) {
        return this.parseMessage(msg)
    }

    addPlayer(userId) {
        this.#players.push(userId)
    }

    getPlayers() {
        return this.#players
    }

    setNumTeams(numTeams) {
        this.numTeams = numTeams
    }

    #buildUnEvenTeams(teams) {
        const randomized = this.#players.sort(this.randSort)

        for (let i = 0; i < randomized.length; i++) {
            teams[i % teams.length].push(this.#players[i])
        }
    }

    #createEmptyTeams() {
        let teams = []
        for (let i = 0; i < this.numTeams; i++) {
            teams.push([])
        }

        return teams
    }

    /**
     * Generates the list of teams
     */
    generateTeams() {
        let builtTeams = this.#createEmptyTeams()
        this.#buildUnEvenTeams(builtTeams)

        this.#teams = builtTeams
    }

    buildTeamStrings() {
        let teamStrings = []
        for (let i = 0; i < this.#teams.length; i++) {
            teamStrings.push(`Team ${i + 1}: `)
        }

        // let team1Players = this.#teams[0]
        // let team2Players = this.#teams[1]
        for (let i = 0; i < this.#teams.length; i++) {
            const players = this.#teams[i]
            for (let j = 0; j < players.length; j++) {
                teamStrings[i] += `${players[j]}`
                if (j !== players.length - 1)
                    teamStrings[i] += ', '
            }
        }

        return teamStrings
    }

    randSort() {
        return Math.random()
    }
}

module.exports = TeamBuilder