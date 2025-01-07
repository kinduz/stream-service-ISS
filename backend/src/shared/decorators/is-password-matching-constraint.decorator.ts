import { NewPasswordInput } from "@/src/modules/auth/password-recovery/inputs/new-password.input";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({name: "IsPasswordMatching", async: false})
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
    public validate(passwordRepeat: string, args?: ValidationArguments): Promise<boolean> | boolean {
        const obj = args.object as NewPasswordInput;

        return obj.password === passwordRepeat;
    }

    defaultMessage(args?: ValidationArguments): string {
        return 'Пароли не совпадают';
    }
}