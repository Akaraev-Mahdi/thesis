import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY_FOR_DIPLOMA',
      signOptions: { expiresIn: '24h' }, // Токен живет сутки
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule], // Экспортируем JwtModule для работы RolesGuard
})
export class AuthModule {}
