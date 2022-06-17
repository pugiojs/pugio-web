import { Component } from '@agros/core';
import { Navigate } from '@agros/core/lib/router';

@Component({
    component: () => <Navigate to="/clients/list" />,
})
export class ClientComponent {}
