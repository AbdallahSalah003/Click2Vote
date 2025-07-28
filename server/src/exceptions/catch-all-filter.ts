import { ArgumentsHost, ExceptionFilter, Catch, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { SocketWithAuth } from "src/types/auth-payload.type";
import { WsBadRequestException, WsUnauthorizedException, WsUnknownException } from "./ws-exceptions";

@Catch()
export class WsCatchEverythingFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const socket: SocketWithAuth = host.switchToWs().getClient();

        if(exception instanceof BadRequestException) {
            const exceptionData = exception.getResponse();
            const exceptionMessage = exceptionData['message'] ?? exceptionData ?? 'Bad Request';
            const wsException = new WsBadRequestException(exceptionMessage);
            socket.emit('exception', wsException.getError());
            return;
        }
        if(exception instanceof UnauthorizedException) {
            const exceptionData = exception.getResponse();
            const exceptionMessage = exceptionData['message'] ?? exceptionData ?? 'Unauthorized';
            const wsException = new WsUnauthorizedException(exceptionMessage);
            socket.emit('exception', wsException.getError());
            return;
        }
        const wsException = new WsUnknownException(exception.message);
        socket.emit('exception', wsException.getError());

    }
    
}