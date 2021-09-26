const { MessageEmbed } = require("discord.js")

getPongEmbed = (message) => {
  return new MessageEmbed()
    .setTitle(`🏓  **Pong** `)
    .setDescription(`**Latency:** ${Date.now() - message.createdTimestamp} ms`)
    .setColor('#0099ff')
}

exports.execute = (client, message, args) => 
{
  message.reply({
      content: `${message.author}`,
      embeds: [getPongEmbed(message)]
  })
  .catch(console.error);
}

exports.help = {
  name: '`ping`',
  description: 'Retrieve the current latency of PVT Bot',
  usage: 'ping'
}