import { Nomination } from "shared";

export type AddNominationData = {
    pollID: string;
    nominationID: string;
    nomination: Nomination;
}