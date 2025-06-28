import { ENDPOINT } from "../../util/constant";
import * as api from '../../util/api';

export async function forgotPassword(memberId){

    let body ={}
    
    body.member_id = memberId
    try {
        const apiRequestObject = {
            path: ENDPOINT.forgot_password,
            body: body
        }
        const response = await api.javascriptPost(apiRequestObject);
        return(response)
        }

    catch (err) {
        return {result:err}
    }
}
