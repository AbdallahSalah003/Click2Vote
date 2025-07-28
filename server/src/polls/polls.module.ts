import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PollsController } from "./polls.controller";
import { PollsService } from "./polls.service";
import { redisModule } from "src/redis/redis.config";
import { PollsRepository } from "./polls.repository";
import { jwtModule } from "src/jwt/module.config";
import { PollsGateway } from "./polls.gateway";


@Module({
    imports: [ConfigModule.forRoot(), redisModule, jwtModule],
    controllers: [PollsController],
    providers: [PollsService, PollsRepository, PollsGateway]
})
export class PollsModule {}