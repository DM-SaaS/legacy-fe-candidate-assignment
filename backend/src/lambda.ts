import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import { Server } from 'http';
import express from 'express';
import { AppModule } from './app.module';

let cachedServer: Server;

async function createExpressApp(): Promise<express.Application> {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);

    const app = await NestFactory.create(AppModule, adapter);

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

    await app.init();
    return expressApp;
}

export const handler = async (
    event: APIGatewayProxyEvent,
    context: Context,
): Promise<APIGatewayProxyResult> => {
    if (!cachedServer) {
        const expressApp = await createExpressApp();
        cachedServer = createServer(expressApp);
    }

    return proxy(cachedServer, event, context, 'PROMISE').promise;
}; 