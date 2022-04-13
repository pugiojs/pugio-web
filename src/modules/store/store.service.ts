import { Injectable } from 'khamsa';
import create from 'zustand';
import {
    Map,
    Set,
} from 'immutable';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
    AppState,
    ChannelTab,
    TabData,
} from '@modules/store/store.interface';
import { Profile } from '@modules/profile/profile.interface';

@Injectable()
export class StoreService {
    public useStore = create<AppState>((set) => {
        return {
            userProfile: null,
            channelTabs: Map<string, Set<ChannelTab>>({}),
            clientSidebarWidth: null,
            clientsDropdownOpen: false,
            pathnameReady: false,
            appNavbarHeight: 48,
            controlsWrapperHeight: 0,
            tabsWrapperHeight: 0,
            selectedTabMap: Map<string, string | '@@startup'>({}),

            setClientSidebarWidth: (width: number) => {
                set(() => ({ clientSidebarWidth: width }));
            },

            createTab: (clientId: string, data: TabData) => {
                const tabId = uuidv4();

                set((state) => {
                    const channelTabData: ChannelTab = { tabId, ...data };

                    if (!state.channelTabs.get(clientId)) {
                        const tabs = Set<ChannelTab>();
                        tabs.add(channelTabData);
                        return {
                            channelTabs: state.channelTabs.set(clientId, tabs),
                        };
                    } else {
                        const tabs = Set(state.channelTabs.get(clientId).toArray() || []);
                        tabs.add(channelTabData);
                        return {
                            channelTabs: state.channelTabs.set(clientId, tabs),
                        };
                    }
                });

                return tabId;
            },

            updateTab: (clientId: string, tabId: string, updates: Partial<TabData>) => {
                set((state) => {
                    const client = state.channelTabs.get(clientId);

                    if (!client) {
                        return {
                            channelTabs: state.channelTabs,
                        };
                    }

                    return {
                        channelTabs: state.channelTabs.set(
                            clientId,
                            client.map((clientItem) => {
                                if (clientItem.tabId === tabId) {
                                    return {
                                        ...clientItem,
                                        ..._.pick(updates, ['nodes', 'loading', 'errored']),
                                    };
                                }

                                return clientItem;
                            }),
                        ),
                    };
                });
            },

            destroyTab: (clientId: string, tabId: string) => {
                set((state) => {
                    const tabs = state.channelTabs.get(clientId);

                    if (!_.isArray(tabs)) {
                        return {
                            channelTabs: state.channelTabs,
                        };
                    }

                    return {
                        channelTabs: state.channelTabs.set(
                            clientId,
                            tabs.filter((tab) => tab.tabId !== tabId),
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

            setPathnameReady: () => {
                set({ pathnameReady: true });
            },

            setControlsWrapperHeight: (height: number) => {
                set({ controlsWrapperHeight: height });
            },

            setTabsWrapperHeight: (height: number) => {
                set({ tabsWrapperHeight: height });
            },

            setSelectedTab: (clientId: string, tabId: string) => {
                set((state) => {
                    return {
                        selectedTabMap: state.selectedTabMap.set(clientId, tabId),
                    };
                });
            },

            setUserProfile: (profile: Profile) => {
                set({ userProfile: profile });
            },
        };
    });
}
