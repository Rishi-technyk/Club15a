import _ from 'lodash';

import * as api from '../../util/api';
import {ENDPOINT} from '../../util/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TAG_LOGIN_SERVICES = 'LOGIN_SERVICES';

export async function loginWith(username, password, data,notificationPermission) {
  try {
    const apiRequestObject = {
      path: ENDPOINT.login,
      body: {
        memberid: username,
        password: password,
        device_id: data.deviceId,
        device_type: data.devicePlatform,
        device_app_version: data.deviceVersion,
        has_notification_permission:notificationPermission
      },
    };
    const response = await api.javascriptPost(apiRequestObject);
    console.log(response,apiRequestObject,'------------------------------------response,apiRequestObject-------------------------');
    if (response.status && response.token) {
      const Data = await JSON.stringify(response);

      await AsyncStorage.setItem('user', Data);
    }
    return response;
  } catch (err) {
    return {result: 'Something went wrong'};
  }
}

export async function logout(id) {
  try {
    const apiRequestObject = {
      path: '',
      body: {
        ws_type: ENDPOINT.logout,
        id: id,
      },
    };
    const response = await api.javascriptPost(apiRequestObject);
    return response;
  } catch (err) {
    return {result: FAILURE};
  }
}
