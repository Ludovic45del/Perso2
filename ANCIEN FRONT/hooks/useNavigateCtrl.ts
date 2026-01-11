import { useNavigate } from 'react-router-dom';
import React from 'react';

export function useNavigateCtrl() {
    const nav = useNavigate();

    return  (path: string, event?: React.MouseEvent<any>) => {
        if (event && (event.ctrlKey || event.metaKey)) {
            window.open(path, '_blank');
        } else {
            nav(path);
        }
    };
}