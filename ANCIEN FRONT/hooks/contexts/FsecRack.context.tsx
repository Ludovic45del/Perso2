import {createContext, PropsWithChildren, useContext, useEffect, useState} from 'react';
import FsecRackModel from "../../core/domain/fsec/referentials/FsecRack.model.ts";
import {getAllFsecRacks} from "../../services/fsec/fsecRack.service.ts";

interface FsecRackContextI {
    fsecRacks: FsecRackModel[]
}

const FsecRackContext = createContext<FsecRackContextI | null>(null);

export function FsecRackProvider(props: PropsWithChildren) {
    const [fsecRacks, setFsecRacks] = useState<FsecRackModel[]>([]);

    useEffect(() => {
        getAllFsecRacks().then((racks: FsecRackModel[]) => setFsecRacks(racks))
    }, []);

    return <FsecRackContext.Provider value={{fsecRacks}}>
        {props.children}
    </FsecRackContext.Provider>;
}

export const useFsecRackContext = () => {
    const context = useContext(FsecRackContext);

    if (!context) {
        throw new Error('useFsecRackContextContext must be used in FsecRackProvider');
    }

    return context;
};
