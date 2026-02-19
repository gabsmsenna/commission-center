/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    console.log(
      'Initializing PrismaService with connection string:',
      process.env.DIRECT_URL,
    );
    const pool = new Pool({
      connectionString: process.env.DIRECT_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    // Passa o pool para o adaptador do Prisma
    const adapter = new PrismaPg(pool);

    // Inicializa o PrismaClient com o adaptador
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
