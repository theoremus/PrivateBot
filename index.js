// imports
const express = require("express");
const Database = require("@replit/database");
const axios = require("axios");
const Discord = require("discord.js");
const functions = require("./functions");
const constants = require("./constants")

//create configuration database
const config = new Database();
var prefix = "!";
config.get("prefix").then(value => prefix = value );
console.log(`The prefix is set to ${prefix}`);

// run app
const app = express();

app.get("/", (req, res) => res.send("Ok"));

app.listen(process.env.PORT, () =>
  console.log("Your app is listening on port " + process.env.PORT)
);

// start the bot
// get discord client
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILDS]
});

// on command
client.on("messageCreate", message => {
  console.log(
    '"' + message.content + '" has been posted by ' + message.author.username
  );
  // help embed
  if (message.content.startsWith(prefix + "help")) {
    message.reply({ embeds: [helpEmbed] })
      .then(console.log)
      .catch(console.error);
  }
  // change prefix
  if (message.content.startsWith(prefix + "prefix")) {
    var tmp = message.content.split(" ")[1];
    if (tmp != undefined && message.member.permissions.any("ADMINISTRATORS")) {
      prefix = tmp;
      config.set("prefix", prefix);
      message.reply("The new prefix is: `" + prefix + "`");
    } else {
      message.reply(
        `The active prefix is: \`${prefix}\`` +
        `\nTo assign a new prefix provide an option, i.e. ` +
        `\`!prefix <new prefix>\`\nIf this does not work, ` + 
        `you might have insufficient permissions.`
      );
    }
  }
  // get latency
  if (message.content.startsWith(prefix + "ping")) {
    functions.getPong(message);
  }
  // get weather
  if (message.content.startsWith(prefix + "weather")) {
    var tmp = message.content.split(" ")[1];
    if (tmp == undefined) {
      message.reply("Please provide a valid location for your request, i.e. `!weather <location>`");
    } else {
      functions.getWeather(message, tmp);
    }
  }
});

// on ready state
client.on("ready", () => {
  console.log(client.user.username + " is ready!");
});

//---------------------------- login client ---------------------------------
client.login(process.env.TOKEN);
