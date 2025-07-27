import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { JoinPollDto } from "src/dtos/join-polls.dto";
import { CreatePollDto } from "src/dtos/polls.dto";
import { PollsService } from "./polls.service";

@Controller('polls')
@UsePipes(ValidationPipe)
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
    @Post('/rejoin')
    async region() {
        return await this.pollsService.rejoinPoll({
            name: "from token",
            pollID: 'Also from token',
            userID: 'Guess where this comes from?',
        });
    }
}