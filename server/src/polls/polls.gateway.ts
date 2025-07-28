import { Logger, UnauthorizedException, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets'
import { PollsService } from './polls.service'
import { Namespace } from 'socket.io';
import { SocketWithAuth } from 'src/types/auth-payload.type';
import { WsCatchEverythingFilter } from 'src/exceptions/catch-all-filter';
import { GatewayAdminGuard } from 'src/guards/admin-gateway.guard';
import { WsEmit, WsMsg } from 'src/enums/socket.enum';
import { NominationDto } from 'src/dtos/nomination.dto';

@UsePipes(new ValidationPipe())
@UseFilters(new WsCatchEverythingFilter())
@WebSocketGateway({
    namespace: 'polls',
})
export class PollsGateway 
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect 
{
    private readonly logger = new Logger(PollsGateway.name);
    constructor(private readonly pollsService: PollsService) {}

    @WebSocketServer() io: Namespace;

    afterInit(server: any): void {
        this.logger.log('Websocket Gateway initialized.')
    }
    async handleConnection(client: SocketWithAuth) {
        const sockets = this.io.sockets;

        const roomName = client.pollID;
        await client.join(roomName);
        const connectedClients = this.io.adapter.rooms?.get(roomName)?.size ?? 0;
        this.logger.debug(
            `userID ${client.userID} joined romm with name ${roomName}`
        );
        this.logger.debug(
            `Total clients connect to room ${roomName}: ${connectedClients}`
        );
        const updatedPoll = await this.pollsService.addParticipants({
            pollID: client.pollID,
            userID: client.userID,
            name: client.name
        });
        
        this.io.to(roomName).emit(WsEmit.WS_POLL_UPDATED, updatedPoll);
    }
    async handleDisconnect(client: SocketWithAuth) {
        const sockets = this.io.sockets;
        const updatedPoll = await this.pollsService.removeParticipant(
            client.pollID,
            client.userID
        );
        const roomName = client.pollID;
        const clientCount = this.io.adapter.rooms?.get(roomName)?.size ?? 0;
        this.logger.log(`Disconnected socket id: ${client.id}`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);
        this.logger.debug(
            `Total clients connected to room ${roomName}: ${clientCount}`
        );
        if(updatedPoll) {
            this.io.to(roomName).emit(WsEmit.WS_POLL_UPDATED, updatedPoll);
        }

    }

    @UseGuards(GatewayAdminGuard)
    @SubscribeMessage(WsMsg.WS_REMOVE_PARTICIPANT)
    async removeParticipant(
        @MessageBody('id') id: string,
        @ConnectedSocket() client: SocketWithAuth
    ) {
        this.logger.debug(`
            Attempting to remove participant ${id} from poll ${client.pollID}
        `);

        const updatedPoll = await this.pollsService.removeParticipant(
            client.pollID,
            id,
        );
        if(updatedPoll) {
            this.io.to(client.pollID).emit(WsEmit.WS_POLL_UPDATED, updatedPoll);
        }
    }

    @SubscribeMessage(WsMsg.WS_NOMINATE)
    async nominate(
        @MessageBody() nomination: NominationDto,
        @ConnectedSocket() client: SocketWithAuth
    ): Promise<void> {
        this.logger.debug(
            `Attempting to add nomination for user ${client.userID} to poll ${client.pollID}\n${nomination.text}`
        );

        const updatedPoll = await this.pollsService.addNomination({
            pollID: client.pollID,
            userID: client.userID,
            text: nomination.text
        });

        this.io.to(client.pollID).emit(WsEmit.WS_POLL_UPDATED, updatedPoll);
    }
    
    @UseGuards(GatewayAdminGuard)
    @SubscribeMessage(WsMsg.WS_REMOVE_NOMINATION) 
    async removeNomination(
        @MessageBody('id') nominationID: string,
        @ConnectedSocket() client: SocketWithAuth
    ): Promise<void> {
        this.logger.debug(
            `Attempting to remove nomination ${nominationID} from poll ${client.pollID}`
        );

        const updatedPoll = await this.pollsService.removeNomination(
            client.pollID,
            nominationID
        );

        this.io.to(client.pollID).emit(WsEmit.WS_POLL_UPDATED, updatedPoll);
    }

    @UseGuards(GatewayAdminGuard)
    @SubscribeMessage(WsMsg.WS_START_VOTE)
    async startVote(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
        this.logger.debug(`Attempting to start voting for poll: ${client.pollID}`);

        const updatedPoll = await this.pollsService.startPoll(client.pollID);

        this.io.to(client.pollID).emit(WsEmit.WS_POLL_UPDATED, updatedPoll);
    }

    @SubscribeMessage(WsMsg.WS_SUBMIT_RANKINGS) 
    async submitRankings(
        @MessageBody('rankings') rankings: string[],
        @ConnectedSocket() client: SocketWithAuth
    ): Promise<void> {
        this.logger.log(
            `Submitting votes for userID's ${client.userID} rankings for pollID ${client.pollID}`, rankings
        );
        const updatedPoll = await this.pollsService.submitRankings({
            pollID: client.pollID,
            userID: client.userID,
            rankings
        });

        this.io.to(client.pollID).emit(WsEmit.WS_POLL_UPDATED, updatedPoll);
    }

    @UseGuards(GatewayAdminGuard)
    @SubscribeMessage(WsMsg.WS_CLOSE_POLL) 
    async closePoll(
        @ConnectedSocket() client: SocketWithAuth
    ): Promise<void> {
        this.logger.log(
            `Closing poll ${client.pollID} and computing results`
        );
        const updatedPoll = await this.pollsService.computeResults(client.pollID);

        this.io.to(client.pollID).emit(WsEmit.WS_POLL_UPDATED, updatedPoll);
    }

    @UseGuards(GatewayAdminGuard)
    @SubscribeMessage(WsMsg.WS_CANCEL_POLL) 
    async cancelPoll(
        @ConnectedSocket() client: SocketWithAuth
    ): Promise<void> {
        this.logger.log(
            `Canceling poll ${client.pollID}`
        );
        await this.pollsService.cancelPoll(client.pollID);

        this.io.to(client.pollID).emit(WsEmit.WS_POLL_CANCELED);
    }

}