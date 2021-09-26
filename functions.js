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

exports.getWeather = async (message, location) => {
  console.log(`WeatherAPI: Request current weather data for ${location} on behalf of ${message.author.username}`)
  await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_TOKEN}&q=${location}&aqi=no`)
    .then(data => data.data)
    .then(body => 
      {
        message.reply({embeds: [getWeatherEmbed(body)]})
          .then(console.log)
          .catch(console.error);
      }
    )
    .then(console.log)
    .catch(console.error);
}

getPongEmbed = (message) => {
  return new MessageEmbed()
    .setTitle(`🏓  **Pong** `)
    .setDescription(`**Latency:** ${Date.now() - message.createdTimestamp} ms`)
    .setColor('#0099ff')
}

exports.getPong = (message) => {
  message.reply({
      content: `${message.author}`,
      embeds: [getPongEmbed(message)]
  });
}