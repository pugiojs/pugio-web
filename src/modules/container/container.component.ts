import { lazy } from 'react';
import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { BrandService } from '@modules/brand/brand.service';
import { LocaleMenuComponent } from '@modules/locale/locale-menu.component';
import { ProfileMenuComponent } from '@modules/profile/profile-menu.component';
import { ClientsDropdownComponent } from '@modules/clients/clients-dropdown.component';
import { StoreService } from '@modules/store/store.service';

@Component({
    component: lazy(() => import('@modules/container/Container')),
    declarations: [
        LocaleService,
        BrandService,
        LocaleMenuComponent,
        ProfileMenuComponent,
        ClientsDropdownComponent,
        StoreService,
    ],
})
export class ContainerComponent {}