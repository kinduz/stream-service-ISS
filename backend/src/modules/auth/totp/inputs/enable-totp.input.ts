import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Length } from "class-validator";

@InputType()
export class EnableTotpInput {
    @Field()
    @IsNotEmpty()
    @IsString()    
    secret: string;

    
    @Field()
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    pin: string;
}