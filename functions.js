module.exports = {

    dm: function(bot, id, contenu) {
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

    trackUser: (Client, user) => {
        return promise = new Promise((resolve, reject) => {
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

    getDate: () => {
        return `${new Date().getDate()().length == 1 ? '0' + new Date().getDate()() : new Date().getDate()()}/${(new Date().getMonth() + 1).toString().length == 1 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)}/${new Date().getFullYear()} - ${new Date().getHours().toString().length == 1 ? '0' + new Date().getHours().toString() : new Date().getHours()}h${new Date().getMinutes().toString().length == 1 ? '0' + new Date().getMinutes().toString() : new Date().getMinutes()}`
    }

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
