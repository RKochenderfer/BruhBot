import Chatbot from '../chatbot';

export default class State {
	constructor(public chattyEnabled: boolean = false, public chatBot = new Chatbot()) {}
}