import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { IORedisKey } from "src/redis/redis.module";
import { CreatePollData } from "src/types/repository-types/create-poll.type";
import { Poll, Results } from 'shared'
import { AddParticipantData } from "src/types/repository-types/add-participant.type";
import { AddNominationData } from "src/types/repository-types/add-nomination.type";
import { AddParticipantRankingsData } from "src/types/repository-types/add-participantRankingsData.type";

@Injectable()
export class PollsRepository {
    private readonly ttl: string; // time-to-live
    private readonly logger = new Logger(PollsRepository.name);

    constructor(
        configService: ConfigService,
        @Inject(IORedisKey) private readonly redisClient: Redis,
    ) {
        this.ttl = configService.get('POLL_DURATION') || '7200';
    }

    async createPoll({
        votesPerVoter,
        topic,
        pollID,
        userID
    }: CreatePollData): Promise<Poll> {
        const initialPoll = {
            id: pollID,
            topic,
            votesPerVoter,
            participants: {},
            adminID: userID,
            nominations: {},
            rankings: {},
            results: [],
            hasStarted: false
        };
        this.logger.log(
            `Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL
            ${this.ttl}`
        );

        const key = `polls:${pollID}`;
        try {
            await this.redisClient.multi([
                ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
                ['expire', key, this.ttl],
            ]).exec();
            return initialPoll;
        } catch (error) {
            this.logger.error(
                `Failed to add poll ${JSON.stringify(initialPoll)}\n${error}`
            );
            throw new InternalServerErrorException();
        }
    }
    
    async getPoll(pollID: string): Promise<Poll> {
        this.logger.log(`Attempting to get poll with: ${pollID}`);
        const key = `polls:${pollID}`;

        try {
            const currentPoll = await this.redisClient.call('JSON.GET', key, '.') as string;

            this.logger.verbose(currentPoll);

            return JSON.parse(currentPoll);
        } catch (e) {
            this.logger.error(`Failed to get pollID ${pollID}: ${e.message}`);
            throw new InternalServerErrorException('Poll data is missing or corrupted');
        }
    }


    async addParticipant({
        pollID,
        userID,
        name,
    }: AddParticipantData): Promise<Poll> {
        this.logger.log(
        `Attempting to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
        );

        const key = `polls:${pollID}`;
        const participantPath = `.participants.${userID}`;

        try {
            await this.redisClient.call(
                'JSON.SET',
                key,
                participantPath,
                JSON.stringify(name),
            );

            return this.getPoll(pollID);
        } catch (e) {
            this.logger.error(
                `Failed to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
            );
            throw new InternalServerErrorException('Failed to add participant');
        }
    }

    async removeParticipant(pollID: string, userID: string): Promise<Poll> {
        this.logger.log(`removing userID ${userID} from poll ${pollID}`);

        const key = `polls:${pollID}`;
        const participantPath = `.participants.${userID}`;

        try {
            await this.redisClient.call('JSON.DEL', key, participantPath);

            return this.getPoll(pollID);
        } catch (error) {
            this.logger.log(`Failed to remove userID: ${userID} from poll ${pollID}`, error);
            throw new InternalServerErrorException('Failed to remove participant');
        }
    }
    async addNomination({
        pollID,
        nominationID,
        nomination
    }: AddNominationData): Promise<Poll> {
        this.logger.log(
            `Attempting to add a nomination with nominationID ${nominationID} 
                and nomination ${nomination} to the pollID ${pollID}`
        );

        const key = `polls:${pollID}`;
        const nominationPath = `.nominations.${nominationID}`;

        try {
            await this.redisClient.call(
                'JSON.SET',
                key,
                nominationPath,
                JSON.stringify(nomination)
            );
            return this.getPoll(pollID);
        } catch (error) {
            this.logger.error(
                `Failed to add a nomination with nominationID/text: ${nominationID}/
                    ${nomination.text} to pollID ${pollID}`
            );
            throw new InternalServerErrorException(
                `Failed to add a nomination with nominationID/text: ${nominationID}/
                    ${nomination.text} to pollID ${pollID}`
            );
        }
    }
    async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
        this.logger.log(
            `removing nominationID ${nominationID} from poll ${pollID}`
        );
        const key = `polls:${pollID}`;
        const nominationPath = `.nominations.${nominationID}`;

        try {
            await this.redisClient.call('JSON.DEL', key, nominationPath);

            return this.getPoll(pollID);
        } catch (error) {
            this.logger.error(
                `Failed to remove a nomination with nominationID ${nominationID}
                    from pollID ${pollID}`
            );
            throw new InternalServerErrorException(
                `Failed to remove a nomination with nominationID ${nominationID}
                    from pollID ${pollID}`
            );
        }
    }
    async startPoll(pollID: string): Promise<Poll> {
        this.logger.log(`setting hasStarted for poll ${pollID}`);
        const key = `polls:${pollID}`;

        try {
            await this.redisClient.call(
                'JSON.SET',
                key,
                '.hasStarted',
                JSON.stringify(true)  
            );
            return this.getPoll(pollID);
        } catch (error) {
            this.logger.error(
                `Failed set hasStarted for poll ${pollID}`
            );
            throw new InternalServerErrorException(
                `There was an error starting the poll'`
            );
        }
    }
    async addParticipantRankings({
        pollID,
        userID,
        rankings
    }: AddParticipantRankingsData): Promise<Poll> {
        this.logger.log(
            `Attempting to add rankings for userID/ ${userID} to pollID: ${pollID}`, rankings
        );
        const key = `polls:${pollID}`;

        const rankingsPath = `.rankings.${userID}`;
        try {
            await this.redisClient.call(
                'JSON.SET',
                key,
                rankingsPath,
                JSON.stringify(rankings)
            );

            return this.getPoll(pollID);
        } catch (error) {
            this.logger.error(
                `Failed to add rankings for userID ${userID} to pollID ${pollID}`
            );
            throw new InternalServerErrorException(
                `There was an error adding rankings for userID ${userID} for pollID ${pollID}`
            );
            
        }
    }

    async addResults(pollID: string, results: Results): Promise<Poll> {
    this.logger.log(
      `Attempting to add results to pollID: ${pollID}`,
      JSON.stringify(results),
    );

    const key = `polls:${pollID}`;
    const resultsPath = `.results`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        resultsPath,
        JSON.stringify(results),
      );

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(
        `Failed to add add results for pollID: ${pollID}`,
        results,
        e,
      );
      throw new InternalServerErrorException(
        `Failed to add add results for pollID: ${pollID}`,
      );
    }
  }

  async deletePoll(pollID: string): Promise<void> {
    const key = `polls:${pollID}`;

    this.logger.log(`deleting poll: ${pollID}`);

    try {
      await this.redisClient.call('JSON.DEL', key);
    } catch (e) {
      this.logger.error(`Failed to delete poll: ${pollID}`, e);
      throw new InternalServerErrorException(
        `Failed to delete poll: ${pollID}`,
      );
    }
  }
}