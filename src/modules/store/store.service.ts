import { Injectable } from 'khamsa';
import create from 'zustand';
import { Map } from 'immutable';
import { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { AppState } from '@modules/store/store.interface';

@Injectable()
export class StoreService {
    public useStore = create<AppState>((set) => {
        return {
            selectedClientId: null,
            clientTabs: Map({}),
            clientSidebarWidth: null,
            clientsDropdownOpen: false,

            changeClientSidebarWidth: (width: number) => {
                set(() => ({ clientSidebarWidth: width }));
            },

            createTab: (clientId: string, appId: string, nodes: ReactNode) => {
                const tabId = uuidv4();

                set((state) => {
                    const tabs = state.clientTabs.get(clientId) || [];

                    tabs.push({
                        id: tabId,
                        appId,
                        nodes,
                    });

                    return {
                        clientTabs: state.clientTabs.set(clientId, tabs),
                    };
                });

                return tabId;
            },

            destroyTab: (clientId: string, tabId: string) => {
                set((state) => {
                    const tabs = state.clientTabs.get(clientId);

                    if (!_.isArray(tabs)) {
                        return {
                            clientTabs: state.clientTabs,
                        };
                    }

                    return {
                        clientTabs: state.clientTabs.set(
                            clientId,
                            tabs.filter((tab) => tab.id !== tabId),
                        ),
                    };
                });
            },

            switchClientsDropdownVisibility: (open?: boolean) => {
                set((state) => {
                    return {
                        clientsDropdownOpen: _.isBoolean(open) ? open : !state.clientsDropdownOpen,
                    };
                });
            },

            setSelectedClientId: (clientId: string) => {
                set((state) => ({ selectedClientId: clientId }));
            },
        };
    });
}
