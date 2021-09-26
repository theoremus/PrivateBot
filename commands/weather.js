const { MessageEmbed } = require("discord.js")
const axios = require("axios")

getWeatherEmbed = (body) => {
  return new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`Weather in ${body.location.name}, ${body.location.country}`)
	.setAuthor('WeatherAPI.com',
    'https://cdn.weatherapi.com/v4/images/weatherapi_logo.png',
    'https://www.weatherapi.com/')
	.setDescription(
    `**${body.current.condition.text}** with **${body.current.humidity}%** ` +
    `humidity and **${body.current.wind_kph} km/h (${body.current.wind_mph} mph)** ` + 
    `${body.current.wind_dir} winds.`
  )
	.setThumbnail(`https:${body.current.condition.icon}`)
	.addFields(
		{ 
      name: '🌡 Temperature:', 
      value: `${body.current.temp_c} °C/${body.current.temp_f} °F`, 
      inline: true 
    },
		{ 
      name: '🤷 Feels like:', 
      value: `${body.current.feelslike_c} °C/${body.current.feelslike_f} °F`, 
      inline:true 
    },
		{ 
      name: '🌧 Precipitation:', 
      value: `${body.current.precip_mm} mm/${body.current.precip_in} in`, 
      inline: true 
    },
		{ 
      name: '⛅ Cloudcover:', 
      value: `${body.current.cloud}%`, 
      inline: true 
    },
    { 
      name: '👁 Visibility:', 
      value: `${body.current.vis_km} km/${body.current.vis_miles} mi`, 
      inline: true 
    },
    { 
      name: '🗜 Pressure:',
      value: `${body.current.pressure_mb} mbar/${body.current.pressure_in} in`,
      inline: true 
    }
	)
	.setTimestamp()
	.setFooter(`Last updated: ${body.current.last_updated}`);
}

getWeather = async (message, location) => {
  console.log(
    `WeatherAPI: Request current weather data for ` + 
    `${location} on behalf of ${message.author.username}`
  )
  await axios.get(
    `http://api.weatherapi.com/v1/current.json?key=` +
    `${process.env.WEATHER_TOKEN}&q=${location}&aqi=no`
    )
    .then(data => data.data)
    .then(body => 
      {
        message.reply({embeds: [getWeatherEmbed(body)]})
          .catch(console.error);
      }
    )
    .catch(console.error);
}

exports.execute = (client, message, args) => 
{
  if (args.length == 0) {
    message.reply(
      `Please provide a valid location for your request, ` +
      `i.e. \`!weather <location>\``
    )
    .catch(console.error);
  } else {
    getWeather(message, args[0]);
  }
}

exports.help = {
  name: '`weather`',
  description: 'Provides the current weather for the given location',
  usage: 'weather <location>'
}