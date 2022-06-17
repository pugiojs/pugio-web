import {
    Global,
    Module,
} from '@agros/core';
import { ConfigService } from '@modules/config/config.service';

@Global()
@Module({
    providers: [
        ConfigService,
    ],
    exports: [
        ConfigService,
    ],
})
export class ConfigModule {}
