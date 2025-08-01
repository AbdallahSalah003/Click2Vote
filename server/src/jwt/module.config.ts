import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'

export const jwtModule = JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
            expiresIn: parseInt(configService.get<string>('POLL_DURATION') || '7200')
        },
    }),
    inject: [ConfigService],
});