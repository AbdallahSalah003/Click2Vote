import { Logger } from '@nestjs/common'
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { PollsService } from './polls.service'
import { Socket, Namespace } from 'socket.io';

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
    handleConnection(client: Socket) {
        const sockets = this.io.sockets;

        this.logger.log(`WS Client with id: ${client.id} connected`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);

        this.io.emit('hello', `from client: ${client.id} after he connected`);
    }
    handleDisconnect(client: Socket) {
        const sockets = this.io.sockets;

        this.logger.log(`WS Client with id: ${client.id} disconnected`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);

        // TODO: remove client from poll and send 'participants_updated' event to 
        // remaining clients
    }
    
}