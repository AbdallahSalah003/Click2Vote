import { Length, IsInt, IsString, Min, Max } from 'class-validator'


export class CreatePollDto {
    @IsString()
    @Length(1, 100)
    topic: string;
    
    @IsInt()
    @Min(1)
    @Max(5)
    votesPerVoter: number;

    @IsString()
    @Length(1, 25)
    name: string;
}