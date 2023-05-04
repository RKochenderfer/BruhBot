export class ServerState {
	constructor(public chattyEnabled: boolean = false) {}
}

export class AppState {
	constructor(public servers: Map<string, ServerState> = new Map()) {}
	// constructor(public chattyEnabled: boolean = false, public chatBot = new Chatbot()) {}
}
