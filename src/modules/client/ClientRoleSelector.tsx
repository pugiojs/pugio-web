import { FC } from 'react';
import { ClientRoleSelectorProps } from '@/modules/client/client-role-selector.interface';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import _ from 'lodash';
import { PopoverProps } from '@modules/common/popover.interface';
import { PopoverComponent } from '@modules/common/popover.component';
import useTheme from '@mui/material/styles/useTheme';

const ClientRoleSelector: FC<InjectedComponentProps<ClientRoleSelectorProps>> = ({
    declarations,
    role,
    triggerProps = {},
    popoverProps = {},
    listItemButtonProps,
    onRoleChange = _.noop,
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const Popover = declarations.get<FC<PopoverProps>>(PopoverComponent);

    const theme = useTheme();
    const getLocaleText = localeService.useLocaleContext('components.clientRoleSelector');

    return (
        <Popover
            variant="menu"
            Trigger={({ open, openPopover }) => {
                return (
                    <Button
                        variant="text"
                        endIcon={<Icon className="icon-keyboard-arrow-down" />}
                        {...triggerProps}
                        sx={{
                            ...(open ? {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? theme.palette.grey[700]
                                    : theme.palette.grey[300],
                            } : {}),
                        }}
                        onClick={(event) => {
                            event.stopPropagation();
                            openPopover(event);
                        }}
                    >{getLocaleText(`roles[${role}]`) || getLocaleText('unknown')}</Button>
                );
            }}
            muiPopoverProps={{
                ...popoverProps,
                onBackdropClick: (event) => event.stopPropagation(),
            }}
        >
            {
                ({ closePopover }) => {
                    return (
                        <>
                            {
                                new Array(2).fill(null).map((value, index) => {
                                    const currentRole = index + 1;

                                    return (
                                        <ListItemButton
                                            key={index}
                                            dense={true}
                                            selected={currentRole === role}
                                            {
                                                ...(
                                                    listItemButtonProps
                                                        ? typeof listItemButtonProps === 'function'
                                                            ? listItemButtonProps(role, currentRole === role)
                                                            : listItemButtonProps
                                                        : {}
                                                )
                                            }
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onRoleChange(currentRole);
                                                closePopover();
                                            }}
                                        >
                                            <ListItemIcon>
                                                {
                                                    currentRole === role && <Icon className="icon-check" />
                                                }
                                            </ListItemIcon>
                                            <ListItemText>
                                                <Typography
                                                    variant="subtitle2"
                                                    noWrap={true}
                                                    sx={{ minWidth: 64, maxWidth: 120 }}
                                                >{getLocaleText(`roles[${currentRole}]`)}</Typography>
                                            </ListItemText>
                                        </ListItemButton>
                                    );
                                })
                            }
                        </>
                    );
                }
            }
        </Popover>
    );
};

export default ClientRoleSelector;
