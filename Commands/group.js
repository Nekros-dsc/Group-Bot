const Discord = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
  name: 'group',
  aliases: ['groupe', 'grp'],
  description: 'Allows to manage the group.'
};

exports.run = async (bot, message, args, config) => {
    const user = message.mentions.users.first() || bot.users.cache.get(args[0]);
    let group = await db.get(`group.${bot.user.id}`) || [];

    if(!config.owners.includes(message.author.id)) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('`❌` ▸ Unauthorized user')
            .setDescription('> *You are not allowed to execute this command.*')
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setColor('Red')
            .setTimestamp();
        return message.reply({ embeds: [embed] });
    }

    if (args.length === 0) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('`🪄` ▸ Group List')
            .setDescription(group.length > 0 ? group.map((userId, index) => { const user = bot.users.cache.get(userId); return `\`${index + 1}.)\` ${user} (\`${user.username}\` | \`${user.id}\`)`}).join('\n') : '> *No user is in the group list.*')
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setColor(config.color)
            .setTimestamp();
        return message.reply({ embeds: [embed] });
    }

    if (!user) {
        const embed = new Discord.EmbedBuilder()
            .setTitle('`❌` ▸ User not found')
            .setDescription('> *Please mention a valid user or provide a valid user ID.*')
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setColor('Red')
            .setTimestamp();
        return message.reply({ embeds: [embed] });
    }

    if (group.includes(user.id)) {
        group = group.filter(id => id !== user.id);
        await db.set(`group.${bot.user.id}`, group);
        const embed = new Discord.EmbedBuilder()
            .setTitle('`✅` ▸ Group List Remove')
            .setDescription(`> *${user} (\`${user.username}\` | \`${user.id}\`) was successfully removed from the group.*`)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setColor('Green')
            .setTimestamp();
        return message.reply({ embeds: [embed] });
    } else {
        group.push(user.id);
        await db.set(`group.${bot.user.id}`, group);
        const embed = new Discord.EmbedBuilder()
            .setTitle('`✅` ▸ Group List Add')
            .setDescription(`> *${user} (\`${user.username}\` | \`${user.id}\`) was successfully added to the group.*`)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setColor('Green')
            .setTimestamp();
        return message.reply({ embeds: [embed] });
    }
};