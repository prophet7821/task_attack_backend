import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication, VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule, {
    rawBody: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(3030);
}
bootstrap();
