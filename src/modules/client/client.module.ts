import { Module } from 'khamsa';
import { ClientDashboardComponent } from '@modules/client/client-dashboard.component';
import { ClientMenuItemComponent } from '@modules/client/client-menu-item.component';
import { ClientWorkstationComponent } from '@modules/client/client-workstation.component';

const TabModule = import('@modules/tab/tab.module').then(({ TabModule }) => TabModule);
const StoreModule = import('@modules/store/store.module').then(({ StoreModule }) => StoreModule);

@Module({
    imports: [
        TabModule,
        StoreModule,
    ],
    components: [
        ClientDashboardComponent,
        ClientMenuItemComponent,
        ClientWorkstationComponent,
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