import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RepositoriesModule } from './modules/repositories/repositories.module';
import { BranchesModule } from './modules/branches/branches.module';
import { CommitsModule } from './modules/commits/commits.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RepositoriesModule,
    BranchesModule,
    CommitsModule
  ],
})
export class AppModule { }
