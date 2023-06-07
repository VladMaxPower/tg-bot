import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import {addNewUser, getUserDataByName, getUserIdsByFistLastName} from './users.js'
import {addForbiddenWord, getAllForbiddenWords} from "./forbiddenWords.js";
dotenv.config();
const chatId = process.env.CHANNEL_ID;
const botChatId =process.env.BOT_CHAT_ID;
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

async function banUser(chatId, userData) {
    try {
        await bot.banChatMember(chatId, userData[0].user_id);
        await bot.sendMessage(botChatId, `Юзер успішно забанен 🫡 ${userData[0].user_name}`);
    } catch (err){
        await bot.sendMessage(botChatId, `Помилка під час бану юзера 🫠 ${userData[0].user_name}`);
        console.log(`ban user error:   ${err}`);
    }
}
async function checkAndDeleteMessages(msg) {
    const messageText = (msg.text).toLowerCase()
    const keywordsResult = await getAllForbiddenWords();
    const keywords = keywordsResult.map(obj => obj.word);
    if (keywords.some(keyword => messageText && messageText.includes(keyword))) {
        try {
            await bot.deleteMessage(chatId, msg.message_id);
            console.log(`Message deleted: ${msg.text}`);
            await bot.sendMessage(botChatId,
                `Було видалено повідомлення від ${msg.from.username} з текстом: ${msg.text}`);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }
}
async function muteUser(chatId, userData) {
    try{
    await bot.restrictChatMember(chatId, userData[0].user_id,{
        can_send_messages: false,
        can_send_media_messages: false,
        can_send_other_messages: false,
        can_add_web_page_previews: false,
    })
    await bot.sendMessage(botChatId, `Юзер успішно замьючен 🫡 ${userData[0].user_name}`);
    } catch (err){
        await bot.sendMessage(botChatId, `Помилка під час мьюту юзера 🫠 ${userData[0].user_name}`);
        console.log(`mute user error:   ${err}`);
    }
}


bot.on('message', async (msg) => {
    try {
        if (String(msg.chat.id) === chatId) {
            console.log('тут')
            const {id, first_name, last_name, username} = msg.from;
            await addNewUser(id, first_name, last_name, username);
            await checkAndDeleteMessages(msg);
        }
    } catch (err){
        console.log(`${err}`);
    }
});

bot.onText(/\/ban (.+)/, async (msg, match) => {
    try {
        const userData = await getUserDataByName(match[1]);
        await banUser(chatId, userData);
    } catch (err){
        console.log(err);
    }
});

bot.onText(/\/mute (.+)/, async (msg, match) => {
    try{
    const userData = await getUserDataByName(match[1]);
    await muteUser(chatId, userData);
        }catch (err){
        console.log(err);
    }
});

bot.onText(/\/banById (.+)/, async (msg, match) => {
    try {
        await bot.banChatMember(chatId, match[1]);
        await bot.sendMessage(botChatId, `Юзер успішно забанен ${match[1]}`);
    } catch (err){
        await bot.sendMessage(botChatId, `Помилка під час бану юзера ${match[1]}`);
        console.log(`ban user error:   ${err}`);
    }
});

bot.onText(/\/muteById (.+)/, async (msg, match) => {
    try{
        await bot.restrictChatMember(chatId, match[1],{
            can_send_messages: false,
            can_send_media_messages: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false,
        })
        await bot.sendMessage(botChatId, `Юзер успішно замьючен ${match[1]}`);
    } catch (err){
        await bot.sendMessage(botChatId, `Помилка під час мьюту юзера ${match[1]}`);
        console.log(`mute user error:   ${err}`);
    }
});

bot.onText(/\/getIdByNames (.+)/, async (msg, match) => {
    try {
        const usersData = await getUserIdsByFistLastName(match[1]);
        await bot.sendMessage(botChatId, `${JSON.stringify(usersData)}`);
    } catch (err){
        await bot.sendMessage(botChatId, `не знайшов данні по юзеру 😶 ${match[1]}`);
        console.log(`getIdByNames user error:   ${err}`);
    }
});

bot.onText(/\/setKeyWord (.+)/, async (msg, match) => {
    try {
        await addForbiddenWord(match[1].toLowerCase())
        await bot.sendMessage(botChatId, `Додано 🫡`);
    } catch (err){
        await bot.sendMessage(botChatId, `не вдалось додати слово`);
        console.log(`error adding word:   ${err}`);
    }
});