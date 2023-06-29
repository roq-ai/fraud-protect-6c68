import { PhoneNumberInterface } from 'interfaces/phone-number';
import { SpoofCallInterface } from 'interfaces/spoof-call';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ClientInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  phone_number?: PhoneNumberInterface[];
  spoof_call?: SpoofCallInterface[];
  user?: UserInterface;
  _count?: {
    phone_number?: number;
    spoof_call?: number;
  };
}

export interface ClientGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
