import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './interface/filters/AllExceptionsFilter';
import { HttpExceptionFilter } from './interface/filters/HttpExceptionFilter';
import * as project from 'package.json'
import { json } from 'express';

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule,{logger:false});
  app.use(json({ limit: '3mb' }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  
  let port = 3000;
  await app.listen(port);
  console.info(`Servicio ${project.name} escuchando en el puerto: ${port}`);
  
}
bootstrap();
