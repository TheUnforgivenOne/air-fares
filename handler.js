class Bot {
  tgapi = 'https://api.telegram.org/bot';

  constructor({ token }) {
    this.api = this.tgapi + token;
  }

  async request({ endpoint, method = 'GET', query, body = {} }) {
    const url = new URL(this.api + endpoint);

    if (query) {
      Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    return fetch(url, {
      method,
      body: method === 'POST' ? JSON.stringify(body) : undefined,
    }).then((res) => res.json());
  }

  async handleUpdate(update) {
    const res = await this.request({
      endpoint: '/sendMessage',
      method: 'GET',
      query: { chat_id: update.message.chat.id, text: update.message.text },
    });
    console.log('Request processed', res);
  }
}

exports.handleRequest = async (event) => {
  const parsedUpdate = JSON.parse(event.body);
  console.log(parsedUpdate);

  const bot = new Bot({ token: process.env.BOT_TOKEN });
  await bot.handleUpdate(parsedUpdate);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Update processed' }),
  };
};
