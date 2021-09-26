const { MessageEmbed } = require('discord.js')

exports.execute = (client, message, args) => {
  var prefix = "!";
  client.config.get("prefix").then(value => prefix = value );
  const embed = new MessageEmbed()
    .setColor('#e056fd')
  if (!args[0]) {
    embed
      .setTitle('**🪖 PVT Bot\'s Command List**')
      .setDescription(
        'PVT Bot is a multi-purpose Discord bot.\n' +
        'The PVT currently obeys the following commands:'
      )
      .addFields(
        client.commands.map(cmd => 
          {
            return { 
              name: `⚙️ **Command:** **${cmd.help.name}**`, 
              value: `**Description:** *${cmd.help.description}*\n**Usage:** \`${prefix}${cmd.help.usage}\``,
              inline: false 
            }
          }
        )
      );
  } else {
    const cmd = client.commands.get(args[0])
    if (!cmd) {
      message.channel.send(
        `The command ${cmd} is unknown!` + 
        `To list all commands, write: \`${prefix}help\``
      );
      return 0
    }
    embed
      .setTitle(`**Details on command ${cmd.help.name} :**`)
      .addField(
        `**Command: ** **${cmd.help.name}**`, 
        `**Description:**  *${cmd.help.description}*\n**Usage:** \`${prefix}${cmd.help.usage}\``
      )
  }
  embed.addField('\u200b', `__**Current Prefix**__: \`${ prefix }\``)
  message.reply({ embeds: [embed] })
    .catch(console.error);
  return 0
}

exports.help = {
  name: '`help`',
  description: 'Show all commands or specific command help',
  usage: 'help <command(optional)>'
}