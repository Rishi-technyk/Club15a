import { ENDPOINT } from "../../util/constant";
import * as api from '../../util/api';

export async function VerifySigninOTP(payload) {
  let body ={}
    body.ws_type = ENDPOINT.verify_otp;
    body.member_id = payload.member_id
    body.otp = payload.otp;
    body.password= payload.passwordValue;
    // body.email = 'nishant.sukhwal@gmail.com'
    // body.payload = payload
    try {
        const apiRequestObject = {
            path: ENDPOINT.verify_otp,
            body: body
        }

        const response = await api.javascriptPost(apiRequestObject);
    console.log(response, "---------------response---pass------------");
        return (response);
    }
    catch (err) {
        return { err }
    }
}
