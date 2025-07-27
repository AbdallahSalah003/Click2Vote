import { Injectable, Logger } from "@nestjs/common";
import { createPollId, createUserID } from "src/generate-ids";
import { CreatePollFields } from "src/types/servcie-types/create-poll.type";
import { JoinPollFields } from "src/types/servcie-types/join-poll.type";
import { RejoinPollFields } from "src/types/servcie-types/rejoin-poll.type";
import { PollsRepository } from './polls.repository';

@Injectable()
export class PollsService {
    constructor(private readonly pollsRepository: PollsRepository) {}
    private readonly logger = new Logger(PollsService.name);

    async createPoll(fields: CreatePollFields) {
        const pollID = createPollId();
        const userID = createUserID();

        const createdPoll = await this.pollsRepository.createPoll({
            ...fields,
            pollID,
            userID
        });
        // TODO: create an access token based off of pollID and UserID
        return {
            poll: createdPoll
            // accessToken
        };
    }
    async joinPoll(fields: JoinPollFields) {
        const userID = createUserID();
        this.logger.debug(
            `Fetching poll with ID: ${fields.pollID} for user with ID ${userID}`
        );
        const joinedPoll = await this.pollsRepository.getPoll(fields.pollID);
        // TODO: create access Token

        return {
            poll: joinedPoll, 
            // access Token
        };
    }
    async rejoinPoll(fields: RejoinPollFields) {
        this.logger.debug(
            `Rejoining poll with ID: ${fields.pollID} for user with ID: ${fields}
            with name: ${fields.name}`
        );

        const joinedPoll = await this.pollsRepository.addParticipant(fields);

        return joinedPoll;
    }
}