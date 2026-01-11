/**
 * useDocumentSearch - Search logic for document browser
 * @module pages/campaign-details/documents/hooks
 */

import { useMemo } from 'react';
import { CAMPAIGN_DOCUMENT_TYPES, CAMPAIGN_DOCUMENT_SUBTYPES, CAMPAIGN_FILE_TYPES } from '@entities/campaign/lib';
import { CampaignDocument } from '@entities/campaign-document';

interface UseDocumentSearchProps {
    documents: CampaignDocument[] | undefined;
    searchQuery: string;
    baseCampaignPath: string;
}

export function useDocumentSearch({ documents, searchQuery, baseCampaignPath }: UseDocumentSearchProps) {
    const allSearchResults = useMemo(() => {
        if (!searchQuery.trim()) return null;
        const query = searchQuery.toLowerCase();

        // 1. Types
        const types = Object.values(CAMPAIGN_DOCUMENT_TYPES).filter(t => t.label.toLowerCase().includes(query));

        // 2. Subtypes
        const subtypes = Object.values(CAMPAIGN_DOCUMENT_SUBTYPES).filter(st => st.label.toLowerCase().includes(query));

        // 3. File Types (Categories)
        const ftMatches = Object.values(CAMPAIGN_FILE_TYPES).filter(ft => ft.label.toLowerCase().includes(query));
        const pureFileTypes = ftMatches.filter(ft => !ft.label.includes('.'));
        const pseudoFiles = ftMatches.filter(ft => ft.label.includes('.'));

        // 4. Documents
        const docMatches = documents?.filter(doc => doc.name.toLowerCase().includes(query)) || [];

        // Combine all "files"
        const combinedFiles = [
            ...pseudoFiles.map(ft => {
                const st = CAMPAIGN_DOCUMENT_SUBTYPES[ft.subtypeId];
                const t = CAMPAIGN_DOCUMENT_TYPES[st.typeId];
                return {
                    uuid: String(ft.id),
                    name: ft.label,
                    type: 'fileType',
                    parentLabel: st.label,
                    path: [baseCampaignPath, t.label, st.label, ft.label].join('\\')
                };
            }),
            ...docMatches.map(doc => ({
                uuid: String(doc.uuid),
                name: doc.name,
                type: 'document',
                parentLabel: doc.fileType?.label || doc.subtype?.label,
                path: doc.path
            }))
        ];

        const totalCount = types.length + subtypes.length + pureFileTypes.length + combinedFiles.length;

        return totalCount > 0 ? {
            types,
            subtypes,
            fileTypes: pureFileTypes,
            files: combinedFiles
        } : 'empty';
    }, [searchQuery, documents, baseCampaignPath]);

    const isSearching = allSearchResults !== null;

    return { allSearchResults, isSearching };
}
