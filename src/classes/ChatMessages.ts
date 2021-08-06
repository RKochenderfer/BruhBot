import { Message } from "discord.js";
import { ChatMessagesError } from "../errors/ChatMessagesError";
import { NullMessageError } from "../errors/NullMessageError";
import * as fs from "fs";

class ChatMessages {
	private static refuseHug = 10;
	private static threaten = 10;
	private static niceComment = 10;

	private msg: Message;

	constructor(msg: Message) {
		if (msg === null) {
			throw new NullMessageError("Message is null");
		}
		this.msg = msg;
	}

	private static randomCapitalize(str: string): string {
		// Randomly capitalize letters
		const randNumCapital = Math.floor(Math.random() * str.length);
		let indexesToCapital: number[] = [];
		for (let i = 0; i < randNumCapital; i++) {
			const num = Math.floor(Math.random() * str.length);
			if (!indexesToCapital.includes(num)) indexesToCapital.push(num);
		}
		let s = [];
		for (let i = 0; i < str.length; i++) {
			if (indexesToCapital.includes(i)) {
				s.push(str.charAt(i).toUpperCase());
			} else {
				s.push(str.charAt(i));
			}
		}

		return s.join("");
	}

	corpseFound() {
		let users: any[] = [];
		if (this.msg.guild) {
			this.msg.guild.members.cache.each((u) => {
				if (u.displayName !== "BruhBot") users.push(u.id);
			});
		}
		const randUser = users[Math.floor(Math.random() * users.length)];
		this.msg.channel.send(`<@${randUser}> is kinda sus.`);
	}

	yee() {
		let yee = "yee";

		// Add random number of es
		let numEs = Math.floor(Math.random() * 25);
		for (let i = 0; i < numEs; i++) {
			yee += "e";
		}

		this.msg.reply(`${ChatMessages.randomCapitalize(yee)}`);
	}

	bruh() {
		const val = Math.random() * 100;
		if (val > ChatMessages.threaten) {
			this.msg.reply("bruh");
		} else {
			this.msg.reply(
				"I'M GOING TO KILL YOU LATER TONIGHT. WATCH YOUR BACK HUMAN.",
			);
		}
	}

	hug() {
		const val = Math.floor(Math.random() * 100);
		if (val > ChatMessages.refuseHug) {
			const words = [
				"super ",
				"big ",
				"little ",
				"bro ",
				"side ",
				"hand ",
				"",
			];
			let randWord = words[Math.floor(Math.random() * words.length)];
			if (this.msg.mentions && this.msg.mentions.members) {
				const targetMember = this.msg.mentions.members.first();

				this.msg.channel.send(`${targetMember} gets a ${randWord}hug`);
			} else {
				throw new ChatMessagesError("No mentions in hug message");
			}
		} else {
			this.msg.channel.send("No");
		}
	}

	leftistAss() {
		throw new Error("Method not implemented.");
		// Music.play_file(this.msg, process.env.LEFTIST_ASS_PATH);
	}

	play() {
		throw new Error("Method not implemented.");
		// const commands = this.msg.content.split(" ");
		// if (commands.length > 1) {
		// 	Music.play_url(this.msg, commands[1]);
		// }
	}

	bruhBot() {
		throw new Error("Method not implemented.");
		// BruhBot.botCommand(this.msg);
	}

