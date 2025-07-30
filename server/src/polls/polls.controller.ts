import { Body, Controller, Post, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { JoinPollDto } from "src/dtos/join-polls.dto";
import { CreatePollDto } from "src/dtos/polls.dto";
import { PollsService } from "./polls.service";
import { AuthGuard } from "src/guards/auth.guard";
import { RequestWithAuth } from "../types/auth-payload.type"
import { SetAccessTokenInterceptor } from "src/interceptors/auth.interceptor";

@Controller('polls')
@UsePipes(ValidationPipe)
@UseInterceptors(SetAccessTokenInterceptor)
export class PollsController {
    constructor(private readonly pollsService: PollsService) {}
    @Post()
    async create(@Body() createPollDto: CreatePollDto) {
        return await this.pollsService.createPoll(createPollDto);
    }

    @Post('/join')
    async join(@Body() joinPollDto: JoinPollDto) {
        return await this.pollsService.joinPoll(joinPollDto);
    }
    @UseGuards(AuthGuard)
    @Post('/rejoin')
    async rejoin(@Req() request: RequestWithAuth) {
        const {userID, pollID, name } = request;
        return await this.pollsService.rejoinPoll({
            name,
            pollID,
            userID,
        });
    }
}