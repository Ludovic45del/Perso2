/**
 * FolderCard - Reusable folder card component
 * @module widgets/folder-card
 * 
 * FSEC-Ready component for displaying folders in grid or list view.
 */

import { Paper, Box, Typography, PaperProps } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { CopyButton } from '@shared/ui';
import { getFolderIcon } from './lib/fileIcons';

interface FolderCardProps extends Omit<PaperProps, 'onClick'> {
    /** Folder name */
    name: string;
    /** Theme color */
    color?: string;
    /** Path for copy button */
    path?: string;
    /** Click handler */
    onClick?: () => void;
    /** View mode */
    viewMode?: 'grid' | 'list';
    /** Icon size */
    iconSize?: number;
    /** Show file-type icon instead of folder */
    useFileIcon?: boolean;
}

export function FolderCard({
    name,
    color = '#999',
    path,
    onClick,
    viewMode = 'grid',
    iconSize,
    useFileIcon = false,
    sx,
    ...props
}: FolderCardProps) {
    const isGrid = viewMode === 'grid';
    const size = iconSize ?? (isGrid ? 28 : 24);

    const icon = useFileIcon
        ? getFolderIcon(name, size, color)
        : <FolderIcon sx={{ color, fontSize: size }} />;

    if (isGrid) {
        return (
            <Paper
                variant="outlined"
                onClick={onClick}
                sx={{
                    p: 2,
                    borderRadius: 1,
                    cursor: onClick ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.2s',
                    borderColor: 'divider',
                    position: 'relative',
                    '&:hover': {
                        borderColor: color,
                        boxShadow: 1,
                        bgcolor: 'background.paper'
                    },
                    ...sx,
                }}
                {...props}
            >
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: `${color}15`,
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, flex: 1 }}>
                    {name}
                </Typography>
                {path && <CopyButton path={path} />}
            </Paper>
        );
    }

    // List view
    return (
        <Paper
            variant="outlined"
            onClick={onClick}
            sx={{
                p: 1.5,
                px: 2,
                cursor: onClick ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 1,
                transition: 'all 0.2s',
                borderColor: 'divider',
                '&:hover': {
                    borderColor: color,
                    bgcolor: `${color}05`
                },
                ...sx,
            }}
            {...props}
        >
            <Box
                sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: `${color}15`,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {icon}
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, flex: 1 }}>
                {name}
            </Typography>
            {path && <CopyButton path={path} />}
        </Paper>
    );
}
