import { createApi, IAPI } from '../requests';
import { EventEmitter } from 'events';
import { IMessage, IUpdate } from './telegramTypes';

class Bot extends EventEmitter {
  private tgapi: string = 'https://api.telegram.org/bot';
  private api: IAPI;

  constructor(token: string) {
    super();
    this.api = createApi(this.tgapi + token);
  }

  async handleUpdate(update: IUpdate) {
    const chatId = update.message.chat.id;

    try {
      const text = update.message.text;
      const entities = update.message?.entities;

      if (entities) {
        const botCommand = entities.find((e) => e.type === 'bot_command');
        if (botCommand) {
          const start = botCommand.offset;
          const end = botCommand.offset + botCommand.length;
          const command = text.substring(start, end);
          const params = text.substring(end).trim();

          await this.sendMessage(
            chatId,
            `Command ${command}. Rest params: ${params}`
          );
          return;
        }
      }

      await this.sendMessage(chatId, `Text message: ${text}`);
      console.log('Request processed', chatId, text);
    } catch (e) {
      await this.sendMessage(chatId, `Fail: ${e}`);
    }
  }

  async sendMessage(chatId: number, text: string) {
    const res = await this.api.request<IMessage>({
      endpoint: '/sendMessage',
      method: 'GET',
      query: { chat_id: chatId, text },
    });
    console.log('Message sent', res);
  }
}

export default Bot;
