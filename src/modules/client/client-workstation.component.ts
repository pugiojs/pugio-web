import { Component } from 'khamsa';
import { lazy } from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { TabComponent } from '@modules/tab/tab.component';
import { StoreService } from '@modules/store/store.service';
import { ChannelPanelComponent } from '@modules/channel/channel-panel.component';
import { ClientService } from '@modules/client/client.service';
import { ChannelService } from '@modules/channel/channel.service';
import { UtilsService } from '@modules/utils/utils.service';
import { ExceptionComponent } from '@modules/brand/exception.component';

@Component({
    component: lazy(() => import('@modules/client/ClientWorkstation')),
    declarations: [
        TabComponent,
        ChannelPanelComponent,
        LocaleService,
        StoreService,
        ClientService,
        ChannelService,
        UtilsService,
        ExceptionComponent,
    ],
})
export class ClientWorkstationComponent {}
