import {ColumnsData} from "../DataTableRow.tsx";


export const CAMPAIGNS_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'semester',
        headerName: 'Semestre',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'name',
        headerName: 'Nom',
        objectType: 'string',
        isSortable: true
    }, {
        fieldName: 'type.label',
        headerName: 'Type',
        objectType: 'string',
        isSortable: true
    }, {
        fieldName: 'status',
        headerName: 'Statut',
        objectType: 'string',
    },
    {
        headerName: '',
        fieldName: 'action'
    }
];