import { SpoofCallInterface } from 'interfaces/spoof-call';
import { ClientInterface } from 'interfaces/client';
import { GetQueryInterface } from 'interfaces';

export interface PhoneNumberInterface {
  id?: string;
  number: string;
  client_id: string;
  created_at?: any;
  updated_at?: any;
  spoof_call?: SpoofCallInterface[];
  client?: ClientInterface;
  _count?: {
    spoof_call?: number;
  };
}

export interface PhoneNumberGetQueryInterface extends GetQueryInterface {
  id?: string;
  number?: string;
  client_id?: string;
}
