export enum WsEmit {
    WS_POLL_UPDATED = 'poll_updated',
    WS_EXCEPTION = 'exception',
    WS_POLL_CANCELED = 'poll_cancelled'
}

export enum WsMsg {
    WS_NOMINATE = 'nominate',
    WS_REMOVE_PARTICIPANT = 'remove_participant',
    WS_REMOVE_NOMINATION = 'remove_nomination',
    WS_START_VOTE = 'start_vote',
    WS_SUBMIT_RANKINGS = 'submit_rankings',
    WS_CLOSE_POLL = 'close_poll',
    WS_CANCEL_POLL = 'cancel_poll'
}