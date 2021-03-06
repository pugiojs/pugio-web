import { ReactNode } from 'react';
import {
    Map,
    List,
} from 'immutable';
import {
    Client,
    QueryClientsResponseDataItem,
} from '@modules/clients/clients.interface';
import { Profile } from '@modules/profile/profile.interface';
import { Channel } from '@modules/channel/channel.interface';

export interface ChannelMetadata {
    client: Client;
    relation: Omit<QueryClientsResponseDataItem, 'client'>;
    user: Profile;
}

export interface Lifecycle {
    onFocus?: () => void;
    onBlur?: () => void;
    onBeforeDestroy?: () => boolean;
}

export interface ObservableChannelConfig {
    width: number;
    height: number;
    locale: string;
    mode: 'dark' | 'light';
}

export interface ObservableChannelData extends ObservableChannelConfig {
    dispose: Function;
    status: 'initializing' | 'updated';
}

type TabTitleSetter = (previousTitle: string) => string;
export interface TabFunctionMap {
    closeTab: () => void;
    createNewTab: (focus?: boolean, channelId?: string) => void;
    setTitle: (setterOrString: string | TabTitleSetter) => void;
}

export type UseChannelLocaleContext = (basePathname?: string) => Function;
export type UseChannelConfig = () => ObservableChannelData;

export interface LoadedChannelProps {
    metadata: ChannelMetadata;
    tab: TabFunctionMap,
    useLocaleContext: UseChannelLocaleContext;
    useChannelConfig: UseChannelConfig;
    setup: (lifecycle?: Lifecycle, channelId?: string) => void;
}

export interface ChannelTab {
    tabId: string;
    title?: string;
    channelId?: string;
    data?: Channel;
    nodes?: ReactNode;
    loading?: boolean;
    errored?: boolean;
    lifecycle?: Lifecycle;
}

export type TabData = Omit<ChannelTab, 'tabId'>;

export interface AppState {
    userProfile: Profile;
    channelTabs: Map<string, List<ChannelTab>>;
    clientSidebarWidth: number;
    clientsDropdownOpen: boolean;
    selectedClientId: string;
    pathnameReady: boolean;
    appNavbarHeight: number;
    controlsWrapperHeight: number;
    tabsWrapperHeight: number;
    selectedTabMap: Map<string, string>;
    tabsScrollMap: Map<string, number>;
    windowInnerHeight: number;
    windowInnerWidth: number;
    setClientSidebarWidth: (width: number) => void;
    createTab: (clientId: string, data?: TabData) => string;
    updateTab: (clientId: string, tabId: string, updates: Partial<TabData>) => void;
    destroyTab: (clientId: string, tabId: string) => void;
    switchClientsDropdownVisibility: (open?: boolean) => void;
    setPathnameReady: () => void;
    setControlsWrapperHeight: (height: number) => void;
    setTabsWrapperHeight: (height: number) => void;
    setSelectedTab: (clientId: string, tabId: string) => void;
    setUserProfile: (profile: Profile) => void;
    updateTabsScrollOffset: (clientId: string, offset: number) => void;
    setWindowInnerHeight: (height: number) => void;
    setWindowInnerWidth: (width: number) => void;
    changeSelectedClientId: (clientId: string) => void;
}
