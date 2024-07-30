import { IMessage, IUpdate } from './telegramTypes';

interface IRequestParams {
  endpoint: string;
  method: 'GET' | 'POST';
  query?: { [key: string]: string | number };
  body?: { [key: string]: string | number | boolean };
}

class Bot {
  private tgapi: string = 'https://api.telegram.org/bot';
  private api: string;

  constructor(token: string) {
    this.api = this.tgapi + token;
  }

  private async request<T>({
    endpoint,
    method = 'GET',
    query,
    body = {},
  }: IRequestParams): Promise<T> {
    const url = new URL(this.api + endpoint);

    if (query) {
      Object.entries(query).forEach(([k, v]) =>
        url.searchParams.set(k, String(v))
      );
    }

    return fetch(url, {
      method,
      body: method === 'POST' ? JSON.stringify(body) : undefined,
    })
      .then((res) => res.json())
      .then((res: { result: T }) => res.result);
  }

  async handleUpdate(update: IUpdate) {
    const chatId = update.message.chat.id;

    try {
      const text = update.message.text;
      // Some event emitter, or simpel regexps here
      // console.log(update.message?.entities);

      await this.sendMessage(chatId, 'Done');
      console.log('Request processed', chatId, text);
    } catch (e) {
      await this.sendMessage(chatId, `Fail: ${e}`);
    }
  }

  async sendMessage(chatId: number, text: string) {
    const res = await this.request<IMessage>({
      endpoint: '/sendMessage',
      method: 'GET',
      query: { chat_id: chatId, text },
    });
    console.log('Message sent', res);
  }
}

export default Bot;
