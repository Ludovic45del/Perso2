import {createContext, PropsWithChildren, useContext, useEffect, useState} from 'react';
import MetrologyMachineModel from "../../core/domain/fsec/referentials/MetrologyMachine.model.ts";
import {getAllMetrologyMachinesAvailable} from "../../services/fsec/fsecMetrologyMachine.service.ts";

interface MetrologyMachineContextI {
    metrologyMachines: MetrologyMachineModel[]
}

const MetrologyMachineContext = createContext<MetrologyMachineContextI | null>(null);

export function MetrologyMachineProvider(props: PropsWithChildren) {
    const [metrologyMachines, setMetrologyMachines] = useState<MetrologyMachineModel[]>([]);

    useEffect(() => {
        getAllMetrologyMachinesAvailable().then((machines: MetrologyMachineModel[]) => setMetrologyMachines(machines))
    }, []);

    return <MetrologyMachineContext.Provider value={{metrologyMachines}}>
        {props.children}
    </MetrologyMachineContext.Provider>;
}

export const useMetrologyMachineContext = () => {
    const context = useContext(MetrologyMachineContext);

    if (!context) {
        throw new Error('useMetrologyMachineContextContext must be used in MetrologyMachineProvider');
    }

    return context;
};