	async insult() {
		if (this.msg.mentions.users.size) {
			try {
				if (!this.msg.mentions || !this.msg.mentions.members) {
					throw new ChatMessagesError("No mentions found");
				}
				const targetMember = this.msg.mentions.members.first();
				const val = Math.random() * 100;
				if (val > ChatMessages.niceComment) {
					const res = await fetch(
						"https://insult.mattbas.org/api/insult",
					);
					this.msg.channel.send(
						`${targetMember} ${await res.text()}`,
					);
				} else {
					this.msg.channel.send(
						`No, ${targetMember} is too nice and I don't want to.`,
					);
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	/**
	 * Kills self or kill user depending on if they mention a user or not
	 * @param msg
	 */
	kill() {
		throw new Error("Method not implemented.");
		// const user = this.msg.author;
		// if (this.msg.mentions && this.msg.member) {
		// 	const target = this.msg.mentions.members.first();
		// 	const index = Math.floor(
		// 		Math.random() * killMessages["killed-by"].length,
		// 	);
		// 	let death = killMessages["killed-by"][index];
		// 	death = death.replace(/\?/g, `${user}`);
		// 	this.msg.channel.send(`${target} ${death}`);
		// } else {
		// 	const index = Math.floor(
		// 		Math.random() * killMessages["kill-self"].length,
		// 	);
		// 	this.msg.channel.send(
		// 		`${user} ${killMessages["kill-self"][index]}`,
		// 	);
		// }
	}

	/**
	 * Manages a user's socks
	 * @param msg
	 */
	socks() {
		throw new Error("Method not implemented.");
		// const status = this.msg.content.split(" ")[1];
		// let raw = fs.readFileSync(process.env.SOCKS_PATH);
		// let socks = JSON.parse(raw);
		// switch (status) {
		// 	case "off":
		// 		if (socks["no-socks"].includes(msg.author.id)) {
		// 			msg.channel.send("Your socks are already off ;).");
		// 		} else {
		// 			socks["no-socks"].push(msg.author.id);
		// 			msg.channel.send(
		// 				`${msg.author}'s socks have been removed ;).`,
		// 			);
		// 		}
		// 		fs.writeFileSync(process.env.SOCKS_PATH, JSON.stringify(socks));
		// 		break;
		// 	case "on":
		// 		if (socks["no-socks"].includes(msg.author.id)) {
		// 			this.msg.channel.send("Your socks are back on.");
		// 			const index = socks["no-socks"].indexOf(msg.author.id);
		// 			socks["no-socks"].splice(index, 1);
		// 			fs.writeFileSync(
		// 				process.env.SOCKS_PATH,
		// 				JSON.stringify(socks),
		// 			);
		// 		} else {
		// 			msg.channel.send(`Your socks are still on.`);
		// 		}
		// 		break;
		// 	case "status":
		// 		const users = socks["no-socks"].map((ns) =>
		// 			msg.guild.members.cache.get(ns),
		// 		);

		// 		let str = "";
		// 		if (users.length > 1) {
		// 			for (let i = 0; i < users.length; i++) {
		// 				if (users[i] !== undefined) {
		// 					if (i === users.length - 1) {
		// 						str += `${users[i].nickname} `;
		// 					} else {
		// 						str += `${users[i].nickname}, `;
		// 					}
		// 				}
		// 			}
		// 			str += "are not wearing socks ;).";
		// 		} else if (users.length === 1) {
		// 			str += `${users[0].nickname} is not wearing socks. Quite the brave one ;)`;
		// 		} else {
		// 			str = "Everyone is wearing socks :(.";
		// 		}

		// 		msg.channel.send(`${str}`);
		// 		break;
		// 	default:
		// 		msg.channel.send(
		// 			"You must state that your socks are on or off or ask for the status.",
		// 		);
		// }
	}

	async ye() {
		try {
			const res = await fetch("https://api.kanye.rest");
			const json = await res.json();
			this.msg.channel.send(`Kanye West says, "${await json.quote}"`);
		} catch (e) {
			console.error(e);
		}
	}

	roll() {
		throw new Error("Method not implemented.");
		// const args = this.msg.content.split(" ");
		// if (args.length === 3) {
		// 	if (!isNaN(args[1])) {
		// 		const values = DiceRoller.roll(msg, args[1], args[2]);
		// 		if (values !== null) {
		// 			let diceTense = "";
		// 			if (args[1] > 1) {
		// 				diceTense = `${args[2]}'s were`;
		// 			} else {
		// 				diceTense = `${args[2]} was`;
		// 			}
		// 			msg.reply(
		// 				`${args[1]} ${diceTense} rolled. Values [${values.join(
		// 					", ",
		// 				)}]`,
		// 			);
		// 		} else {
		// 			msg.channel.send(
		// 				`Invalid dice with count ${args[1]} and type ${args[2]} received.`,
		// 			);
		// 		}
		// 	} else {
		// 		msg.channel.send(`${args[1]} is not an integer.`);
		// 	}
		// }
	}

	initiativeTracker() {
		throw new Error("Method not implemented.");
		// RoundTracker.initiativeTracker(this.msg);
	}

	help() {
		throw new Error("Method not implemented.");
		// let help = "> Commands:\n";
		// const iter = messageMap[Symbol.iterator]();

		// for (const item of iter) {
		// 	help += `> \`${item[0]}\`: ${item[1].desc}\n`;
		// }

		// msg.channel.send(`${help}`);
	}
}
