import axios from 'axios';
import queryString from 'query-string';
import { SpoofCallInterface, SpoofCallGetQueryInterface } from 'interfaces/spoof-call';
import { GetQueryInterface } from '../../interfaces';

export const getSpoofCalls = async (query?: SpoofCallGetQueryInterface) => {
  const response = await axios.get(`/api/spoof-calls${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSpoofCall = async (spoofCall: SpoofCallInterface) => {
  const response = await axios.post('/api/spoof-calls', spoofCall);
  return response.data;
};

export const updateSpoofCallById = async (id: string, spoofCall: SpoofCallInterface) => {
  const response = await axios.put(`/api/spoof-calls/${id}`, spoofCall);
  return response.data;
};

export const getSpoofCallById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/spoof-calls/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSpoofCallById = async (id: string) => {
  const response = await axios.delete(`/api/spoof-calls/${id}`);
  return response.data;
};
