import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { createPollId, createUserID } from "src/utils/generate-ids";
import { CreatePollFields } from "src/types/servcie-types/create-poll.type";
import { JoinPollFields } from "src/types/servcie-types/join-poll.type";
import { RejoinPollFields } from "src/types/servcie-types/rejoin-poll.type";
import { PollsRepository } from './polls.repository';
import { JwtService } from "@nestjs/jwt";
import { AddParticipantFields } from "src/types/servcie-types/poll-participant.type";
import { Poll } from "shared";
import { AddNominationFields } from "src/types/servcie-types/add-nomination.type";
import { createNominationID } from '../utils/generate-ids';
import { SubmitRankingsFields } from "src/types/servcie-types/submit-rankings.type";

@Injectable()
export class PollsService {
    constructor(
        private readonly pollsRepository: PollsRepository,
        private readonly jwtService: JwtService
    ) {}
    private readonly logger = new Logger(PollsService.name);

    async createPoll(fields: CreatePollFields) {
        const pollID = createPollId();
        const userID = createUserID();

        const createdPoll = await this.pollsRepository.createPoll({
            ...fields,
            pollID,
            userID
        });
        this.logger.debug(
            `Creating token string for pollID: ${createdPoll.id} and userID: ${userID}`
        );
        const signedString = this.jwtService.sign(
            {
                pollID: createdPoll.id,
                name: fields.name,
            },
            {
                subject: userID,
            }
        );
        return {
            poll: createdPoll,
            accessToken: signedString,
        };
    }
    async joinPoll(fields: JoinPollFields) {
        const userID = createUserID();
        this.logger.debug(
            `Fetching poll with ID: ${fields.pollID} for user with ID ${userID}`
        );
        const joinedPoll = await this.pollsRepository.getPoll(fields.pollID);
        this.logger.debug(
            `Creating token string for pollID: ${joinedPoll.id} and userID: ${userID}`
        );
        const signedString = this.jwtService.sign(
            {
                pollID: joinedPoll.id,
                name: fields.name,
            },
            {
                subject: userID,
            }
        );
        return {
            poll: joinedPoll,
            accessToken: signedString,
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
    async getPoll(pollID: string): Promise<Poll> {
        return this.pollsRepository.getPoll(pollID);
    }
    async addParticipants(addParticipant: AddParticipantFields): Promise<Poll> {
        return this.pollsRepository.addParticipant(addParticipant);
    }
    async removeParticipant(pollID: string, userID: string): Promise<Poll | void> {
        const poll = await this.pollsRepository.getPoll(pollID);
        if(!poll.hasStarted) {
            const updatedPoll = await this.pollsRepository.removeParticipant(
                pollID,
                userID,
            );
            return updatedPoll;
        }
    }
    async addNomination({
        pollID,
        userID,
        text
    }: AddNominationFields): Promise<Poll> {
        return this.pollsRepository.addNomination({
            pollID,
            nominationID: createNominationID(),
            nomination: {
                userID,
                text,
            }
        });
    }
    async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
        return this.pollsRepository.removeNomination(pollID, nominationID);
    }

    async startPoll(pollID: string): Promise<Poll> {
        return this.pollsRepository.startPoll(pollID);
    }

    async submitRankings(rankingsData: SubmitRankingsFields): Promise<Poll> {
        const hasPollStarted = this.pollsRepository.getPoll(rankingsData.pollID);
        if(!hasPollStarted) {
            throw new BadRequestException(
                `Participants cannot start voting until the poll has started`
            );
        }
        return this.pollsRepository.addParticipantRankings(rankingsData);
    }
}