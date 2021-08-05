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

    #buildUnEvenTeams(teams) {
        const randomized = TeamBuilder.shuffle(this.#players)

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

    static shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }
}

module.exports = TeamBuilder