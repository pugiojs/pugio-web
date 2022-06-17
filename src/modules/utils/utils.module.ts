import {
    Global,
    Module,
} from '@agros/core';
import { UtilsService } from '@modules/utils/utils.service';

@Global()
@Module({
    providers: [
        UtilsService,
    ],
    exports: [
        UtilsService,
    ],
})
export class UtilsModule {}
