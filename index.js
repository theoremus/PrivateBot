// keep server alive
process.on("exit", async () => {
  console.log("exit…");
  try {
  } catch (_) {}
  process.exit();
});
setTimeout(() => process.emit("exit"), 1000 * 60 * 60 * 12);

// run the server
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Ok"));

app.listen(process.env.PORT, () =>
  console.log("Your app is listening on port " + process.env.PORT)
);

// start the bot
// define prefix
var prefix = "!";

// get discord client
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILDS]
});

// constants
const commandsEmbed = new Discord.MessageEmbed()
  .setColor("#0091ff")
  .setTitle("Commands Help!")
  .setDescription("Below you will see the available commands of our Bot!")
  .addFields(
    { name: "Utilities", value: "`!help`, `!ping`, `!prefix`" },
    { name: "Command Category 2", value: "Commands" },
    { name: "Command Category 3", value: "Some other Commands" }
  )
  .setTimestamp();

// define reactions
// on command
client.on("messageCreate", message => {
  console.log(
    '"' + message.content + '" has been posted by ' + message.author.username
  );
  // help embed
  if (message.content.startsWith(prefix + "help")) {
    message
      .reply({ embeds: [commandsEmbed] })
      .then(console.log)
      .catch(console.error);
  }
  // change prefix
  if (message.content.startsWith(prefix + "prefix")) {
    var tmp = message.content.split(" ")[1];
    if (tmp != undefined && message.member.permissions.any("ADMINISTRATORS")) {
      prefix = tmp;
      message.reply("The new prefix is: `" + prefix + "`");
    } else {
      message.reply(
        "The active prefix is: `" +
          prefix +
          "`\nTo assign a new prefix provide an option, i.e. `!prefix <new prefix>`\nIf this does not work, you might have insufficient permissions."
      );
    }
  }
  // get latency
  if (message.content.startsWith(prefix + "ping")) {
    message.reply({
      content: `${message.author}`,
      embeds: [
        new Discord.MessageEmbed()
          .setTitle(`🏓  **Pong** `)
          .setDescription(
            `**Latency:** ${Date.now() - message.createdTimestamp} ms`
          )
          .setColor("BLUE")
      ]
    });
  }
});

// on ready state
client.on("ready", () => {
  console.log(client.user.username + " is ready!");
});

// login client
client.login(process.env.TOKEN);
