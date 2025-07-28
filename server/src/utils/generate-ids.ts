import {customAlphabet, nanoid } from 'nanoid'

export const createPollId = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTVWUXYZ',
    6,
);

export const createUserID = () => nanoid();
export const createNominationID = () => nanoid(8);