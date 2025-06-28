import _ from "lodash";

import * as api from "../util/api";
import { useQuery } from "@tanstack/react-query";
import { ENDPOINT } from "../util/constant";
import moment from "moment";

const fetchTransactions = async ({ queryKey }) => {
  const [, startDate, endDate, memberId, token] = queryKey;

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

  let body = {};
  body.member_id = member_id;

  try {
    const apiRequestObject = {
      path: ENDPOINT.statement,
      body: body,
      Token: token,
    };
    const response = await api.javascriptPost(apiRequestObject);

    return response;
  } catch (err) {
    console.error(err);
    return { result: FAILURE };
  }
}

export const useStatments = (userData) => {
  const memberId = userData?.data?.data?.[0]?.MemberID;
  return useQuery({
    queryKey: ["statments", memberId, userData?.data?.token],
    queryFn: getStatement,
    enabled: !!userData?.data?.token,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
export const useTransactions = (startDate, endDate, userData) => {
  const memberId = userData?.data?.data?.[0]?.MemberID;

  return useQuery({
    queryKey: [
      "transactions",
      startDate || "",
      endDate || "",
      memberId,
      userData.data.token,
    ], // Ensure unique key
    queryFn: fetchTransactions,
    enabled: !!memberId,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
    retry: 2,
    refetchOnWindowFocus: false, // Prevent refetching on tab switch
  });
};
const fetchSlots = async (id, session_id, date, token) => {
  try {
    const apiRequestObject = {
      path: `${ENDPOINT.get_slots + id}`,
      body: {
        from_date: date,
        to_date: moment(date).add(3, "days").format("YYYY-MM-DD"),
        sessionId: session_id,
      },
      Token: token,
    };

    const response = await api.javascriptPost(apiRequestObject);
    return response;
  } catch (error) {
    console.error(error, "from api");
  }
};
const fetchSessions = async (id, session_id, token) => {
  try {
    const apiRequestObject = {
      path: ENDPOINT.sessions,
      body: {},
      Token: token,
    };
    console.log(
      apiRequestObject,
      "apiRequestObject apiRequestObject apiRequestObject"
    );
    let response = await api.javascriptGet(apiRequestObject);

    return response;
  } catch (error) {}
};

export const useSlots = (id, session_id, date, userData) => {
  const token = userData?.data?.token;
  // Fetch facility slots
  const slotsQuery = useQuery({
    queryKey: ["slots", id || "", session_id || 0, date, token],
    queryFn: () => fetchSlots(id, session_id, date, token),
    enabled: true,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Fetch sessions (only once at first render if token exists)
  const sessionsQuery = useQuery({
    queryKey: ["sessions"],
    queryFn: () => fetchSessions(),
    enabled: true,
    staleTime: Infinity, // never refetch unless manually
    cacheTime: Infinity, // keep it in cache forever
    retry: 1,
  });

  return { slotsQuery, sessionsQuery };
};
const getchGameTypes = async (facility, token) => {
  console.log('-----------------------------------(------------------------');
  try {
    const apiRequestObject = {
      path: ENDPOINT.game_type + facility,
      Token: token,
      body: {},
    };
    const response = await api.javascriptGet(apiRequestObject);
    return response;
  } catch (error) {
    console.error("Error fetching game types:", error);
  return { status: false, error };
  }
};
const getGuests = async (member_id, page, search,token) => {
  try {
    const apiRequestObject = {
      path: `${
        ENDPOINT.get_guest_info + member_id
      }?page=${page}&search=${search}`,

      body: {},
    };
    const response = await api.javascriptGet(apiRequestObject);
    return response||[];
  } catch (error) {
   
  }
};

export const usePlayers = (page, search, facility, userData) => {
  const token = userData?.data?.token;
  const member_id = userData?.data?.data?.[0]?.MemberID;
  // Fetch facility slots
  const guestQuery = useQuery({
    queryKey: ["guests", member_id, page || 1, search, token],
    queryFn: () => getGuests(member_id, page, search, token),
    enabled: true,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Fetch sessions (only once at first render if token exists)
  const gameQuery = useQuery({
    queryKey: ["game_type"],
    queryFn: () => getchGameTypes(facility, token),
    enabled: true,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 1,
  });

  return { guestQuery, gameQuery };
};
