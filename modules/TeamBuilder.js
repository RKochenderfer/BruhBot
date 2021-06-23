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

    static numTeamsIsValid(toValidate) {
        return Number.isInteger(toValidate)
    }

    static validate(args) {
        if (args.length > 0) {
            if (!this.numTeamsIsValid(args[0]))
                throw new TeamBuilderError('Invalid number of teams given.')
        } else {
            throw new TeamBuilderError('No arguments were given to team builder.')
        }
    }

    static parseMessage(msg) {
        const args = msg.content.split(' ')
        switch (args.length) {
            case 0:
                return new TeamBuilder()
            case 1:
                this.validate(args)
                return new TeamBuilder(parseInt(args[0]))
            default:
                this.validate(args)
                return new TeamBuilder(parseInt(args[0]), args.slice(1))
        }
    }

    static messageHandler(msg) {
        this.parseMessage(msg)
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
        this.#buildUnEvenTeams()

        this.#teams = builtTeams
    }

    getTeams() {
        return this.#teams
    }

    randSort() {
        return Math.random()
    }
}