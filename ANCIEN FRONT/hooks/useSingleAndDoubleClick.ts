import {useCallback, useRef, useState} from 'react';

type Handler = (...args: any[]) => void;

const useSingleAndDoubleClick = (isDoubleClick: Handler, isSingleClick: Handler, delay: number = 200): Handler => {
    const [click, setClick] = useState(false);
    const timerId = useRef<ReturnType<typeof setTimeout>>();

    return useCallback((...args: any[]) => {
        if (click) {
            clearTimeout(timerId.current);
            isDoubleClick(...args);
            setClick(false);
        } else {
            setClick(true);
            timerId.current = setTimeout(() => {
                isSingleClick(...args);
                setClick(false);
            }, delay);
        }
    }, [click, delay, isDoubleClick, isSingleClick]);
}

export default useSingleAndDoubleClick;