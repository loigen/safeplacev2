import axiosInstance from "../../config/axiosConfig";

const API_URL = `${process.env.REACT_APP_API_URL}/user/users`;

const getUsers = async (token) => {
  return axiosInstance.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

const blockUser = async (userId, token) => {
  return axiosInstance.patch(
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
  return axiosInstance.patch(
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
