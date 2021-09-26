const { MessageEmbed } = require('discord.js')

const helpEmbed = new MessageEmbed()
  .setColor("#0091ff")
  .setTitle("Commands Help!")
  .setDescription("Below you will see the available commands of our Bot!")
  .addFields(
    { name: "Utilities", value: "`!help`, `!ping`, `!prefix`" },
    { name: "Apps", value: "`!weather`" },
    { name: "Command Category 3", value: "Some other Commands" }
  )
  .setTimestamp();

// expose constants
module.exports = {
    helpEmbed: helpEmbed,
}