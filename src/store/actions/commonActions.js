
export const loginRequest = (username, password,data) => {
  
    return {
      type: 'LOGIN_REQUEST',
      payload: { username, password,data }
    };
  };
  
  export const loginSuccess = (data) => ({
    type: 'USER_LOGIN_SUCCESS',
    payload: { data }
  });
  
  export const loginFailure = (error) => ({
    type: 'LOGIN_FAILURE',
    payload: { error }
  });
  
  export const signupRequest = (username, password, email) => ({
    type: 'SIGNUP_REQUEST',
    payload: { username, password, email }
  });
  
  export const signupSuccess = (user) => ({
    type: 'SIGNUP_SUCCESS',
    payload: { user }
  });
  
  export const signupFailure = (error) => ({
    type: 'SIGNUP_FAILURE',
    payload: { error }
  });
  
  export const logoutSuccess = (data) => ({
    type: 'LOGOUT_SUCCESS',
    payload: { data }
  });
  
  export const loginUserFailure = (error) =>  {
    return {
      type: 'USER_LOGIN_FAILURE',
      payload: error
    }
  }
  
  
  export const changeInternetState = (internetState) => {
    return {
      type: 'INTERNET_CHANGED',
      payload: internetState
    }
  }
  
  