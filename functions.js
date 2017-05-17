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

};