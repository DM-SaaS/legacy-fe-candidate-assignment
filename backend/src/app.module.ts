import { Module } from '@nestjs/common';
import { SignatureModule } from './signature/signature.module';

@Module({
    imports: [SignatureModule],
    controllers: [],
    providers: [],
})
export class AppModule { } 