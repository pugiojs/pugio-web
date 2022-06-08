import { lazy } from 'react';
import { Component } from 'khamsa';
import { ClientService } from '@modules/client/client.service';
import { LoadingComponent } from '@modules/brand/loading.component';

@Component({
    factory: (forwardRef) => lazy(() => forwardRef(import('@modules/client/ClientDetails'))),
    declarations: [
        ClientService,
        LoadingComponent,
    ],
})
export class ClientDetailsComponent {}