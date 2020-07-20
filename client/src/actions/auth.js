import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';
import axios from 'axios';
import { setAlert } from './alert';
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      //'Content-Type': 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    console.log('axios body');
    console.log(body);
    const res = await axios.post('/api/users', config, body);
    console.log('data=');
    console.log('res');
    console.log(res);
    console.log(body);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};
