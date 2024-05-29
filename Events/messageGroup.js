const config = require('../config.json');
const Discord = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  name: 'messageCreate',
  async execute(message, bot) {
    try {
      if (message.guild || message.author.bot) return;

      const group = await db.get(`group.${bot.user.id}`) || [];
      if (group.includes(message.author.id)) {
        const messageTrack = {};

        for (const userId of group) {
          if (userId !== message.author.id) {
            const user = await bot.users.fetch(userId);
            if (user) {
            const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }), url: 'https://discord.gg/uhq' })
            .setDescription(message.content.trim() || null)
            .setFooter({ text: bot.user.username, iconURL: bot.user.displayAvatarURL({ dynamic: true} )})
            .setColor(config.color)
            .setTimestamp();

            message.attachments.forEach(attachment => {
              if (attachment.contentType && attachment.contentType.startsWith('image/')) {
                embed.setImage(attachment.url);
              } else {
                embed.addFields({ name: 'Attachment', value: `[\`${attachment.name}\`](${attachment.url})` });
              }
            });

            const sentMessage = await user.send({ embeds: [embed] });
              messageTrack[userId] = sentMessage.id;
            }
          }
        }

        await db.set(`messageTrack.${bot.user.id}.${message.id}`, messageTrack);
      }
    } catch {}
  },
};