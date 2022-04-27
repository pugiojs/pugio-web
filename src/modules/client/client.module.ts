import { Module } from 'khamsa';
import { ClientDashboardComponent } from '@modules/client/client-dashboard.component';
import { ClientMenuItemComponent } from '@modules/client/client-menu-item.component';
import { ClientWorkstationComponent } from '@modules/client/client-workstation.component';
import { ClientService } from '@modules/client/client.service';
import { ChannelListComponent } from '@modules/client/channel-list.component';

const TabModule = import('@modules/tab/tab.module').then(({ TabModule }) => TabModule);
const StoreModule = import('@modules/store/store.module').then(({ StoreModule }) => StoreModule);
const ChannelModule = import('@modules/channel/channel.module').then(({ ChannelModule }) => ChannelModule);

@Module({
    imports: [
        TabModule,
        StoreModule,
        ChannelModule,
    ],
    providers: [
        ClientService,
    ],
    components: [
        ClientDashboardComponent,
        ClientMenuItemComponent,
        ClientWorkstationComponent,
        ChannelListComponent,
    ],
    routes: [
        {
            path: ':client_id',
            useComponentClass: ClientDashboardComponent,
            children: [
                {
                    path: 'workstation',
                    useComponentClass: ClientWorkstationComponent,
                },
            ],
        },
    ],
})
export class ClientModule {}
