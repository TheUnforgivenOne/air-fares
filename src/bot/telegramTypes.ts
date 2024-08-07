export interface IUpdate {
  update_id: number;
  message: IMessage;
}

export interface IMessage {
  message_id: number;
  from: IUser;
  chat: IChat;
  date: number;
  text: string;
  entities: IMessageEntity[];
}

export interface IUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
}

export interface IChat {
  id: number;
  first_name: string;
  username: string;
}

export interface IMessageEntity {
  type: string;
  offset: number;
  length: number;
}
