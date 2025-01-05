import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

const USERNAME_REGEX = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;

@InputType()
export class CreateUserInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    @Matches(USERNAME_REGEX)
    username: string

    @Field()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string

}