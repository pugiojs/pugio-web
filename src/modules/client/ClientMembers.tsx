import {
    createElement,
    FC,
    useEffect,
    useState,
} from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import clsx from 'clsx';
import { InjectedComponentProps } from 'khamsa';
import { UtilsService } from '@modules/utils/utils.service';
import { QueryClientMembersResponseDataItem } from '@modules/client/client.interface';
import { ClientService } from '@modules/client/client.service';
import _ from 'lodash';
import {
    useDebounce,
    useRequest,
} from 'ahooks';
import { useParams } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ClientMemberTab } from '@modules/client/client-members.interface';
import '@modules/client/client-members.component.less';
import { LocaleService } from '@modules/locale/locale.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionProps } from '@modules/brand/exception.interface';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { UserCardProps } from '@modules/user/user-card.interface';
import { UserCardComponent } from '@modules/user/user-card.component';
import { Map } from 'immutable';

const ClientMembers: FC<InjectedComponentProps<BoxProps>> = ({
    className = '',
    declarations,
    ...props
}) => {
    const clientService = declarations.get<ClientService>(ClientService);
    const utilsService = declarations.get<UtilsService>(UtilsService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);
    const Exception = declarations.get<FC<ExceptionProps>>(ExceptionComponent);
    const UserCard = declarations.get<FC<UserCardProps>>(UserCardComponent);

    const { client_id: clientId } = useParams();
    const getLocaleText = localeService.useLocaleContext();
    const getPageLocaleText = localeService.useLocaleContext('pages.clientMembers');
    const [searchValue, setSearchValue] = useState<string>('');
    const [role, setRole] = useState<number>(2);
    const [tabs, setTabs] = useState<ClientMemberTab[]>([]);
    const debouncedSearchValue = useDebounce(searchValue);
    const {
        data: queryClientMembersResponseData,
        loadMore: queryMoreClientMembers,
        loading: queryClientMembersLoading,
        loadingMore: queryClientMembersLoadingMore,
    } = utilsService.useLoadMore<QueryClientMembersResponseDataItem> (
        (data) => clientService.queryClientMembers(
            {
                clientId,
                role,
                ..._.pick(data, ['lastCursor', 'size']),
                search: debouncedSearchValue,
            },
        ),
        {
            reloadDeps: [
                clientId,
                role,
                debouncedSearchValue,
            ],
        },
    );
    const {
        data: userClientRelationResponseData,
    } = useRequest(
        () => {
            return clientService.getUserClientRelation({
                clientId,
            });
        },
    );
    const [
        selectedMembersMap,
        setSelectedMembersMap,
    ] = useState<Map<number, string[]>>(Map<number, string[]>());

    const handleAddSelectedMembersToList = (role: number, memberIdList: string[]) => {
        setSelectedMembersMap(
            selectedMembersMap.set(
                role,
                _.uniq((selectedMembersMap.get(role) || []).concat(memberIdList)),
            ),
        );
    };

    const handleDeleteSelectedMembersFromList = (role: number, memberIdList: string[]) => {
        if (!_.isArray(selectedMembersMap.get(role))) {
            setSelectedMembersMap(selectedMembersMap.set(role, []));
            return;
        }

        setSelectedMembersMap(
            selectedMembersMap.set(
                role,
                selectedMembersMap.get(role).filter((memberId) => {
                    return memberIdList.indexOf(memberId) === -1;
                }),
            ),
        );
    };

    useEffect(() => {
        if (userClientRelationResponseData?.response) {
            const { roleType } = userClientRelationResponseData.response;

            if (roleType === 0) {
                setTabs([
                    {
                        title: 'tabs.members',
                        query: {
                            role: 2,
                        },
                    },
                    {
                        title: 'tabs.admins',
                        query: {
                            role: 1,
                        },
                    },
                ]);
            }
        }
    }, [userClientRelationResponseData]);

    return (
        <Box
            {...props}
            className={clsx('client-members', className)}
        >
            <Box className="header">
                <Box className="header-controls-wrapper">
                    {
                        tabs.length > 0 && (
                            <ToggleButtonGroup value={role}>
                                {
                                    tabs.map((tab) => {
                                        const {
                                            title,
                                            query,
                                        } = tab;

                                        return (
                                            <ToggleButton
                                                value={query?.role}
                                                key={title}
                                                onClick={() => {
                                                    if (typeof query?.role === 'number') {
                                                        setRole(query.role);
                                                    }
                                                }}
                                            >{getPageLocaleText(title)}</ToggleButton>
                                        );
                                    })
                                }
                            </ToggleButtonGroup>
                        )
                    }
                    <TextField
                        classes={{ root: 'search' }}
                        placeholder={getPageLocaleText('placeholder')}
                        disabled={queryClientMembersLoading || queryClientMembersLoadingMore}
                        onChange={(event) => {
                            setSearchValue(event.target.value);
                        }}
                    />
                </Box>
                <Box className="header-controls-wrapper">
                    {
                        (_.isArray(selectedMembersMap.get(role)) && selectedMembersMap.get(role).length > 0) && (
                            <Button
                                color="error"
                                startIcon={<Icon className="icon-delete" />}
                                title={getPageLocaleText('delete', { count: selectedMembersMap.get(role).length })}
                            >{selectedMembersMap.get(role).length}</Button>
                        )
                    }
                    <Button
                        startIcon={<Icon className="icon-account-add" />}
                    >{getPageLocaleText('add')}</Button>
                </Box>
            </Box>
            <Divider />
            <Box className="page client-members-page">
                <Box
                    className={clsx('members-wrapper', {
                        'loading-wrapper': queryClientMembersLoading,
                    })}
                >
                    {
                        queryClientMembersLoading
                            ? <Loading />
                            : queryClientMembersResponseData?.list.length === 0
                                ? <Exception
                                    imageSrc="/static/images/empty.svg"
                                    title={getPageLocaleText('empty.title')}
                                    subTitle={getPageLocaleText('empty.subTitle')}
                                />
                                : <>
                                    {
                                        queryClientMembersResponseData.list.map((listItem) => {
                                            const {
                                                id,
                                                user,
                                            } = listItem;

                                            return createElement(
                                                UserCard,
                                                {
                                                    key: id,
                                                    profile: user,
                                                    menu: [
                                                        {
                                                            icon: 'icon-delete',
                                                            title: getPageLocaleText('userCardMenu.delete'),
                                                        },
                                                    ],
                                                    checked: (selectedMembersMap.get(role) || []).indexOf(user.id) !== -1,
                                                    onCheckStatusChange: (checked) => {
                                                        if (checked) {
                                                            handleAddSelectedMembersToList(role, [user.id]);
                                                        } else {
                                                            handleDeleteSelectedMembersFromList(role, [user.id]);
                                                        }
                                                    },
                                                },
                                            );
                                        })
                                    }
                                    <Button
                                        variant="text"
                                        classes={{ root: 'load-more-button' }}
                                        disabled={queryClientMembersLoadingMore || queryClientMembersResponseData?.remains === 0}
                                        onClick={queryMoreClientMembers}
                                    >
                                        {
                                            queryClientMembersLoadingMore
                                                ? getLocaleText('loadings.loading')
                                                : queryClientMembersResponseData?.remains === 0
                                                    ? getLocaleText('loadings.noMore')
                                                    : getLocaleText('loadings.loadMore')
                                        }
                                    </Button>
                                </>
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default ClientMembers;
