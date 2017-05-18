let Commands = [];

Commands.track = {
    name: 'track',
    help: 'Track user.',
    usage: '(<public>)(<private>) <@USER> (<@USER>+)',
    fn: function (Client, bot, m, params) {
        let settings = {};
        m.delete();

        // Split params in array
        params = Client.fn.splitParams(params);

        // Default settings
        if (!(params.includes('private') || params.includes('priv')) &&
            !(params.includes('public') || params.includes('pub'))) {
            settings.private = true;
            settings.public = true;
        } else {

            // Get settings
            if (params.includes('public') || params.includes('pub'))
                settings.public = true;
            else settings.public = false;

            if (params.includes('private') || params.includes('priv'))
                settings.private = true;
            else settings.private = false;
        }

        // Save users to track
        m.mentions.forEach((item) => {
            Client.fn.trackUser(Client, {
                    id: item.id,
                    username: item.username,
                    discriminator: item.discriminator,
                    avatar: item.avatarURL,
                    settings: settings
                }).then((user) => Client.fn.dm(bot, m.author.id, `:white_check_mark: Now tracking <@${user.id}> ${user.settings.public ? 'in *public*' : ''}`))
                .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err.message + '`'));
        });
    }
}

Commands.untrack = {
    name: 'untrack',
    help: 'Untrack user.',
    usage: '<@USER> (<@USER>+)',
    fn: function (Client, bot, m, params) {
        let settings = {};
        m.delete();

        // Split params in array
        params = Client.fn.splitParams(params);

        // Save users to track
        m.mentions.forEach((item) => {
            Client.fn.untrackUser(Client, {
                    id: item.id,
                    username: item.username,
                    discriminator: item.discriminator
                }).then((user) => Client.fn.dm(bot, m.author.id, `:white_check_mark: No longer tracking <@${user.id}>`))
                .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err.message + '`'));
        });
    }
}

Commands.tracklist = {
    name: 'tracklist',
    help: 'List of tracked users.',
    fn: function (Client, bot, m, params) {
        m.delete();

        let msg = '__Tracking list:__ \n\n';
        let users = require('./data/trackedUsers.json');

        Object.keys(users).forEach((key) => {
            msg += `- <@${users[key].id}> | private: **${users[key].settings.private}** | public: **${users[key].settings.public}**\n`;
        });

        Client.fn.dm(bot, m.author.id, msg);
    }
}

Commands.follow = {
    name: 'follow',
    help: 'Follow user.',
    usage: '<@USER>',
    fn: function (Client, bot, m, params) {
        m.delete();

        // Split params in array
        params = Client.fn.splitParams(params);

        if (m.mentions && m.mentions[0]) {
            Client.fn.followUser(Client, {
                    id: m.mentions[0].id,
                    username: m.mentions[0].username,
                    discriminator: m.mentions[0].discriminator,
                    avatar: m.mentions[0].avatarURL
                }).then((user) => Client.fn.dm(bot, m.author.id, `:white_check_mark: Now follow <@${m.mentions[0].id}>`))
                .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err.message + '`'));
        }
    }
}

Commands.unfollow = {
    name: 'unfollow',
    help: 'Unfollow user.',
    fn: function (Client, bot, m, params) {
        m.delete();

        Client.fn.unfollowUser(Client)
            .then((user) => Client.fn.dm(bot, m.author.id, `:white_check_mark: Follow disabled`))
            .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err.message + '`'));
    }
}

exports.Commands = Commands