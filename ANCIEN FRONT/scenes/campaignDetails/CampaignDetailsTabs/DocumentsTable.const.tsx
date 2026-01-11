import { ColumnsData } from "../../../core/datatable/DataTableRow.tsx";



export const DOCUMENTS_COLUMNS: ColumnsData[] = [
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
        fieldName: 'subtype.label',
        headerName: 'Sous-type',
        objectType: 'string',
        isSortable: true
    }, {
        fieldName: 'path',
        headerName: 'Chemin',
        objectType: 'string',
        isSortable: true
    }, {
        fieldName: 'date',
        headerName: 'Date',
        objectType: 'date',
        isSortable: true
    }
];