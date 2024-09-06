import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/user/users`;
//for manage users
const getUsers = async (token) => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

const blockUser = async (userId, token) => {
  return axios.patch(
    `${API_URL}/${userId}/block`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
};

const unblockUser = async (userId, token) => {
  return axios.patch(
    `${API_URL}/${userId}/unblock`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
};

export { getUsers, blockUser, unblockUser };
