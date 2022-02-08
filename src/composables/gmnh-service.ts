import { DEFAULTS } from "@/globals";
import {PNFT} from "@/common/helpers/types"

export async function getOpenQuestionsFromGMNH(): Promise<PNFT[]> {
    const pnfts = await retrieveOpenQuestions();
    return pnfts;
}

async function retrieveOpenQuestions(): Promise<PNFT[]> {
    
    return fetch('http://gmnh-service.herokuapp.com/openquestions')
            // the JSON body is taken from the response
            .then(res => res.json())
            .then(res => {
                    // The response has an `any` type, so we need to cast
                    // it to the `User` type, and return it from the promise
                    return res as PNFT[]
            })
}



