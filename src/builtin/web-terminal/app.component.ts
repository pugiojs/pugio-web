import {
    lazy,
    Component,
} from '@agros/core';
import { AppService } from '@builtin:web-terminal/app.service';
import { LoadingComponent } from '@modules/brand/loading.component';

@Component({
    factory: (forwardRef) => {
        return lazy(() => {
            return forwardRef(import('@builtin:web-terminal/App'));
        });
    },
    declarations: [
        AppService,
        LoadingComponent,
    ],
})
export class AppComponent {}
