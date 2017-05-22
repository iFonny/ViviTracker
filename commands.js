let Commands = [];

Commands.track = {
    name: 'track',
    help: 'Track user. Add *\'noeyes\'* as first param to disable eyes.',
    usage: '(noeyes|ne|e) <@USER> (<@USER>+)',
    fn: function (Client, bot, m, params) {

        // Default settings
        let users = [];
        let settings = {
            private: true,
            eyes: true
        };

        // Split params in array
        params = Client.fn.splitParams(params);

        // Get settings
        if (params.includes('e') || params.includes('ne') || params.includes('noeyes'))
            settings.eyes = false;

        // Get users
        m.mentions.forEach((item) => {
            users.push({
                id: item.id,
                username: item.username,
                discriminator: item.discriminator,
                avatar: item.avatarURL,
                settings: settings
            });
        });

        // Track users
        Client.fn.trackUsers(Client, users)
            .then((msg) => Client.fn.dm(bot, m.author.id, msg))
            .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err + '`'));
    }
}

Commands.untrack = {
    name: 'untrack',
    help: 'Untrack user.',
    usage: '<@USER> (<@USER>+)',
    fn: function (Client, bot, m, params) {

        // Split params in array
        params = Client.fn.splitParams(params);
        let users = [];

        // Untrack all users
        if (params[0] == 'all')
            Client.fn.untrackAll(Client)
            .then((user) => Client.fn.dm(bot, m.author.id, `:white_check_mark: All users deleted`))
            .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err.message + '`'));

        // Get users
        m.mentions.forEach((item) => {
            users.push({
                id: item.id,
                username: item.username,
                discriminator: item.discriminator
            })
        });

        // Untrack users
        Client.fn.untrackUsers(Client, users)
            .then((msg) => Client.fn.dm(bot, m.author.id, msg))
            .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err + '`'));
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
            msg += `- <@${users[key].id}> ${users[key].settings.eyes ? ':eyes:' : ''}\n`;
        });

        msg += '\n\n__Follow list:__ \n\n';
        if (followed && followed.id)
            msg += `- <@${followed.id}>`;

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

        // Follow user
        if (m.mentions && m.mentions[0]) {
            Client.fn.followUser(Client, {
                    id: m.mentions[0].id,
                    username: m.mentions[0].username,
                    discriminator: m.mentions[0].discriminator,
                    avatar: m.mentions[0].avatarURL
                }).then((user) => Client.fn.dm(bot, m.author.id, `:white_check_mark: Now follow <@${m.mentions[0].id}>`))
                .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err.message + '`'));
        } else Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `Please use <@USER_ID> as first param`');
    }
}

Commands.unfollow = {
    name: 'unfollow',
    help: 'Unfollow user.',
    fn: function (Client, bot, m, params) {
        bot.joinVoiceChannel(__config.settings.vivibed).then(() => console.log('In vivi\'s bed')).catch((err) => console.log(err));
        Client.fn.unfollowUser(Client)
            .then((user) => Client.fn.dm(bot, m.author.id, `:white_check_mark: Follow disabled`))
            .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err.message + '`'));
    }
}

Commands.pp = {
    name: 'pp',
    help: 'Change profile picture from url.',
    usage: 'URL',
    fn: function (Client, bot, m, params) {

        // Split params in array
        params = Client.fn.splitParams(params);

        if (params[0] && params[0].startsWith('http')) {
            Client.request.get(params[0], function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');

                    bot.editSelf({
                        avatar: data
                    }).then(user => {
                        Client.fn.dm(bot, m.author.id, `:white_check_mark: New profile picture : ${params[0]}`);
                        console.log('Profile picture updated');
                    }).catch(e => {
                        Client.fn.dm(bot, m.author.id, `:exclamation: **Error**: \`${e.message}\``);
                        console.log(e);
                    });
                } else Client.fn.dm(bot, m.author.id, `:exclamation: **Error**: \`${error.message}\``);
            });
        } else Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `Please use URL as first param`');
    }
}

Commands.rename = {
    name: 'rename',
    help: 'Rename user.',
    usage: 'username',
    fn: function (Client, bot, m, params) {
        if (params) {
            bot.editSelf({
                username: params,
                password: __config.password
            }).then(() => {
                Client.fn.dm(bot, m.author.id, `:white_check_mark: Renamed to: <@${bot.user.id}>`);
                console.log(`Renamed to : ${bot.user.username}#${bot.user.discriminator}`);
            }).catch(() => {
                console.log("Couldn't rename");
            });
        } else Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `Please use USERNAME as first param`');
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

Commands.bed = {
    name: 'bed',
    help: 'Go to bed.',
    fn: function (Client, bot, m, params) {

        // Join channel
        bot.joinVoiceChannel(__config.settings.vivibed)
            .then((channel) => console.log(`In vivi's bed`))
            .catch((err) => console.log(`Can\'t join bed`));
    }
}

Commands.join = {
    name: 'join',
    help: 'Join user channel.',
    fn: function (Client, bot, m, params) {

        // Join channel
        if (m.member.voiceState.channelID) {
            bot.joinVoiceChannel(m.member.voiceState.channelID)
                .then((channel) => console.log(`Join ${channel.channelID}`))
                .catch((err) => console.log(`Can\'t join this channel (${m.member.voiceState.channelID})`));
        }
    }
}

Commands.leave = {
    name: 'leave',
    help: 'Leave user channel.',
    fn: function (Client, bot, m, params) {

        // Leave channel
        if (m.member.voiceState.channelID)
            bot.joinVoiceChannel(__config.settings.vivibed).then(() => console.log('In vivi\'s bed')).catch((err) => console.log(err));
    }
}

Commands.say = {
    name: 'leave',
    help: 'Speak in channel.',
    usage: 'channelID message',
    fn: function (Client, bot, m, params) {

        // Split params in array
        params = Client.fn.splitParams(params);

        if (params && params.length >= 2) {
            let channelID = params.shift();
            let message = params.join(' ');
            bot.createMessage(channelID, message)
                .then(() => {}).catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err.message + '`'));
        } else Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `ChannelID or message missing`');
    }
}

Commands.addlilly = {
    name: 'addlilly',
    help: 'Add a bbLilly sentence',
    usage: 'message',
    fn: function (Client, bot, m, params) {
        if (params && params.length > 0) {

            // Add message bbLilly
            Client.fn.addLillyBlabla(Client, params)
                .then((msg) => Client.fn.dm(bot, m.author.id, msg))
                .catch((err) => Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `' + err + '`'));
        } else Client.fn.dm(bot, m.author.id, ':exclamation: **Error**: `Please use MESSAGE as first param`');
    }
}

Commands.help = {
    name: 'help',
    help: 'Commands list.',
    fn: function (Client, bot, m, params) {
        var msg = '';

        for (var key in Commands) {
            msg += `\`${__config.settings.prefix}${Commands[key].name} ${Commands[key].usage ? Commands[key].usage : ''} -> ${Commands[key].help}\`\n`
        }
        Client.fn.dm(bot, m.author.id, msg);
    }
}

exports.Commands = Commands