import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { JoinPollDto } from "src/dtos/join-polls.dto";
import { CreatePollDto } from "src/dtos/polls.dto";

@Controller('polls')
@UsePipes(ValidationPipe)
export class PollsController {
    @Post()
    async create(@Body() createPollDto: CreatePollDto) {
        console.log("creating poll...");
        return createPollDto;
    }

    @Post('/join')
    async join(@Body() joinPollDto: JoinPollDto) {
        console.log("joining poll ...");
        return joinPollDto;
    }
    @Post('/rejoin')
    async region() {
        console.log('rejoining poll...');
    }
}