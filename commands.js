let Commands = [];

Commands.track = {
    name: 'track',
    help: 'Track user.',
    usage: '(<public>) <@USER> (<@USER>+)',
    fn: function (Client, bot, m, params) {

        // Default settings
        let settings = {
            private: true,
            public: false
        };

        // Split params in array
        params = Client.fn.splitParams(params);

        // Get settings
        if (params.includes('public') || params.includes('pub'))
            settings.public = true;

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

        // Split params in array
        params = Client.fn.splitParams(params);

        if (params[0] && params[0] == 'all')
            Client.fn.untrackAll(Client)
            .then((user) => Client.fn.dm(bot, m.author.id, `:white_check_mark: All users deleted`))
            .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err.message + '`'));

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
        delete require.cache[require.resolve('./data/trackedUsers.json')];
        delete require.cache[require.resolve('./data/followedUser.json')];
        let users = require('./data/trackedUsers.json');
        let followed = require('./data/followedUser.json');

        let msg = '__Track list:__ \n\n';

        Object.keys(users).forEach((key) => {
            msg += `- <@${users[key].id}> | private: **${users[key].settings.private}** | public: **${users[key].settings.public}**\n`;
        });

        msg += '\n\n__Follow list:__ \n\n';
        if (followed && followed.id)
            msg += `- ${followed.username}#${followed.discriminator}`;

        Client.fn.dm(bot, m.author.id, msg);
    }
}

Commands.follow = {
    name: 'follow',
    help: 'Follow user.',
    usage: '<@USER>',
    fn: function (Client, bot, m, params) {

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
        Client.fn.unfollowUser(Client)
            .then((user) => Client.fn.dm(bot, m.author.id, `:white_check_mark: Follow disabled`))
            .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err.message + '`'));
    }
}

Commands.addadmin = {
    name: 'addadmin',
    help: 'Add admin user.',
    usage: '<@USER> (<@USER>+)',
    fn: function (Client, bot, m, params) {

        // Add admin
        m.mentions.forEach((item) => {
            Client.fn.addAdmin(Client, item.id)
                .then((id) => Client.fn.dm(bot, m.author.id, `:white_check_mark: <@${id}> is now an admin`))
                .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err.message + '`'));
        });
    }
}

Commands.deladmin = {
    name: 'deladmin',
    help: 'Remove admin user.',
    usage: '<@USERS> (<@USER>+)',
    fn: function (Client, bot, m, params) {

        // Remove admin
        m.mentions.forEach((item) => {
            Client.fn.deleteAdmin(Client, item.id)
                .then((id) => Client.fn.dm(bot, m.author.id, `:white_check_mark: <@${id}> is now a random`))
                .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err.message + '`'));
        });
    }
}

exports.Commands = Commands