/**
 * useDocumentBrowser - Navigation state and handlers for document browser
 * @module pages/campaign-details/documents/hooks
 */

import { useState } from 'react';
import { CAMPAIGN_DOCUMENT_TYPES, CAMPAIGN_DOCUMENT_SUBTYPES, CAMPAIGN_FILE_TYPES } from '@entities/campaign/lib';
import { CampaignDocument } from '@entities/campaign-document';

interface UseDocumentBrowserProps {
    documents: CampaignDocument[] | undefined;
}

export function useDocumentBrowser({ documents }: UseDocumentBrowserProps) {
    // Navigation State
    const [activeTypeId, setActiveTypeId] = useState<number | null>(null);
    const [activeSubtypeId, setActiveSubtypeId] = useState<number | null>(null);
    const [activeFileTypeId, setActiveFileTypeId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    // Derived Data
    const activeType = activeTypeId !== null ? CAMPAIGN_DOCUMENT_TYPES[activeTypeId] : null;
    const activeSubtype = activeSubtypeId !== null ? CAMPAIGN_DOCUMENT_SUBTYPES[activeSubtypeId] : null;
    const activeFileType = activeFileTypeId !== null ? CAMPAIGN_FILE_TYPES[activeFileTypeId] : null;

    // Navigation Handlers
    const handleTypeClick = (typeId: number) => {
        setActiveTypeId(typeId);
        setActiveSubtypeId(null);
        setActiveFileTypeId(null);
    };

    const handleSubtypeClick = (subtypeId: number) => {
        setActiveSubtypeId(subtypeId);
        setActiveFileTypeId(null);
    };

    const handleBack = () => {
        if (activeSubtypeId !== null) {
            setActiveSubtypeId(null);
            setActiveFileTypeId(null);
        } else if (activeTypeId !== null) {
            setActiveTypeId(null);
        }
    };

    const handleReset = () => {
        setActiveTypeId(null);
        setActiveSubtypeId(null);
        setActiveFileTypeId(null);
        setSearchQuery('');
    };

    const handleSearchResultClick = (type: string, id: any) => {
        setSearchQuery('');
        if (type === 'type') {
            setActiveTypeId(id);
            setActiveSubtypeId(null);
            setActiveFileTypeId(null);
        } else if (type === 'subtype') {
            const st = CAMPAIGN_DOCUMENT_SUBTYPES[id];
            setActiveTypeId(st.typeId);
            setActiveSubtypeId(id);
            setActiveFileTypeId(null);
        } else if (type === 'fileType') {
            const ft = CAMPAIGN_FILE_TYPES[id];
            const st = CAMPAIGN_DOCUMENT_SUBTYPES[ft.subtypeId];
            setActiveTypeId(st.typeId);
            setActiveSubtypeId(ft.subtypeId);
            setActiveFileTypeId(null);
        } else if (type === 'document') {
            const doc = documents?.find(d => d.uuid === id);
            if (doc) {
                setActiveTypeId(doc.type?.id || null);
                setActiveSubtypeId(doc.subtype?.id || null);
                setActiveFileTypeId(null);
            }
        }
    };

    // Render Logic
    const isRoot = activeTypeId === null;
    const isTypeLevel = activeTypeId !== null && activeSubtypeId === null;
    const isSubtypeLevel = activeSubtypeId !== null;

    return {
        // State
        activeTypeId,
        activeSubtypeId,
        activeFileTypeId,
        activeType,
        activeSubtype,
        activeFileType,
        viewMode,
        searchQuery,
        isRoot,
        isTypeLevel,
        isSubtypeLevel,
        // Setters
        setViewMode,
        setSearchQuery,
        // Handlers
        handleTypeClick,
        handleSubtypeClick,
        handleBack,
        handleReset,
        handleSearchResultClick,
    };
}
