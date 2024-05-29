const config = require('../config.json');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const Discord = require('discord.js');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, bot) {
    try {
      if (newMessage.guild || newMessage.author.bot) return;

      const group = await db.get(`group.${bot.user.id}`) || [];
      if (group.includes(newMessage.author.id)) {
        const messageTrack = await db.get(`messageTrack.${bot.user.id}.${newMessage.id}`) || {};

        for (const userId in messageTrack) {
          if (userId !== newMessage.author.id) {
            const user = await bot.users.fetch(userId);
            const userMessageId = messageTrack[userId];
            if (user && userMessageId) {
              const dmChannel = await user.createDM();
              const userMessage = await dmChannel.messages.fetch(userMessageId);
              if (userMessage) {
                const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: newMessage.author.username, iconURL: newMessage.author.displayAvatarURL({ dynamic: true }), url: 'https://discord.gg/uhq' })
                .setDescription(newMessage.content.trim() || null)
                .setFooter({ text: bot.user.username, iconURL: bot.user.displayAvatarURL({ dynamic: true} )})
                .setColor(config.color)
                .setTimestamp();
                await userMessage.edit({ embeds: [embed] });
              }
            }
          }
        }
      }
    } catch {}
  },
};
