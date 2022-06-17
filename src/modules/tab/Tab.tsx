import { FC } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {
    getContainer,
    useEffect,
    useRef,
    useState,
} from '@agros/core';
import { TabProps } from '@modules/tab/tab.interface';
import { LoadingComponent } from '@modules/brand/loading.component';
import { LocaleService } from '@modules/locale/locale.service';
import clsx from 'clsx';
import _ from 'lodash';
import styled from '@mui/material/styles/styled';
import Color from 'color';
import { BrandService } from '@modules/brand/brand.service';

const TabWrapper = styled(Box)(({ theme }) => {
    const mode = theme.palette.mode;

    return `
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
        flex-grow: 0;
        user-select: none;
        padding: ${theme.spacing(1)};
        border-top: 1px solid transparent;
        border-right: 1px solid ${theme.palette.divider};
        border-bottom: 1px solid ${theme.palette.divider};
        height: 45px;
        overflow-y: hidden;
        min-width: 150px;

        &:last-child {
            border-right: 0;
        }

        &:not(.placeholder) {
            cursor: pointer;

            &:hover {
                background-color: ${Color(theme.palette.grey[50])[mode === 'dark' ? 'lighten' : 'darken'](0.05).toString()};

                .close-icon {
                    &:hover {
                        background-color: ${Color(theme.palette.grey[50])[mode === 'dark' ? 'lighten' : 'darken'](0.1).toString()};
                    }

                    &:active {
                        background-color: ${Color(theme.palette.grey[50])[mode === 'dark' ? 'lighten' : 'darken'](0.15).toString()};
                    }
                }
            }
        }

        &.active {
            border-bottom-color: transparent;
            background-color: white;

            &:hover {
                background-color: white;
                cursor: default;
            }
        }

        &.startup {
            justify-content: center;
        }

        &.placeholder {
            flex-grow: 1;
        }

        .content-wrapper {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .avatar {
                width: 15px;
                height: 15px;
                margin-right: ${theme.spacing(1)};
                pointer-events: none;
            }

            .text {
                width: 120px;
                font-size: 12px;
                color: ${theme.palette.text.primary};
            }
        }

        .close-icon {
            margin-left: 5px;

            .pugio-icons {
                font-size: 13px;
            }
        }
    `;
});

const Tab: FC<TabProps> = ({
    title,
    closable = true,
    slotElement = false,
    active = false,
    avatar = '/static/images/startup.svg',
    loading = false,
    errored = false,
    startup = false,
    children,
    className,
    channelId,
    metadata,
    onClose = _.noop,
    onDataLoad = _.noop,
    onTitleChange = _.noop,
    onSelectedScroll = _.noop,
    ...props
}) => {
    const container = getContainer(Tab);
    const localeService = container.get<LocaleService>(LocaleService);
    const Loading = container.get<FC<BoxProps>>(LoadingComponent);
    const brandService = container.get<BrandService>(BrandService);

    const getLocaleText = localeService.useLocaleContext('components.tab');
    const [tabTitle, setTabTitle] = useState<string>('');
    const tabRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (channelId) {
            onDataLoad(channelId);
        }
    }, [channelId]);

    useEffect(() => {
        if (title && channelId) {
            setTabTitle(title);
        } else {
            setTabTitle(getLocaleText('startup'));
        }
    }, [getLocaleText, title, channelId]);

    useEffect(() => {
        onTitleChange(title);
    }, [title]);

    useEffect(() => {
        if (active && tabRef.current && metadata.indexOf('scroll') !== -1) {
            const offsetLeft = tabRef.current.offsetLeft;
            const clientWidth = tabRef.current.clientWidth;
            onSelectedScroll(offsetLeft, clientWidth);
        }
    }, [metadata, active, tabRef]);

    return (
        <TabWrapper
            title={title}
            className={clsx('tab', {
                active,
                errored,
                startup,
                loading,
                placeholder: slotElement,
            }, className)}
            ref={tabRef}
            {...props}
        >
            {
                loading
                    ? <Loading style={{ width: 28 }} />
                    : slotElement
                        ? children
                        : (
                            <Box className="content-wrapper">
                                {
                                    errored
                                        ? <Box
                                            className="avatar"
                                            dangerouslySetInnerHTML={{ __html: brandService.getVectors('errorAvatar') }}
                                        />
                                        : <Box className="avatar" component="img" src={avatar} />
                                }
                                <Typography className="text" noWrap={true}>
                                    {
                                        errored
                                            ? getLocaleText('errored')
                                            : tabTitle
                                    }
                                </Typography>
                            </Box>
                        )
            }
            {
                (closable && !slotElement) && (
                    <IconButton
                        classes={{ root: 'close-icon' }}
                        size="small"
                        disabled={loading}
                        onClick={(event) => {
                            event.stopPropagation();
                            onClose();
                        }}
                    >
                        <Icon className="icon-x" />
                    </IconButton>
                )
            }
        </TabWrapper>
    );
};

export default Tab;
