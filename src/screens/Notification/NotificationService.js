import _ from 'lodash';
import * as api from '../../util/api';
import { ENDPOINT } from '../../util/constant';

export async function notificationList(token) {
    let body = {};
   
    // body.id = id;
    try {
        const apiRequestObject = {
            path: ENDPOINT.notification,
            body: body,
            Token: token
        }
        const response = await api.javascriptGet(apiRequestObject);
        return (response)
    }
    catch (err) {
        return { result: err }
    }
}