import Bot from './src/bot/Bot';
import { Handler, APIGatewayProxyEventV2 } from 'aws-lambda';

const generateResponse = (
  statusCode: number,
  message: string
): {
  statusCode: number;
  body: string;
} => ({
  statusCode,
  body: JSON.stringify({ message }),
});

export const handleRequest: Handler<APIGatewayProxyEventV2> = async (event) => {
  const rawBody = event.body;
  if (!rawBody) {
    console.log('Fail: Telegram sent empty update');
    return generateResponse(500, 'Telegram sent empty update');
  }

  const parsedUpdate = JSON.parse(rawBody);
  console.log(parsedUpdate);

  const token = process.env.BOT_TOKEN ?? '';
  if (!token) {
    console.log('Fail: Telegram bot token was not provided');
    return generateResponse(500, 'Telegram bot token was not provided');
  }

  const bot = new Bot(token);
  await bot.handleUpdate(parsedUpdate);

  return generateResponse(200, 'Update processed');
};
