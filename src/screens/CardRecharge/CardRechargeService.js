import _ from 'lodash';

import * as api from '../../util/api';
import {SERVER_CODES, ENDPOINT} from '../../util/constant';
import {ApiRequestObject, ServiceResponse} from '../../util/types';
// import {SUCCESS, FAILURE} from '../../redux/ActionConstants';

export async function getRechargeData(member_id, amount) {
 
  let body = {};
  body.ws_type = ENDPOINT.card_recharge;
  // body.ws_type = ENDPOINT.create_pay_order; //here is new request
  body.member_id = member_id;
  body.amount = amount;
 
  try {
    const apiRequestObject = {
      path: '',
      body: body,
    };
    const response = await api.javascriptPost(apiRequestObject);
    return response;
  } catch (err) {
    return {result: FAILURE};
  }
}

export async function getRechargeDataNew(member_id,token) {
 
  let body = {};
  body.member_id = member_id;

  try {
    const apiRequestObject = {
      path:  ENDPOINT.card_balance,
      body: {},
      Token:token
    };
    const response = await api.javascriptGet(apiRequestObject);
    return response;
  } catch (err) {
    return {result: FAILURE};
  }
}

export async function genrateId(member_id, amount) {
  let body = {};
  body.ws_type = ENDPOINT.invoice_payment;
  body.member_id = member_id;
  body.additional_amount = amount;
  try {
    const apiRequestObject = {
      path: '',
      body: body,
    };
    const response = await api.javascriptPost(apiRequestObject);

    return response;
  } catch (err) {
    return {result: FAILURE};
  }
}



//new functioon
// Assume this is your generic API request function
export async function getRechargeNewData(payload,token) {
  
  const apiUrl = 'https://mbclublucknow.org/mbclublogin/api/member/create_pay_order';
 
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
console.log(response, "---------------response---22------------");
    const data = await response.json();
   
    return data;
  } catch (error) {
    throw new Error(`Error in getRechargeData: ${error.message}`);
  }
}
export async function getStatmentData(payload,token) {
  
  const apiUrl = 'https://mbclublucknow.org/mbclublogin/api/member/create_invoice_pay_order';
 
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error in getRechargeData: ${error.message}`);
  }
}