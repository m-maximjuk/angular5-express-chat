import { User } from './user';

export interface Message {
  _id?: string,
  author?: {
    _id: string,
    username: string
  };
  body?: any,
  createdAt?: any;
}
