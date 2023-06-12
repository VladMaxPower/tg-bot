import {
    isUserExists,
    insertNewUser,
    getUserDataByNickName,
    getUserIdByUserNames,
    getUserIdByFirstNames
} from './utils/dbQuery.js';
import dotenv from 'dotenv';
dotenv.config();
const chatId = process.env.CHANNEL_ID;
const adminsId = process.env.ADMINS_ID;

async function addNewUser(userId,firstName,lastName,userName){
    const isExists =await isUserExists(userId);
    if (isExists[0].count ==='0'){
    await insertNewUser(userId,String(firstName),String(lastName),String(userName));
    }
}
async function getUserDataByName(userName){
    try{
   return await getUserDataByNickName(userName);
        }catch (err){
        console.log(err);
    }
}

async function getUserIdsByFistLastName(data){
   const userNames = data.split('&');
   if(String(userNames[1])==='undefined'){
     return getUserIdByFirstNames(String(userNames[0]));
   } else{
   return getUserIdByUserNames(String(userNames[0]),String(userNames[1]));
       }
}

async function ban(bot,userId,userName,botChatId){
    try {
        await bot.banChatMember(chatId, userId);
        await bot.sendMessage(botChatId, `Юзер успішно забанен 🫡 ${userName}`);
    } catch (err){
        await bot.sendMessage(botChatId, `Помилка під час бану юзера 🫠 ${userName}`);
        console.log(`ban user error:   ${err}`);
    }
}

async function mute(bot,userId,userName,botChatId){
    try{
        await bot.restrictChatMember(chatId, userId,{
            can_send_messages: false,
            can_send_media_messages: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false,
        })
        await bot.sendMessage(botChatId, `Юзер успішно замьючен 🫡 ${userName}`);
    } catch (err){
        await bot.sendMessage(botChatId, `Помилка під час мьюту юзера 🫠 ${userName}`);
        console.log(`mute user error:   ${err}`);
    }
}

async function isUserAdmin(senderId){
    try{
    const ids = adminsId.split(',');
    return ids.includes(String(senderId));
        }catch (err){
        console.log(err)
    }
}




export {addNewUser,getUserDataByName,getUserIdsByFistLastName,ban,mute,isUserAdmin};