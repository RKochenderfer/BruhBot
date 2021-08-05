"use strict";

require("dotenv").config();
const Discord = require("discord.js");
global.client = new Discord.Client();

const map = require("./modules/MessageMap");
const messageChecker = require("./modules/MessageChecker");

global.messageMap = map;

global.client.on("ready", () => {
  console.log(`Logged in as ${global.client.user.tag}!`);
});

global.client.on("guildMemberAdd", (member) => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === "general"
  );
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});

// Handles when a user says !corpse_found
global.client.on("message", (msg) => {
  try {
    const prefix = msg.content.split(" ")[0];
	if (msg.author.bot) return
    if (global.messageMap.has(prefix)) {
      let selected = global.messageMap.get(prefix);
      if (prefix === "!help") {
        selected.func(msg, messageMap);
      } else {
        selected.func(msg);
      }
    } else {
      messageChecker.CheckMessage(msg);
    }
  } catch (e) { }
});

global.client.login(process.env.TOKEN);
