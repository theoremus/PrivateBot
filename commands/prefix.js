exports.execute = (client, message, args) => 
{
  var prefix = "!"
  //client.config.get("prefix", {raw: true}).then(value => prefix = value );
  if (args.length != 0 && message.member.permissions.any("ADMINISTRATORS")) {
    console.log(args);
    prefix = args[0];
    //client.config.set("prefix", prefix);
    message.reply(`The new prefix is: \`${prefix}\``)
      .catch(console.error);
  } else {
    message.reply(
      `The active prefix is: \`${prefix}\`` +
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