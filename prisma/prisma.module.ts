// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Torna o Prisma disponível na aplicação toda sem precisar ficar importando toda hora
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <-- Isso expõe o serviço para fora deste módulo
})
export class PrismaModule {}
