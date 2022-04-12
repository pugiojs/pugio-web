import {
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import TextField from '@mui/material/TextField';
import { TypographyProps } from '@mui/material/Typography';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ClientsDropdownProps } from '@modules/clients/clients-dropdown.interface';
import _ from 'lodash';
import {
    useDebounce,
    useInfiniteScroll,
} from 'ahooks';
import { ClientsService } from '@modules/clients/clients.service';
import { InfiniteScrollHookData } from '@modules/request/request.interface';
import { QueryClientsResponseData } from '@modules/clients/clients.interface';
import SimpleBar from 'simplebar-react';
import '@modules/clients/clients-dropdown.component.less';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionProps } from '@modules/brand/exception.interface';
import { ExceptionComponent } from '@modules/brand/exception.component';

const ClientsDropdown: FC<InjectedComponentProps<ClientsDropdownProps>> = ({
    declarations,
    open = false,
    onOpen = _.noop,
    onClose = _.noop,
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const clientsService = declarations.get<ClientsService>(ClientsService);
    const typographyProps: TypographyProps = {
        noWrap: true,
        style: {
            width: 180,
        },
    };
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);
    const Exception = declarations.get<FC<ExceptionProps>>(ExceptionComponent);

    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue, { wait: 500 });
    const { client_id: selectedClientId } = useParams();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const getLocaleText = localeService.useLocaleContext();
    const getComponentLocaleText = localeService.useLocaleContext('components.clientsDropdown');
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null);
    const [clients, setClients] = useState<QueryClientsResponseData[]>([]);
    const {
        data: queryClientsResponseData,
        loadMore: queryMoreClients,
        loading: queryClientsLoading,
        loadingMore: queryClientsLoadingMore,
    } = useInfiniteScroll(
        async (data: InfiniteScrollHookData<QueryClientsResponseData>) => {
            const response = await clientsService.queryClients(_.omit(
                {
                    ...data,
                    search: debouncedSearchValue,
                },
                ['list'],
            ));

            return {
                list: response?.response?.items || [],
                ...(_.omit(_.get(response, 'response'), ['items', 'lastCursor']) || {}),
                lastCursor: _.get(Array.from(response?.response?.items || []).pop(), 'id') || null,
            };
        },
        {
            isNoMore: (data) => data && data.remains === 0,
            reloadDeps: [debouncedSearchValue],
        },
    );

    const handleSelectClient = (clientId: string) => {
        navigate(`/client/${clientId}/workstation`);
        onClose();
    };

    useEffect(() => {
        if (open && buttonRef.current) {
            setAnchorEl(buttonRef.current);
        } else {
            setAnchorEl(null);
        }
    }, [open, buttonRef]);

    useEffect(() => {
        if (_.isArray(queryClientsResponseData?.list)) {
            setClients(queryClientsResponseData.list);
        }
    }, [queryClientsResponseData]);

    return (
        <Box>
            <Button
                classes={{ root: 'link' }}
                variant="text"
                endIcon={<Icon className="dropdown-icon icon-keyboard-arrow-down" />}
                ref={buttonRef}
                onClick={onOpen}
            >{getLocaleText('app.navbar.clients')}</Button>
            <Popover
                classes={{ root: 'clients-popover' }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box className="header-wrapper">
                    <TextField
                        classes={{
                            root: 'search-text-field',
                        }}
                        placeholder={getComponentLocaleText('searchPlaceholder')}
                        disabled={queryClientsLoading || queryClientsLoadingMore}
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                    <Button
                        startIcon={<Icon className="icon-plus" />}
                        classes={{ root: 'create-button' }}
                        onClick={() => navigate('/clients/create')}
                    >{getComponentLocaleText('create')}</Button>
                </Box>
                {
                    queryClientsLoading
                        ? <Box className="loading-wrapper">
                            <Loading />
                        </Box>
                        : clients.length === 0
                            ? <Exception
                                imageSrc="/static/images/empty.svg"
                                title={getComponentLocaleText('empty.title')}
                                subTitle={getComponentLocaleText('empty.subTitle')}
                            >
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<Icon className="icon-plus" />}
                                    onClick={() => navigate('/clients/create')}
                                >
                                    {getComponentLocaleText('create')}
                                </Button>
                            </Exception>
                            : <SimpleBar autoHide={true} style={{ height: 360, width: '100%' }}>
                                {
                                    clients.map((item) => {
                                        return (
                                            <ListItem
                                                key={item.id}
                                                onClick={() => handleSelectClient(item.client.id)}
                                            >
                                                <ListItemIcon>
                                                    {
                                                        selectedClientId === item.client.id && (
                                                            <Icon className="icon-check" />
                                                        )
                                                    }
                                                </ListItemIcon>
                                                <ListItemIcon><Icon className="icon-channel" /></ListItemIcon>
                                                <ListItemText
                                                    disableTypography={false}
                                                    primaryTypographyProps={typographyProps}
                                                    secondaryTypographyProps={typographyProps}
                                                >{item.client.name || item.client.id}</ListItemText>
                                            </ListItem>
                                        );
                                    })
                                }
                                {
                                    !queryClientsLoading && (
                                        <Box className="load-more-wrapper">
                                            <Button
                                                variant="text"
                                                classes={{ root: 'load-more-button' }}
                                                disabled={queryClientsLoadingMore || queryClientsResponseData?.remains === 0}
                                                fullWidth={true}
                                                onClick={queryMoreClients}
                                            >
                                                {
                                                    getComponentLocaleText(
                                                        queryClientsLoadingMore
                                                            ? 'loading'
                                                            : queryClientsResponseData?.remains === 0
                                                                ? 'noMore'
                                                                : 'loadMore',
                                                    )
                                                }
                                            </Button>
                                        </Box>
                                    )
                                }
                            </SimpleBar>
                }
                <Divider />
                <Box className="footer-wrapper">
                    <Button
                        classes={{ root: 'link-button view-all-button' }}
                        endIcon={<Icon className="icon icon-arrow-right" fontSize="small" />}
                        onClick={() => navigate('/clients')}
                    >
                        {getComponentLocaleText('viewAll')}
                    </Button>
                </Box>
            </Popover>
        </Box>
    );
};

export default ClientsDropdown;