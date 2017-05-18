/**
 * Node modules
 */

const fs = require('fs');
const Eris = require('eris');

/**
 * Configs
 */

global.__config = require('./config.json');

const Commands = require('./commands.js').Commands;

const bot = new Eris(__config.token, {
    autoreconnect: true,
    compress: true,
    disableEveryone: false
});

const Client = {
    fs,
    fn: require('./functions.js'),
};

/**
 * Connexions
 */

bot.connect().then(() => {
    console.log('ViviTracker connected.');
}).catch((e) => {
    console.log(e);
});

bot.on('ready', () => {
    console.log('ViviTracker ready!');

    let users = require('./data/trackedUsers.json');
    console.log('Tracking list: ');
    Object.keys(users).forEach((key) => {
        console.log(`- ${users[key].username}#${users[key].discriminator} (private: ${users[key].settings.private}, public: ${users[key].settings.public})`);
    });
});


/**
 * Commands handler
 */

bot.on('messageCreate', m => {
    if (!require('./data/allowedIDS.json').includes(m.author.id)) return;

    if (m.content.toLowerCase().startsWith(__config.settings.prefix)) {
        let command = m.content.slice(__config.settings.prefix.length, m.content.length).split(" ")[0].toLowerCase();
        let params = m.content.slice(command.length + __config.settings.prefix.length + 1, m.content.length);

        if (Commands[command]) Commands[command].fn(Client, bot, m, params);
    }
});

/**
 * Tracker core :eyes: 👀
 */

bot.on('messageDelete', m => {
    let trackedUsers = require('./data/trackedUsers.json');

    if (m.author && trackedUsers[m.author.id]) {
        if (trackedUsers[m.author.id].settings.private) {
            // TODO: send message in __config.settings.privateChannel
        }
        if (trackedUsers[m.author.id].settings.public) {
            // TODO: send message in m.channel.id
        }
            
    }
});

bot.on('voiceChannelJoin', (member, newChannel) => {
    let trackedUsers = require('./data/trackedUsers.json');

    if (require('./data/followedUser.json').id == member.id) {
        // TODO: Join channel
    }

    if (trackedUsers[member.id]) {
        // TODO: send message in __config.settings.privateChannel
    }

    console.log(member.username + '(' + member.id  + ')' + ' join ' + newChannel.name);
});

bot.on('voiceChannelLeave', (member, oldChannel) => {
    let trackedUsers = require('./data/trackedUsers.json');

    if (require('./data/followedUser.json').id == member.id) {
        // TODO: Leave channel
    }

    if (trackedUsers[member.id]) {
        // TODO: send message in __config.settings.privateChannel
    }

    console.log(member.username + '(' + member.id  + ')' + ' leave ' + oldChannel.name);
});

bot.on('voiceChannelSwitch', (member, newChannel, oldChannel) => {

    if (require('./data/followedUser.json').id == member.id) {
        // TODO: Join channel
    }

    if (trackedUsers[member.id]) {
        // TODO: send message in __config.settings.privateChannel
    }

    console.log(member.username + '(' + member.id  + ')' + ' switch from ' + oldChannel.name + ' to ' + newChannel.name);
});

/**
 * Events
 */

bot.on("error", e => {
    console.log(e);
});

bot.on("warn", e => {
    console.log(e);
});

bot.on("disconnect", () => {
    setTimeout(() => {
        process.exit(1);
    }, 1500);
});

process.on("SIGINT", () => {
    bot.disconnect(false);
    setTimeout(() => {
        process.exit(1);
    }, 5000);
});
