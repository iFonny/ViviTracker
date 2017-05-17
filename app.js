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
    // TODO: IL FAUT TRAVAILLER !!!
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