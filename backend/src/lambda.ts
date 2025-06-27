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

    // Enable CORS for frontend integration
    app.enableCors({
        origin: ['http://localhost:3000', "http://localhost:3003", "https://main.d3ckkrk4814k3p.amplifyapp.com"],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
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