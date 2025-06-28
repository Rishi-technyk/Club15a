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



const commonReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INTERNET_CHANGED':
            return {
                ...state,
                isInternetReachable: action.payload.isInternetReachable,
                isConnected: action.payload.isConnected,
            };
        default:
            return state;
    }
};

export default commonReducer;
