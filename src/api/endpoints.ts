import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export interface ICreateEndpoint {
  url: string;
  content: string;
}

export const createEndpoint = async (postData: ICreateEndpoint) => {
  const res = await axios.post(`${API_URL}/endpoint`, postData);

  console.log(res.data);

  return res.data;
};
