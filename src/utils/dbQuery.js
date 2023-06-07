import dbConnect from "./connectToDB.js";


async function insertNewUser(userId,firstName,lastName,userName) {
    await dbConnect(`INSERT INTO users (user_id,first_name,last_name,user_name)
                        VALUES (${userId},'${firstName}','${lastName}','${userName}')`);
}

async function isUserExists(userId){
    return dbConnect(`select count(1) from users where user_id ='${userId}'`);
}

async function getUserDataByNickName(userName){
   return dbConnect(`select * from users where user_name ='${userName}'`);
}

async function getUserIdByUserNames(firstName,lastName){
    return dbConnect(`select * from users where first_name ='${firstName}' and last_name ='${lastName}'`);
}

async function setForbiddenWord(word){
    return dbConnect(`INSERT INTO forbidden_words (word) VALUES('${word}')`);
}
async function getForbiddenWords(){
    return dbConnect('select word from forbidden_words');
}

export {insertNewUser,isUserExists,getUserDataByNickName,getUserIdByUserNames,setForbiddenWord,getForbiddenWords}