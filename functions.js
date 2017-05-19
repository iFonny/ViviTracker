module.exports = {

    dm: function (bot, id, contenu) {
        bot.getDMChannel(id).then(channel => {
            bot.createMessage(channel.id, contenu);
        }).catch(error => {
            console.log(error);
        });
    },

    splitParams: (params) => {
        let news = [];
        params = params.split(" ");
        for (let i = 0; i < params.length; i++)
            if (params[i] != '') news.push(params[i]);
        return news;
    },

    sendDeletedMessage: (Client, bot, user, message) => {
        let embed = {
            content: "\n",
            embed: {
                color: __config.colors.red,
                timestamp: new Date(),
                author: {
                    name: user.username,
                    icon_url: user.avatar
                },
                fields: [{
                    name: '👀 Message deleted 🗑',
                    value: `<@${user.id}> 💬 <#${message.channel.id}> \`\`\`\n${message.content}\n\`\`\``,
                    inline: true
                }]
            }
        }

        if (message.content && message.content.trim() != '')
            bot.createMessage(__config.settings.deleted_channel, embed);
    },

    sendVoiceLog: (Client, bot, user, channel, status) => {
        let embed = {
            content: "\n",
            embed: {
                color: status ? __config.colors.green : __config.colors.red,
                timestamp: new Date(),
                author: {
                    name: user.username,
                    icon_url: user.avatarURL
                },
                fields: [{
                    name: `👀 Channel ${status ? 'joined' : 'left'} 📞`,
                    value: `${status ? '📥' : '📤'} <@${user.id}> ${status ? 'join' : 'leave'} __<#${channel.id}>__ (in **__${channel.guild.name}__**)`,
                    inline: true
                }]
            }
        }
        bot.createMessage(__config.settings.voicelog_channel, embed);
    },

    trackUsers: (Client, users) => {
        return promise = new Promise((resolve, reject) => {
            delete require.cache[require.resolve('./data/trackedUsers.json')];
            let tracked = require('./data/trackedUsers.json');

            if (!tracked) tracked = {};
            if (users.length == 0) reject('Please use <@USER_ID> as first param');

            users.forEach((user) => {
                tracked[user.id] = user;
            });

            Client.fs.writeFile('./data/trackedUsers.json', JSON.stringify(tracked), (err) => {
                if (err) return reject(err.message);

                let msg = '';
                users.forEach((user) => {
                    console.log(`Now tracking: ${user.username}#${user.discriminator} (private: ${user.settings.private}, eyes: ${user.settings.eyes}).`);
                    msg += `:white_check_mark: Now tracking <@${user.id}> ${user.settings.eyes ? 'and :eyes:' : ''}\n`;
                });

                resolve(msg);
            });
        })
    },

    untrackUsers: (Client, users) => {
        return promise = new Promise((resolve, reject) => {
            delete require.cache[require.resolve('./data/trackedUsers.json')];
            let tracked = require('./data/trackedUsers.json');

            if (!tracked) tracked = {};
            if (users.length == 0) reject('Please use <@USER_ID> as first param');

            users.forEach((user) => {
                delete tracked[user.id];
            });

            Client.fs.writeFile('./data/trackedUsers.json', JSON.stringify(tracked), (err) => {
                if (err) return reject(err.message);

                let msg = '';
                users.forEach((user) => {
                    console.log(`${user.username}#${user.discriminator} Untracked.`);
                    msg += `:white_check_mark: No longer tracking <@${user.id}>\n`;
                });

                resolve(msg);
            });
        });
    },

    untrackAll: (Client) => {
        return promise = new Promise((resolve, reject) => {
            let tracked = {};

            Client.fs.writeFile('./data/trackedUsers.json', JSON.stringify(tracked), (err) => {
                if (err) return reject(err);

                console.log(`All users Untracked.`);
                resolve();
            });
        });
    },

    followUser: (Client, user) => {
        return promise = new Promise((resolve, reject) => {
            Client.fs.writeFile('./data/followedUser.json', JSON.stringify(user), (err) => {
                if (err) return reject(err);

                console.log(`Now follow: ${user.username}#${user.discriminator}.`);
                resolve(user);
            });
        })
    },

    unfollowUser: (Client) => {
        return promise = new Promise((resolve, reject) => {
            Client.fs.writeFile('./data/followedUser.json', JSON.stringify({}), (err) => {
                if (err) return reject(err);

                console.log(`No longer follow`);
                resolve();
            });
        })
    },

    addAdmin: (Client, id) => {
        return promise = new Promise((resolve, reject) => {
            delete require.cache[require.resolve('./data/allowedIDS.json')];
            let allowed = require('./data/allowedIDS.json');

            if (!allowed) allowed = [__config.hyperadmin];
            allowed.push(id);

            Client.fs.writeFile('./data/allowedIDS.json', JSON.stringify(allowed), (err) => {
                if (err) return reject(err);

                console.log(`Admin added: ${id}.`);
                resolve(id);
            });
        })
    },

    deleteAdmin: (Client, id) => {
        return promise = new Promise((resolve, reject) => {
            delete require.cache[require.resolve('./data/allowedIDS.json')];
            let allowed = require('./data/allowedIDS.json');

            if (!allowed) allowed = [__config.hyperadmin];
            allowed = allowed.filter((i) => i != id);
            if (allowed.length == 0) allowed.push(__config.hyperadmin);

            Client.fs.writeFile('./data/allowedIDS.json', JSON.stringify(allowed), (err) => {
                if (err) return reject(err);

                console.log(`Admin removed: ${id}.`);
                resolve(id);
            });
        })
    },

};