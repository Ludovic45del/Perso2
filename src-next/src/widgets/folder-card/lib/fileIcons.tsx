/**
 * File Icons - Utility functions for file/folder icons
 * @module widgets/folder-card/lib
 * 
 * FSEC-Ready utilities for consistent icon rendering.
 */

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import ArticleIcon from '@mui/icons-material/Article';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';

/** Color mapping for document types */
export const TYPE_COLORS: Record<number, string> = {
    0: '#64748B', // DOCUMENTAIRE
    1: '#3B82F6', // CAO
    2: '#10B981', // ASSEMBLAGE
    3: '#F59E0B', // METROLOGIE
    4: '#8B5CF6', // TRANSPORT
    5: '#EC4899', // FICHIERS_PALS
};

/** Get icon for a file based on its extension */
export function getFileIcon(name: string, size = 24) {
    const lowerName = name.toLowerCase();
    if (lowerName.endsWith('.pdf')) {
        return <PictureAsPdfIcon sx={{ color: '#d32f2f', fontSize: size }} />;
    }
    if (lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx')) {
        return <TableChartIcon sx={{ color: '#2e7d32', fontSize: size }} />;
    }
    if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) {
        return <ArticleIcon sx={{ color: '#1976d2', fontSize: size }} />;
    }
    return <InsertDriveFileIcon sx={{ color: '#757575', fontSize: size }} />;
}

/** Get icon for a folder or file-like folder */
export function getFolderIcon(name: string, size = 28, color = '#999') {
    const lowerName = name.toLowerCase();
    const hasExtension = lowerName.includes('.');
    if (hasExtension) {
        return getFileIcon(name, size);
    }
    return <FolderIcon sx={{ color: color, fontSize: size }} />;
}
