import {getForbiddenWords, setForbiddenWord} from "./utils/dbQuery.js";


async function addForbiddenWord(word){
   await setForbiddenWord(word);
}

async function getAllForbiddenWords(){
    return getForbiddenWords();
}

export {addForbiddenWord,getAllForbiddenWords}