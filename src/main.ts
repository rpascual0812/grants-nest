require('dotenv').config({ path: `../${process.env.NODE_ENV}.env` });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    const PORT = process.env.PORT || 3000;
    await app.listen(PORT, () => {
        console.log(`Running on port ${PORT}`);
    });
}
bootstrap();
