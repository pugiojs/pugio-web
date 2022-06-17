import {
    Global,
    Module,
} from '@agros/core';
import { RequestService } from '@modules/request/request.service';

@Global()
@Module({
    providers: [
        RequestService,
    ],
    exports: [
        RequestService,
    ],
})
export class RequestModule {}
