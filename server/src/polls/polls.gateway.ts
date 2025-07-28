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
    handleConnection(client: SocketWithAuth) {
        const sockets = this.io.sockets;

        this.logger.debug(
            `Socket connected with userID: ${client.userID}, pollID: ${client.pollID}
            , and name: ${client.name}`
        );

        this.logger.log(`WS Client with id: ${client.id} connected`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);

        this.io.emit('hello', `from client: ${client.id} after he connected`);
    }
    handleDisconnect(client: SocketWithAuth) {
        const sockets = this.io.sockets;
        
        this.logger.debug(
            `Socket disconnected with userID: ${client.userID}, pollID: ${client.pollID}
            , and name: ${client.name}`
        );

        this.logger.log(`WS Client with id: ${client.id} disconnected`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);

        // TODO: remove client from poll and send 'participants_updated' event to 
        // remaining clients
    }

    @SubscribeMessage('test')
    async test() {
        throw new UnauthorizedException({field: 'field', message: 'You screwed up'});
    }
    
}