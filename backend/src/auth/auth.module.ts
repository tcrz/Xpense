import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';

const JWT_SECRET = 'your-secret-key'; // Consider moving this to environment variables

@Module({
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    })
  ],
})
export class AuthModule {}
