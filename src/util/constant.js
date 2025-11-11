

export const DOMAIN = {
  BASE: 'https://15asportsclub.in/15asports/api/',

  // BASE: "http://127.0.0.1:8000/api/",
  PAY_DOMAIN: "https://dsoi.org.in/membersection/mobileAPI/",
  SERVER_DOMAIN: "https://dsoi.org.in/",
  NEW_URL: "https://dsoi.org.in/",
};

export const NETWORK_CONSTANTS = {
  connectionTimeout: 100000, //2 mins
};
export const ENDPOINT = {
  // login: 'login',
  documents: "documents",
  login: "auth/login",
  member_profile: "member_profile",
  logout: "logout",
  create_recharge_pay_order:"member/create_pay_order",
  create_invoice_pay_order:"member/create_invoice_pay_order",
    process_payment:"member/process_payment",
  appointment: "appointment",
  app_history: "app_history",
  statement: "member/transation/summery",
  card_recharge: "card_recharge",
  generate_id: "generate_id",
  pay_success: "pay_success",
  cancel_appointment: "cancel_appointment",
  tee_avail: "tee_avail",
  tee_book: "tee_book",
  member_search: "member_search",
  member_search_id: "member_search_id",
  tee_delete: "tee_delete",
  tee_lock: "tee_lock",
  otp: "member/otp",
  card_balance: "member/card_balance",
  account_summary: "member/account_summary",
  get_facility: "get-facility",
  transaction: "member/transaction",
  menus: "menus",
  transaction_filter: "member/transaction_filter",
  editProfile: "editProfile",
  change_password: "member/change_password",
  forgot_password: "auth/forgot-password",
  card_recharge_response: "card_recharge_response",
  invoice_payment: "invoice_payment",
  invoice_recharge_response: "invoice_recharge_response",
  verify_otp: "auth/verify-otp",
  verify_signin_otp: "auth/verify_login_otp",
  send_OTP_Signin: "auth/send_login_otp",
  notification: "notifications",
  invoice: "member/invoice_transaction",
  invoice_transaction_filter: "member/invoice_transaction_filter",
  invoice_transaction_download: "member/invoice_transaction_download",
  transaction_download: "member/transaction_download",
  affilated_clubs: "affilated_clubs",
  transaction_filter: "member/transaction_filter",
  create_pay_order: "member/create_pay_order",
  feedBack:"member/feedback",

  //Facility
  get_slots: "get-facility-slots/",
  sessions: "get-sessions",
  game_type: "get-game-type/",
  get_guest_info: "get-guest-info/",
  create_activity_guest:'create-activity-guest',
  book_facilities:'book-facilities',

  //Bookings
  get_booking_details:'get-booking-details/',
  get_cancellation_amount:'get-cancellation-amount/',
  cancel_booking:'cancel-booking',
};

// export const WS_TYPE = {
//   send_OTP_Signin_ws_type: 'send_login_otp'
// }

export const AsyncStorageKeys = {
  FCM_TOKEN: "fcm_token",
  CUSTOM_DOMAIN: "custom_domain",
  ENABLE_SERVER_SETTINGS: "enable_server_settings",
  LOGIN_FAILURE_COUNT: "login_failure_count",
  MAXIMUM_LIMIT_TIME: "maximum_limit_time",
};

export const KeyboardType = {
  numberOnly: "number-pad",
  decimal: "decimal-pad",
};

export const DateTimeFormat = {
  measure_date_time: "MM/DD/YYYY hh:mm:ss A",
};

export const FONT_FAMILY = {
  normal: "OpenSans",
  semiBold: "OpenSans-Semibold",
  bold: "OpenSans-Bold",
  light: "OpenSans-Light",
  lobeter: "Lobster-Regular",
  Cinzel: "Cinzel-Regular",
  Muli: "Muli",
};

export const KEYBOARD_EVENTS = {
  IOS_ONLY: {
    KEYBOARD_WILL_SHOW: "keyboardWillShow",
    KEYBOARD_WILL_HIDE: "keyboardWillHide",
  },
  KEYBOARD_DID_SHOW: "keyboardDidShow",
  KEYBOARD_DID_HIDE: "keyboardDidHide",
};
