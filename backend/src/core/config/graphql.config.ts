import { isDev } from "@/src/shared/utils/is-dev.util";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

export const getGraphQLConfig = (configService: ConfigService): ApolloDriverConfig => {
    return {
        playground: isDev(configService),
        path: configService.getOrThrow<string>("GPAPHQL_PREFIX"),
        autoSchemaFile: join(process.cwd(), "src/core/graphql/schema.gql"),
        sortSchema: true,
        context: ({req, res}) => ({req, res}),
    }
}