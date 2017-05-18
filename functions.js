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
            bot.createMessage(__config.settings.privateChannel, embed);
    },

    trackUser: (Client, user) => {
        return promise = new Promise((resolve, reject) => {
            delete require.cache[require.resolve('./data/trackedUsers.json')];
            let tracked = require('./data/trackedUsers.json');

            if (!tracked) tracked = {};
            tracked[user.id] = user;

            Client.fs.writeFile('./data/trackedUsers.json', JSON.stringify(tracked), (err) => {
                if (err) return reject(err);

                console.log(`Now tracking: ${user.username}#${user.discriminator} (private: ${user.settings.private}, public: ${user.settings.public}).`);
                resolve(user);
            });
        })
    },

    untrackUser: (Client, user) => {
        return promise = new Promise((resolve, reject) => {
            delete require.cache[require.resolve('./data/trackedUsers.json')];
            let tracked = require('./data/trackedUsers.json');

            if (!tracked) tracked = {};
            delete tracked[user.id];

            Client.fs.writeFile('./data/trackedUsers.json', JSON.stringify(tracked), (err) => {
                if (err) return reject(err);

                console.log(`${user.username}#${user.discriminator} Untracked.`);
                resolve(user);
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

    getDate: () => {
        return `${new Date().getDate()().length == 1 ? '0' + new Date().getDate()() : new Date().getDate()()}/${(new Date().getMonth() + 1).toString().length == 1 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)}/${new Date().getFullYear()} - ${new Date().getHours().toString().length == 1 ? '0' + new Date().getHours().toString() : new Date().getHours()}h${new Date().getMinutes().toString().length == 1 ? '0' + new Date().getMinutes().toString() : new Date().getMinutes()}`
    },

    vocalTrack: (Client, data, action) => {
        return promise = new Promise((resolve, reject) => {
            let date = require('./functions.js').getDate();
            let members = [];

            data.newChannel.voiceMembers.forEach(member => {
                members.push(`${member.username}#${member.discriminator}`);
            });

            if (fs.existsSync('./data/vocalLogs.txt')) fs.appendFile('./data/vocalLogs.txt', `\n\n${date} - ${data.member.username}#${data.member.discriminator} ${action.toUpperCase()} : ${data.newChannel.guild.name} - ${data.newChannel.name} | Members : ${members.join('   ')}`);
        });
    }

};