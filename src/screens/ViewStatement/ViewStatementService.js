import _ from 'lodash';

import * as api from '../../util/api';
import {SERVER_CODES, ENDPOINT} from '../../util/constant';
import { useQuery } from '@tanstack/react-query';


const fetchTransactions = async ({queryKey}) => {
  const [, startDate, endDate, memberId, token,  paymode, location,] = queryKey;
 
  const body =
    startDate && endDate
      ? {
          ws_type: ENDPOINT.invoice_transaction_filter,
          start_date: startDate,
          end_date: endDate,
          member_id: memberId,
        }
      : {
          ws_type: ENDPOINT.invoice,
          pay_mode: paymode,
          locations: location,
          member_id: memberId,
        };

  const apiRequestObject =
    startDate && endDate
      ? {
          path: ENDPOINT.invoice_transaction_filter,
          body: body,
          Token: token,
          
        }
      : {
          path: ENDPOINT.invoice,
          body: body,
          Token: token,
        };

  const response = await api.javascriptPost(apiRequestObject);
  if (!startDate && !endDate) {
    let body = {};
    body.ws_type = ENDPOINT.account_summary;
    body.member_id = memberId;

    const apiRequestObject = {
      path: ENDPOINT.account_summary,
      body: {},
      Token: token,
    };

    const data = await api.javascriptGet(apiRequestObject);
    
    newData = {
      ...response,
      closing_balance: data.data.outstanding_amt,
      opening_balance: data.data.bill_amt,
      credit_amt: data.data.total_credit,
      debit_amt: data.data.total_debit,
    };
    return newData;
  } else {
    return response;
  }
};
 
export async function getStatement({ queryKey }) {
  const [, member_id, token] = queryKey;

 

  try {
    const apiRequestObject = {
      path: ENDPOINT.statement,
      body: {},
      Token: token,
    };
    const response = await api.javascriptGet(apiRequestObject);
  
    return response.data;
  } catch (err) {
    console.error(err)
    return {result: FAILURE};
  }
}

export const useStatments = userData => {
  const memberId = userData?.data?.data?.[0]?.MemberID;
  return useQuery({
    queryKey: ['statments', memberId, userData?.data?.token], // Ensure unique key
    queryFn: getStatement,
    enabled: !!userData?.data?.token,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
export const useTransactions = (startDate, endDate, userData,paymode, location) => {
  const memberId = userData?.data?.data?.[0]?.MemberID;

  return useQuery({
    queryKey: [
      'transactions',
      startDate || '',
      endDate || '',
      memberId,
      userData.data.token,
      paymode, 
      location
    ], // Ensure unique key
    queryFn: fetchTransactions,
    enabled: !!memberId,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
    retry: 2, // Retry twice on failure
    refetchOnWindowFocus: false, // Prevent refetching on tab switch
  });
};
const fetchRecharges = async ({ queryKey }) => {
  const [, startDate, endDate, location, memberId,token,paymode] = queryKey;
  const body =
    (startDate && endDate) || location.length
      ? {
          start_date: startDate,
          pay_mode: paymode,
          locations: location,
          end_date: endDate,
          member_id: memberId,
        }
      : {
          pay_mode: paymode,
          member_id: memberId,
        };

  const apiRequestObject =
    (startDate && endDate) || location.length
      ? {
          path: ENDPOINT.transaction_filter,
          body: body,
          Token: token,
        }
      : {
          path: ENDPOINT.transaction,
          body: body,
          Token: token,
        };
 
  const response = await api.javascriptPost(apiRequestObject);
  console.log('\x1b[36m%s\x1b[0m', response, '---------------------- response ---------------------');
  return response;
};
export const useRecharges = (startDate, endDate, location, userData,paymode) => {
 

  return useQuery({
    queryKey: [
      "transactions",
      startDate || "",
      endDate || "",
      location,
      userData?.data?.data?.[0]?.MemberID,
      userData?.data?.token,
      paymode
    ], // Ensure unique key
    queryFn: fetchRecharges,
    enabled: !!userData?.data?.data?.[0]?.MemberID,
    // staleTime: 1000 * 60 * 5, // Cache for 5 mins
    retry: 2, // Retry twice on failure
    refetchOnWindowFocus: false, // Prevent refetching on tab switch
  });
};