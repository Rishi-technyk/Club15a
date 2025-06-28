// src/reducers/authReducer.js

const initialState = {
  isInternetReachable: true,
  isConnected: true,
  isUserAuthenticated: undefined,
  isAuthenticatingUser: false,
  error: '',
  userData: undefined,
  isLogout: false,
  register_url: undefined,
  isFetchingProfile: undefined,
  userProfile: undefined,
  isVerifyingProfile: undefined,
  deviceId: "",
  deviceVersion: "",
  devicePlatform: "",
  deviceModal: ""
};

const authReducer = (state = initialState, action) => {
  
  
  switch (action.type) {
    case 'USER_LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticatingUser: false,
        userData: action.payload,
        isUserAuthenticated: true,
        error: '',
      };
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        error: null
      };
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
      return {
        ...state,
        isLoggedIn: false,
        error: action.payload.error
      };
    case 'USER_LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticatingUser: false,
        isUserAuthenticated: false,
        error: action.payload
      };
    case 'TRIGGER_LOGOUT':
      return {
        ...state,
        isUserAuthenticated: false,
        isPaused: true,
        register_url: undefined,
        isAuthenticatingUser: false,
        isVerifyingProfile: false,
        isFetchingProfile: false,
        userData: action.payload,
      }
    case 'INTERNET_CHANGED':
      return {
        ...state,
        isInternetReachable: action.payload.isInternetReachable,
        isConnected: action.payload.isConnected,
      };
    case 'REGISTER_USER_URL':
      return {
        ...state,
        register_url: action.payload.data
      };
     
    case 'SET_DEVICE_TOKEN':
      return {
        ...state,
        deviceId: action.payload.data
      }
    case 'SET_PLATEFORM':
      return {
        ...state,
        devicePlatform: action.payload.data
      }
    case 'SET_MODAL':
      return {
        ...state,
        deviceModal: action.payload.data
      }
    case 'SET_VERSION':
      return {
        ...state,
        deviceVersion: action.payload.data
      }
    default:
      return state;
  }
};

export default authReducer;


