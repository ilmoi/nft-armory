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
                return res as PNFT[]
            })
}

export async function getAnsweredQuestionsFromGMNH(): Promise<PNFT[]> {
    const pnfts = await retrieveAnsweredQuestions();
    return pnfts;
}

async function retrieveAnsweredQuestions(): Promise<PNFT[]> {
    return fetch('http://gmnh-service.herokuapp.com/answeredquestions')
            // the JSON body is taken from the response
            .then(res => res.json())
            .then(res => {
                return res as PNFT[]
            })
}

export async function getMyQuestionsFromGMNH(userWalletAddr: string): Promise<PNFT[]> {
    const pnfts = await retrievMyQuestions(userWalletAddr);
    return pnfts;
}

async function retrievMyQuestions(userWalletAddr: string): Promise<PNFT[]> {
    let myQuestionsUrl = 'http://gmnh-service.herokuapp.com/myquestions' + '/' + userWalletAddr;
    
    return fetch(myQuestionsUrl)
            // the JSON body is taken from the response
            .then(res => res.json())
            .then(res => {
                return res as PNFT[]
            })
}



