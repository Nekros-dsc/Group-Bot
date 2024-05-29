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

    let action;
    if (group.includes(user.id)) {
        group = group.filter(id => id !== user.id);
        action = 'removed';
    } else {
        group.push(user.id);
        action = 'added';
    }
    
    await db.set(`group.${bot.user.id}`, group);

    const embed = new Discord.EmbedBuilder()
        .setTitle(`\`✅\` ▸ Group List ${action === 'added' ? 'Add' : 'Remove'}`)
        .setDescription(`> *${user} (\`${user.username}\` | \`${user.id}\`) was successfully ${action} to/from the group.*`)
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setColor('Green')
        .setTimestamp();
    await message.reply({ embeds: [embed] });


    const embed2 = new Discord.EmbedBuilder()
        .setTitle(`\`📢\` ▸ Group Update`)
        .setDescription(`> *${user} (\`${user.username}\` | \`${user.id}\`) was ${action} to/from the group by ${message.author}.*`)
        .setFooter({ text: bot.user.username, iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
        .setColor(config.color)
        .setTimestamp();

    for (const userId of group) {
        try {
            const member = await bot.users.fetch(userId);
            await member.send({ embeds: [embed2] });
        } catch {}
    }
};
