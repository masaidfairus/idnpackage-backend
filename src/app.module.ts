import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PackagesModule } from './packages/packages.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PackagesModule,
    UsersModule,
    RoomsModule,
    AuthModule,
    StudentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
