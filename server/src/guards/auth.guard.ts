import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);
    constructor(private readonly jwtService: JwtService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        this.logger.debug(`Checking for auth token on request body`, request.Body);
        const {accessToken} = request.body;
        try {
            const payload = this.jwtService.verify(accessToken);
            request.userID = payload.sub;
            request.pollID = payload.pollID;
            request.name = payload.name;
            return true;
        } catch (error) {
            throw new ForbiddenException('Invalid authorization token');      
        } 
    }
}