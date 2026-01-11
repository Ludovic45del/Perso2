import * as React from 'react';
import { Dispatch, useEffect, useReducer, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {SxProps, TableSortLabel} from '@mui/material';
import dayjs from 'dayjs';
import {FieldValues, UseFieldArrayReturn} from 'react-hook-form';
import {getNextValueIfNestedProperty} from "../../services/utils/getNextValueIfNestedProperty.service.ts";


export interface ColumnsData {
    headerName: string,
    fieldName: string, // used as key should be unique
    objectType?: 'string' | 'date' | 'number',
    isSortable?: boolean,
    sx?: SxProps
}

export type RowProps<T extends FieldValues> = {
    object: T,
    rowIndex: number,
    selectedRow?: T,
    objectType?: string,
    offsetIndex?: number,
    onClick?: (row: T | null, index: number | string | null, isSelected?:boolean) => void,
    onDoubleClick?: ((row: T | null, index: number) => void) | undefined,
    rowFunction?: (row: T , index: number, modal?: string) => void,
    actionsPosition?: 'START' | 'END'
    openModal?: Dispatch<React.SetStateAction<any>>
    updateTable?: Dispatch<React.SetStateAction<T[]>>
};

/**
 * DataTableProps interface
 * @interface
 *
 * @property {React.FC<RowProps<any>>} RowComponent - component use to display each rows (tr).
 * @property {any[]} rowsData - The data's array to display.
 * @property {ColumnsData[]} columns - Columns in your table
 * @property {((rows: any[]) => void) | undefined} setRows - Method to update rowsData, needed if the table is sortable
 *
 * Row props
 * @property {string} objectType - type of data.
 * @property {((row: any, index: number | null) => void) | undefined} onClick - On click method applied on rows
 * @property {((row: any, index: number | null) => void) | undefined} onDoubleClick - On double click method applied on rows
 * @property {number | undefined} offsetIndex - offset on index if your array doesnt start at 0
 * @property {any} selectedRow - the selected row of your table
 * @property {'START' | 'END'} actionsPosition - action buttons position in first or last cell of each tr
 *
 * Style props
 * @property {string | undefined} maxHeight - Max height of table
 * @property {string | undefined} margin - margin of table
 */
interface DataTableProps {
    RowComponent: React.FC<RowProps<any>>
    rowsData: any[],
    columns: ColumnsData[],
    setRows?: (rows: any[]) => void,

    objectType?: string,
    onClick?: (row: any , index: number | string | null, isSelected?: boolean) => void,
    onDoubleClick?: (row: any , index: number) => void,
    offsetIndex?: number,
    selectedRow?: any,
    actionsPosition?: 'START' | 'END',
    openModal?: Dispatch<React.SetStateAction<any>>,
    fieldArrayMethods?: Omit<UseFieldArrayReturn<any, any>, "fields">;
    updateTable?: Dispatch<React.SetStateAction<any>>

    maxHeight?: string,
    maxWidth?: string,
    margin?: string,
}

type Order = 'asc' | 'desc';

interface State {
    order: Order;
    orderBy: string;
    orderType: string;
}

type Action =
    | { type: 'SET_SORTING'; payload: { order: Order; orderBy: string; orderType: string } }

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'SET_SORTING':
            return {
                ...state,
                ...action.payload,
            };
        default:
            throw new Error('Invalid action type');
    }
};

const performSorting = (rows: any[], {order, orderBy, orderType}: State) => {
    return [...rows].sort((a, b) => {
        let res;
        const value1 = getNextValueIfNestedProperty(orderBy,a);
        const value2 = getNextValueIfNestedProperty(orderBy,b);

        if (orderType === 'date') {
            if (!value1) return 1;
            if (!value2) return -1;

            const date1 = dayjs(value1, 'DD/MM/YYYY HH:mm:ss');
            const date2 = dayjs(value2, 'DD/MM/YYYY HH:mm:ss');

            res = date1.isSame(date2) ? 0 : date1.isBefore(date2) ? -1 : 1;

        } else if (orderType === 'number') {
            if (value1 === null) return 1;
            if (value2 === null) return -1;
            res = value1 - value2;
        } else {
            res = value1?.toString().localeCompare(value2, 'fr', {sensitivity: 'accent'});
        }

        return (order === 'asc') ? res : -res;
    });
};


export default function DataTableRow({RowComponent, rowsData, columns, setRows, maxHeight,maxWidth, margin, ...rowProps }: DataTableProps) {
    const [state, dispatch] = useReducer(reducer, {
        order: 'asc',
        orderBy: columns[0].fieldName,
        orderType: columns[0].objectType,
    });

    const rowsDataRef = useRef(rowsData);
    rowsDataRef.current = rowsData;

    useEffect(() => {
        if (setRows && rowsDataRef.current) {
            setRows(performSorting(rowsDataRef.current, state));
        }
    }, [setRows, state]);


    return (
        <TableContainer sx={{
            maxHeight: maxHeight ?? '100%',
            maxWidth: maxWidth ?? '100%',
            margin: margin ?? '0',
        }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {columns.map(column =>
                            <TableCell key={column.fieldName} align="left" sx={column.sx}>
                                {column.isSortable ?
                                    <TableSortLabel
                                        active={state.orderBy === column.fieldName}
                                        direction={state.orderBy === column.fieldName ? state.order : 'asc'}
                                        onClick={() => dispatch({
                                            type: 'SET_SORTING',
                                            payload: {
                                                order: column.fieldName === state.orderBy && state.order === 'asc' ? 'desc' : 'asc',
                                                orderBy: column.fieldName,
                                                orderType: column.objectType,
                                            },
                                        })}
                                    >
                                        {column.headerName}
                                    </TableSortLabel> : column.headerName}
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rowsData?.map((row, index) =>
                        <RowComponent object={row} key={row.id || row.uuid || index} rowIndex={index} {...rowProps}/>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}