
import _ from 'lodash';

import * as api from '../../util/api';
import { SERVER_CODES, ENDPOINT } from '../../util/constant';





export async function changePassword(details,token){
    let body = details;
    console.log(details, "---------------variableName---------------",token);
    try {
        const apiRequestObject = {
            path:ENDPOINT.change_password,
            body: body,
            Token:token
        }
        const response = await api.javascriptPost(apiRequestObject);
        
        return(response)
        }
    catch (err) {
        return {result: FAILURE}
    }
}
