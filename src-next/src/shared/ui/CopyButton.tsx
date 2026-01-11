/**
 * CopyButton - Reusable copy-to-clipboard button
 * @module shared/ui
 * 
 * FSEC-Ready component for copying paths to clipboard.
 */

import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';

interface CopyButtonProps extends Omit<IconButtonProps, 'onClick'> {
    /** Path or text to copy */
    path: string;
    /** Tooltip text when not copied */
    tooltip?: string;
    /** Tooltip text after copying */
    copiedTooltip?: string;
}

export function CopyButton({
    path,
    tooltip = 'Copier le chemin',
    copiedTooltip = 'Copié !',
    size = 'small',
    sx,
    ...props
}: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(path);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Tooltip title={copied ? copiedTooltip : tooltip}>
            <IconButton
                color="primary"
                size={size}
                onClick={handleCopy}
                sx={{
                    borderRadius: 1,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    ...sx,
                }}
                {...props}
            >
                <ContentCopyIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
}
