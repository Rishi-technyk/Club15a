import * as api from '../../util/api';
import { ENDPOINT } from '../../util/constant';



export async function SigninWithOTPScreenService(member_id) {

   
    let body = {}
  
    body.member_id = member_id
   
    try {
        const apiRequestObject = {
            path: ENDPOINT.send_OTP_Signin,
            body: body
        }
       const response = await api.javascriptPost(apiRequestObject);
 return (response)
    }
    catch (err) {
        return { message:'Error occurred while sending OTP'}
    }
}