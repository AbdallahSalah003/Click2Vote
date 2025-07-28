import { Logger, UnauthorizedException, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets'
import { PollsService } from './polls.service'
import { Namespace } from 'socket.io';
import { SocketWithAuth } from 'src/types/auth-payload.type';
import { WsCatchEverythingFilter } from 'src/exceptions/catch-all-filter';

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
        
        this.io.to(roomName).emit('poll_updated', updatedPoll);
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
            this.io.to(roomName).emit('poll_updated', updatedPoll);
        }

    }

    @SubscribeMessage('test')
    async test() {
        throw new UnauthorizedException({field: 'field', message: 'You screwed up'});
    }
    
}