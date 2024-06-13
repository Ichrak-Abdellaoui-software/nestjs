import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { globalVariables } from './common/global.variables';
import {
  ValidationException,
  ValidationFilter,
} from './common/utils/filter.validation';
import { ValidationError } from 'class-validator';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.setGlobalPrefix(globalVariables.api.globalPrefix); // set global prefix for all routes
  app.enableCors({
    origin: '*',
  });
  //app.useGlobalPipes(new ValidationPipe()); //from documentation (validation): plus besoin:erreur pas suffisamment spécifique
  //integrer le filter.validation:(utilité :erreur suit une structure de réponse cohérente et personnalisée que API renverra au client:correspond mieux aux besoins de front/consommateurs d'API)
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const errMsg = {};
        errors.forEach((err) => {
          errMsg[err.property] = [...Object.values(err.constraints)];
        });
        return new ValidationException(errMsg);
      },
    }),
  );

  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
