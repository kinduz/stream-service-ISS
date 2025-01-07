import { IsPasswordMatchingConstraint } from "@/src/shared/decorators/is-password-matching-constraint.decorator";
import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsUUID, MinLength, Validate } from "class-validator";

@InputType()
export class NewPasswordInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Validate(IsPasswordMatchingConstraint)
    passwordRepeat: string;

    @Field()
    @IsUUID('4')
    @IsString()
    @IsNotEmpty()
    token: string;
}