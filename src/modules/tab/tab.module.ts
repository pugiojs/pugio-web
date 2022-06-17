import { Module } from '@agros/core';
import { TabComponent } from '@modules/tab/tab.component';

@Module({
    components: [
        TabComponent,
    ],
    exports: [
        TabComponent,
    ],
})
export class TabModule {}
