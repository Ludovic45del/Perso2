import {ColumnsData} from "../DataTableRow.tsx";

export const FSECS_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'name',
        headerName: 'Nom',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'campaign.name',
        headerName: 'Campagne associée',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'campaign.year',
        headerName: 'Année',
        objectType: 'number',
        isSortable: true
    },
    {
        fieldName: 'status.label',
        headerName: 'Statut',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'category.label',
        headerName: 'Catégorie',
        objectType: 'string',
        isSortable: true
    },
    {
        headerName: '',
        fieldName: 'action'
    }
];

export const FSECS_DETAILED_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'name',
        headerName: 'Nom',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'embase',
        headerName: 'Embase/Interface',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'status.label',
        headerName: 'Statut',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'rack',
        headerName: 'Rack',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'local',
        headerName: 'Local',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'iec',
        headerName: 'IEC',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'tci',
        headerName: 'TCI',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'deliveryDate',
        headerName: 'Livraison',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'restitution',
        headerName: 'Restitution',
        objectType: 'string',
        isSortable: true
    },
];

export const CAMPAIGN_FSECS_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'name',
        headerName: 'Nom',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'status.label',
        headerName: 'Statut',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'category.label',
        headerName: 'Catégorie',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'embase',
        headerName: 'Embase/Interface',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'deliveryDate',
        headerName: 'Livraison',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'shootingDate',
        headerName: 'Tir',
        objectType: 'string',
        isSortable: true
    },
    {
        headerName: '',
        fieldName: 'action'
    },
];