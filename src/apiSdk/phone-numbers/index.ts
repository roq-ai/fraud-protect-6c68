import axios from 'axios';
import queryString from 'query-string';
import { PhoneNumberInterface, PhoneNumberGetQueryInterface } from 'interfaces/phone-number';
import { GetQueryInterface } from '../../interfaces';

export const getPhoneNumbers = async (query?: PhoneNumberGetQueryInterface) => {
  const response = await axios.get(`/api/phone-numbers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPhoneNumber = async (phoneNumber: PhoneNumberInterface) => {
  const response = await axios.post('/api/phone-numbers', phoneNumber);
  return response.data;
};

export const updatePhoneNumberById = async (id: string, phoneNumber: PhoneNumberInterface) => {
  const response = await axios.put(`/api/phone-numbers/${id}`, phoneNumber);
  return response.data;
};

export const getPhoneNumberById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/phone-numbers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePhoneNumberById = async (id: string) => {
  const response = await axios.delete(`/api/phone-numbers/${id}`);
  return response.data;
};
