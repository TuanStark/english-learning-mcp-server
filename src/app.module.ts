import { AppController } from './app.controller';
import { ConfigModule } from './common/config/config.module';
import { AppLogger } from './logger.service';
import { LoggingInterceptor } from './logging.interceptor';
import { AppService } from './app.service';
import { McpModule } from '@rekog/mcp-nest';
import { EnglishLearningTool } from './mcp/english-learning.tool';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    PrismaModule,
    McpModule.forRoot({
      name: 'english-learning-mcp-server',
      version: '1.0.0',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    AppService,
    EnglishLearningTool,
  ],
})
export class AppModule {}
