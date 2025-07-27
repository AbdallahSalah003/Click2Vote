import { Injectable } from "@nestjs/common";
import { createPollId, createUserID } from "src/generate-ids";
import { CreatePollFields } from "src/types/create-poll.type";
import { JoinPollFields } from "src/types/join-poll.type";
import { RejoinPollFields } from "src/types/rejoin-poll.type";

@Injectable()
export class PollsService {
    async createPoll(fields: CreatePollFields) {
        const pollID = createPollId();
        const userID = createUserID();

        return {
            ...fields,
            userID,
            pollID
        };
    }
    async joinPoll(fields: JoinPollFields) {
        const userID = createUserID();

        return {
            ...fields,
            userID
        };
    }
    async rejoinPoll(fields: RejoinPollFields) {
        return fields;
    }
}