//----------------------------- prerequisites --------------------------------
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

// load axios for API usage
const axios = require("axios");

//---------------------------- constants ------------------------------------
const commandsEmbed = new Discord.MessageEmbed()
  .setColor("#0091ff")
  .setTitle("Commands Help!")
  .setDescription("Below you will see the available commands of our Bot!")
  .addFields(
    { name: "Utilities", value: "`!help`, `!ping`, `!prefix`" },
    { name: "Apps", value: "`!weather`" },
    { name: "Command Category 3", value: "Some other Commands" }
  )
  .setTimestamp();

//----------------------------- functions ------------------------------------
async function getWeather(message, location) {
  console.log(`WeatherAPI: Request current weather data for ${location} on behalf of ${message.author.username}`)
  await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_TOKEN}&q=${location}&aqi=no`)
    .then(data => data.data)
    .then(body => 
      {
        const theembed = new Discord.MessageEmbed()
	            .setColor('#0099ff')
	            .setTitle(`Weather in ${body.location.name}, ${body.location.country}`)
	            .setAuthor('WeatherAPI.com', 'https://cdn.weatherapi.com/v4/images/weatherapi_logo.png', 'https://www.weatherapi.com/')
	            .setDescription(`**${body.current.condition.text}** with **${body.current.humidity}%** humidity and **${body.current.wind_kph} km/h (${body.current.wind_mph} mph)** ${body.current.wind_dir} winds.`)
	            .setThumbnail(`https:${body.current.condition.icon}`)
	            .addFields(
		            { name: '🌡 Temperature:', value: `${body.current.temp_c} °C/${body.current.temp_f} °F`, inline: true },
		            { name: '🤷 Feels like:', value: `${body.current.feelslike_c} °C/${body.current.feelslike_f} °F`, inline:true },
		            { name: '🌧 Precipitation:', value: `${body.current.precip_mm} mm/${body.current.precip_in} in`, inline: true },
		            { name: '⛅ Cloudcover:', value: `${body.current.cloud}%`, inline: true },
                { name: '👁 Visibility:', value: `${body.current.vis_km} km/${body.current.vis_miles} mi`, inline: true },
                { name: '🗜 Pressure:', value: `${body.current.pressure_mb} mbar/${body.current.pressure_in} in`, inline: true }
	            )
	            .setTimestamp()
	            .setFooter(`Last updated: ${body.current.last_updated}`);
        message.reply({embeds: [theembed]})
          .then(console.log)
          .catch(console.error);
      }
    )
    .then(console.log)
    .catch(console.error);
}

//------------------------- define reactions ---------------------------------
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
  // get weather
  if (message.content.startsWith(prefix + "weather")) {
    var tmp = message.content.split(" ")[1];
    if (tmp == undefined) {
      message.reply("Please provide a valid location for your request, i.e. `!weather <location>`");
    } else {
      getWeather(message, tmp);
    }
  }
});

// on ready state
client.on("ready", () => {
  console.log(client.user.username + " is ready!");
});

//---------------------------- login client ---------------------------------
client.login(process.env.TOKEN);
