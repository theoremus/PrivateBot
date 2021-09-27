exports.execute = (client, message, args) => 
{
  if (args.length != 0 && message.member.permissions.any("ADMINISTRATORS")) {
    client.config.set("prefix", args[0]).then(() => {console.log(`Prefix: \'${args[0]}\' was set in database`)});
    client.prefix = args[0];
    message.reply(`The new prefix is: \`${client.prefix}\``)
      .catch(console.error);
  } else {
    message.reply(
      `The active prefix is: \`${client.prefix}\`` +
      `\nTo assign a new prefix provide an option, i.e. ` +
      `\`!prefix <new prefix>\`\nIf this does not work, ` + 
      `you might have insufficient permissions.`
    )
    .catch(console.error);
  }
}

exports.help = {
  name: '`prefix`',
  description: 'Responds with the current prefix or assigns a new prefix, if one is provided.',
  usage: 'prefix <new prefix(optional)>'
}