import { ENDPOINT } from "../../util/constant";
import * as api from '../../util/api';
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function VerifySigninOTP(payload,data) {
    let body ={}
    body.member_id = payload.member_id
    body.otp = payload.otp,
    body.device_id= data.deviceId,
    body.device_type=data.devicePlatform,
    body.device_app_version= data.deviceVersion
    body.has_notification_permission= payload.has_notification_permission
  
    try {
        const apiRequestObject = {
            path: ENDPOINT.verify_signin_otp,
            body: body
        }

        const response = await api.javascriptPost(apiRequestObject);
        if(response.status){

            const Data=await JSON.stringify(response)
    
          await AsyncStorage.setItem("user",Data)}
      
        return (response);
    }
    catch (err) {
        return { result: FAILURE }
    }
}
