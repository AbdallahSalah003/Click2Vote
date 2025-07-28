import { ArgumentsHost, ExceptionFilter, Catch, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { SocketWithAuth } from "src/types/auth-payload.type";
import { WsBadRequestException, WsTypeException, WsUnauthorizedException, WsUnknownException } from "./ws-exceptions";
import { WsEmit } from "src/enums/socket.enum";

@Catch()
export class WsCatchEverythingFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const socket: SocketWithAuth = host.switchToWs().getClient();

        if(exception instanceof BadRequestException) {
            const exceptionData = exception.getResponse();
            const exceptionMessage = exceptionData['message'] ?? exceptionData ?? 'Bad Request';
            const wsException = new WsBadRequestException(exceptionMessage);
            socket.emit(WsEmit.WS_EXCEPTION, wsException.getError());
            return;
        }
        if(exception instanceof UnauthorizedException) {
            const exceptionData = exception.getResponse();
            const exceptionMessage = exceptionData['message'] ?? exceptionData ?? 'Unauthorized';
            const wsException = new WsUnauthorizedException(exceptionMessage);
            socket.emit(WsEmit.WS_EXCEPTION, wsException.getError());
            return;
        }

        if(exception instanceof WsTypeException) {
            socket.emit(WsEmit.WS_EXCEPTION, exception.getError());
            return;
        }
        const wsException = new WsUnknownException(exception.message);
        socket.emit(WsEmit.WS_EXCEPTION, wsException.getError());

    }
    
}