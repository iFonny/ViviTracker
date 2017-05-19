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
    let followed = require('./data/followedUser.json');

    console.log('Track list: ');
    Object.keys(users).forEach((key) => {
        console.log(`- ${users[key].username}#${users[key].discriminator} (private: ${users[key].settings.private}, eyes: ${users[key].settings.eyes})`);
    });
    console.log('Follow list: ');
    if (followed && followed.id)
        console.log(`- ${followed.username}#${followed.discriminator}`);
});


/**
 * Commands handler
 */

bot.on('messageCreate', m => {
    delete require.cache[require.resolve('./data/allowedIDS.json')];
    if (!require('./data/allowedIDS.json').includes(m.author.id) && m.author.id != __config.hyperadmin) return;

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
    delete require.cache[require.resolve('./data/trackedUsers.json')];
    let trackedUsers = require('./data/trackedUsers.json');

    if (m.author && trackedUsers[m.author.id]) {

        // Send message in log channel
        if (trackedUsers[m.author.id].settings.private)
            Client.fn.sendDeletedMessage(Client, bot, trackedUsers[m.author.id], m);

        // Send eyes
        if (trackedUsers[m.author.id].settings.eyes)
            bot.createMessage(m.channel.id, ':eyes:')
            .then((message) => console.log(`eyes sent to '${message.channel.name}'`))
            .catch((err) => console.log(err.message));
    }
});

bot.on('voiceChannelJoin', (member, newChannel) => {
    delete require.cache[require.resolve('./data/trackedUsers.json')];
    delete require.cache[require.resolve('./data/followedUser.json')];
    let trackedUsers = require('./data/trackedUsers.json');

    // Follow user
    if (require('./data/followedUser.json').id == member.id) {
        bot.joinVoiceChannel(newChannel.id)
            .then(() => console.log(`Join ${newChannel.name}`))
            .catch((err) => console.log(`Can\'t follow in this channel (${newChannel.name})`));
    }

    // Send log join
    if (trackedUsers[member.id])
        Client.fn.sendVoiceLog(Client, bot, member, newChannel, true);
});

bot.on('voiceChannelLeave', (member, oldChannel) => {
    delete require.cache[require.resolve('./data/trackedUsers.json')];
    delete require.cache[require.resolve('./data/followedUser.json')];
    let trackedUsers = require('./data/trackedUsers.json');

    // Follow user
    if (require('./data/followedUser.json').id == member.id) {
        bot.leaveVoiceChannel(oldChannel.id);
    }

    // Send log leave
    if (trackedUsers[member.id])
        Client.fn.sendVoiceLog(Client, bot, member, oldChannel, false);
});

bot.on('voiceChannelSwitch', (member, newChannel, oldChannel) => {
    delete require.cache[require.resolve('./data/trackedUsers.json')];
    delete require.cache[require.resolve('./data/followedUser.json')];
    let trackedUsers = require('./data/trackedUsers.json');

    // Follow user
    if (require('./data/followedUser.json').id == member.id) {
        bot.joinVoiceChannel(newChannel.id)
            .then(() => console.log(`Join ${newChannel.name}`))
            .catch((err) => console.log(`Can\'t follow in this channel (${newChannel.name})`));
    }

    // Send log join
    if (trackedUsers[member.id])
        Client.fn.sendVoiceLog(Client, bot, member, newChannel, true);
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