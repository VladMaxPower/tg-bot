import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import {addNewUser, ban, getUserDataByName, getUserIdsByFistLastName, isUserAdmin, mute} from './users.js'
import {addForbiddenWord, getAllForbiddenWords} from "./forbiddenWords.js";
dotenv.config();
const chatId = process.env.CHANNEL_ID;
const botChatId =process.env.BOT_CHAT_ID;
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

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
async function handleError(chatId, errorMsg) {
    console.log(errorMsg);
    await bot.sendMessage(chatId, errorMsg);
}

bot.on('message', async (msg) => {
    try {
        if (String(msg.chat.id) === chatId) {
            const {id, first_name, last_name, username} = msg.from;
            await addNewUser(id, first_name, last_name, username);
            await checkAndDeleteMessages(msg);
        }
    } catch (err){
        console.log(`${err}`);
    }
});

bot.onText(/\/(ban|mute)(ById)? (.+)/, async (msg, match) => {
    if (!await isUserAdmin(msg.from.id)){
        return;
    }
    try{
    const command = match[1];
    const byId = !!match[2];// Convert the matched "ById" to a boolean
    const userData = !byId ? await getUserDataByName(match[3]) : [{ user_id: match[3], user_name: 'без імені' }];
    if (command === 'ban') {
        await ban(bot, userData[0].user_id, userData[0].user_name);
    } else if (command === 'mute') {
        await mute(bot, userData[0].user_id, userData[0].user_name);
    }
        }catch (err){
        console.log(err);
    }
});

bot.onText(/\/getIdByNames (.+)/, async (msg, match) => {
    if (!await isUserAdmin(msg.from.id)){
        return;
    }
    try {
        const usersData = await getUserIdsByFistLastName(match[1]);
        await bot.sendMessage(botChatId, `${JSON.stringify(usersData)}`);
    } catch (err) {
        await handleError(botChatId, `не знайшов данні по юзеру 😶 ${match[1]}`);
    }
});

bot.onText(/\/setKeyWord (.+)/, async (msg, match) => {
    if (!await isUserAdmin(msg.from.id)){
        return;
    }
    try {
        const keyword = match[1].toLowerCase();
        await addForbiddenWord(keyword);
        await bot.sendMessage(botChatId, `Додано 🫡`);
    } catch (err) {
        await handleError(botChatId, `не вдалось додати слово`);
    }
});