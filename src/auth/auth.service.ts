// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserResponse, UsersService } from '../users/users.service'; // Importe a interface que criamos
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<UserResponse> {
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (userExists) {
      throw new ConflictException('Email ou username já estão em uso.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });

    const refreshToken = crypto.randomUUID();
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        refreshExpiresAt,
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        refreshToken,
        refreshExpiresAt: { gte: new Date() },
        deletedAt: null,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });
    const newRefreshToken = crypto.randomUUID();
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: newRefreshToken,
        refreshExpiresAt,
      },
    });

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
        refreshExpiresAt: null,
      },
    });

    return { success: true };
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }
}
