import { ConfigService } from "@nestjs/config";

export const getSessionKey = (id: string, configService: ConfigService) => {
    const SESSION_FOLDER = configService.getOrThrow<string>("SESSION_FOLDER");

    return `${SESSION_FOLDER}${id}`
}