import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for all origins
    app.enableCors({
        origin: true, // Allow all origins
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
            'Origin',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers'
        ],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204
    });

    // Enable validation pipes
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Backend server running on port ${port}`);
}

bootstrap(); 