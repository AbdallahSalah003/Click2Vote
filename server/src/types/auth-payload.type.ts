import { Request } from '@nestjs/common' 

type AuthPayload = {
    userID: string;
    pollID: string;
    name: string;
}

export type RequestWithAuth = Request & AuthPayload;