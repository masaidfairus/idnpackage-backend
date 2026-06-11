import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PackagesModule } from './packages/packages.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PackagesModule,
    UsersModule,
    RoomsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
