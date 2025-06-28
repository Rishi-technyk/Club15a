
import { takeLatest, call, put, select, takeEvery } from 'redux-saga/effects';
// import * as api from '../services/api'; // Import your API functions
import {
  loginSuccess,
  loginFailure,
  signupSuccess,
  signupFailure,
  loginUserFailure
} from '../actions/authActions';
import { logout, loginWith } from '../../screens/Login/LoginService'; // Import your logout API function


function* login(action) {
  try {
    const { username, password, data } = action.payload;

    const res = yield call(loginWith, username, password, data);

    if (res.status === true) {

      yield put(loginSuccess(res));
    } else {
      yield put(loginFailure(res))
    }

  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

function* signup(action) {
  try {
    const { username, password, email } = action.payload;
    // const user = yield call(api.signupApi, username, password, email); // Call your API function
    yield put(signupSuccess(user));
  } catch (error) {
    yield put(signupFailure(error.message));
  }
}



export function* logoutUser(action) {
  // Select the current state
  const state = yield select();
  const { auth } = state;

  // Extract user ID from the state
  const id = auth.userData?.data?.data[0]?.MemberID;

  try {
    const response = yield call(logout, id);
  } catch (error) {
    yield put(loginUserFailure(error))
  }

}

export function* authSaga() {
  yield takeEvery('LOGIN_REQUEST', login);
  yield takeLatest('SIGNUP_REQUEST', signup);
  yield takeEvery('TRIGGER_LOGOUT', logoutUser);
}
