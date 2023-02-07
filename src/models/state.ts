import Chatbot from '../chatbot';

export class ServerState {
	constructor(public chattyEnabled: boolean = false) {}
}

export default class State {
	constructor(public servers: Map<string, ServerState> = new Map()) {}
	// constructor(public chattyEnabled: boolean = false, public chatBot = new Chatbot()) {}
}