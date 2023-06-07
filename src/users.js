import {isUserExists,insertNewUser,getUserDataByNickName,getUserIdByUserNames} from './utils/dbQuery.js';

async function addNewUser(userId,firstName,lastName,userName){
    const isExists =await isUserExists(userId);
    if (isExists[0].count ==='0'){
    await insertNewUser(userId,String(firstName),String(lastName),String(userName));
    }
}
async function getUserDataByName(userName){
   return await getUserDataByNickName(userName);
}

async function getUserIdsByFistLastName(data){
   const userNames = data.split(' ');
   return getUserIdByUserNames(String(userNames[0]),String(userNames[1]));
}

export {addNewUser,getUserDataByName,getUserIdsByFistLastName};