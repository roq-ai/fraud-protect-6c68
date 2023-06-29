import { ClientInterface } from 'interfaces/client';
import { PhoneNumberInterface } from 'interfaces/phone-number';
import { GetQueryInterface } from 'interfaces';

export interface SpoofCallInterface {
  id?: string;
  status: string;
  client_id: string;
  phone_number_id: string;
  created_at?: any;
  updated_at?: any;

  client?: ClientInterface;
  phone_number?: PhoneNumberInterface;
  _count?: {};
}

export interface SpoofCallGetQueryInterface extends GetQueryInterface {
  id?: string;
  status?: string;
  client_id?: string;
  phone_number_id?: string;
}
