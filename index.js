// imports
const express = require("express");
const Database = require("@replit/database");
const axios = require("axios");
const Discord = require("discord.js");
const fs = require("fs");

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
// create command collection
client.commands = new Discord.Collection()
//create configuration database
client.config = new Database();
// local functions
client.prefix = "!";
client.config.get("prefix").then(value => 
  {
    client.prefix = value;
    console.log(`Prefix set to: ${value}`);
  });

// load all files with commands
fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    const props = require(`./commands/${ file }`);
    const commandName = file.split('.')[0];
    console.log(`Attempting to load command ${ commandName }`);
    client.commands.set(commandName, props);
  })
  return 0;
});

// on command
client.on("messageCreate", message => {
  // ignore bot messages, PM and messages without prefix
  if (message.author.bot) return
  if (!message.guild) return
  if (!message.content.startsWith(client.prefix)) return
  // get command and arguments
  var args = message.content.slice(client.prefix.length).trim().split(" ");
  var command = args.shift().toLowerCase();
  console.log(`Identified command: ${command}`);

  // log received message
  console.log(`\"${message.content}\" has been posted by ${message.author.username}`);
  
  // call command
  client.commands.get(command).execute(client, message, args);
});

// on ready state
client.on("ready", () => 
  { 
    console.log(client.user.username + " is ready!");
  });
// login client
client.login(process.env.TOKEN);
