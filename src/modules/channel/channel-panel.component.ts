import { Component } from '@agros/core';
import ChannelPanel from '@modules/channel/ChannelPanel';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { LocaleService } from '@modules/locale/locale.service';

@Component({
    factory: () => ChannelPanel,
    declarations: [
        LoadingComponent,
        ExceptionComponent,
        LocaleService,
    ],
})
export class ChannelPanelComponent {}
