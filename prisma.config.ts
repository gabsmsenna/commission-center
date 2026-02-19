import { config } from 'dotenv';

config();

if (!process.env.DIRECT_URL) {
  throw new Error('DIRECT_URL não está definida no arquivo .env');
}

export default {
  datasource: {
    url: process.env.DIRECT_URL,
  },
};
