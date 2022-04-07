import { Module } from 'khamsa';
import { AppComponent } from '@/app.component';
import { RequestModule } from '@modules/request/request.module';
import { UtilsModule } from '@modules/utils/utils.module';
import { ContainerComponent } from './container.component';

const LocaleModule = import('@modules/locale/locale.module').then(({ LocaleModule }) => LocaleModule);
const BrandModule = import('@modules/brand/brand.module').then(({ BrandModule }) => BrandModule);
const StoreModule = import('@modules/store/store.module').then(({ StoreModule }) => StoreModule);
const ProfileModule = import('@modules/profile/profile.module').then(({ ProfileModule }) => ProfileModule);
const ClientsModule = import('@modules/clients/clients.module').then(({ ClientsModule }) => ClientsModule);
const TabModule = import('@modules/tab/tab.module').then(({ TabModule }) => TabModule);

@Module({
    imports: [
        UtilsModule,
        RequestModule,
        BrandModule,
        LocaleModule,
        StoreModule,
        ProfileModule,
        ClientsModule,
        TabModule,
    ],
    components: [
        AppComponent,
        ContainerComponent,
    ],
    routes: [
        {
            path: '',
            useComponentClass: AppComponent,
            children: [
                {
                    path: 'clients',
                    useModuleClass: ClientsModule,
                },
            ],
        },
    ],
})
export class AppModule {}
