import { User } from "./reducer";
import axios from "axios";

const API_URL = process.env.API_URL;

export enum Action {
  SET_USER = 'SET_USER'
}

export const setUser = (user: User[]) => ({
  type: Action.SET_USER,
  payload: user,
});

// Get all users
export const getUsers = () => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      let users: User[] = [];
      
      res.data.map((el: any) => {
        const user = { key: el._id, id: el._id, name: el.name, email: el.email || '', phone: el.phone || '', address: el.address || '' };

        users.push(user);
      });
      console.log(users)

      dispatch(setUser(users));
    } catch (e) {
      console.log(e, 'error');
    }
  };  
};

// Create user
export const addUser = (user: User) =>{
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.post(`${API_URL}/user/create`, user);

      console.log(res);
      dispatch(getUsers());
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

// Update user
export const updateUser = (user: User) =>{
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.put(`${API_URL}/user/update/${user.id}`, user);

      console.log(res);
      dispatch(getUsers());
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

// Delete user
export const deleteUser = (id: string) =>{
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.delete(`${API_URL}/user/delete/${id}`);

      console.log(res);
      dispatch(getUsers());
    } catch (e) {
      console.log(e, 'error');
    }
  };
};