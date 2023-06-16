const TelegramApi = require('node-telegram-bot-api');

const token = '6069935185:AAHthWatrXYrn64OsxcGpoaHvzzY1j-B6as';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const {gameOptions, restartOptions} = require('./options');

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Guess a number from 0 to 10:');
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Start bot' },
        { command: '/help', description: 'Help' },
        { command: '/game', description: 'Game: Guess number!' }
    ])

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/73d/1f1/73d1f10a-6a3b-42e8-8b2d-183761652057/9.webp')
            return bot.sendMessage(chatId, `Welcome to my bot, ${msg.from.first_name}!`)
        }

        if (text === '/help') {
            return bot.sendMessage(chatId, `What do you want ${msg.from.first_name}?`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'I don\'t understand you! Please use menu!')
        // console.log(msg);
    })

    bot.on('callback_query', (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/restart') {
            return startGame(chatId)
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `My number is ${chats[chatId]} \n You won!:)`, restartOptions)
        } else {
            return bot.sendMessage(chatId, `My number is ${chats[chatId]} \n You lose!:(`, restartOptions)
        }

    })

}

start();


