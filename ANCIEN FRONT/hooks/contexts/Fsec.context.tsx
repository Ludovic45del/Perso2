import {createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState} from 'react';
import {useSnackBarContext} from "../../scenes/home/Home.scene.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {getFsecByUuid} from "../../services/fsec/fsec.service.ts";
import FsecDetailedModel from "../../core/domain/fsec/FsecDetailed.model.ts";

interface FsecContextI {
    fsec: FsecDetailedModel
    setFsec: Dispatch<SetStateAction<FsecDetailedModel>>
}

const FsecContext = createContext<FsecContextI | null>(null);
export function FsecProvider(props: PropsWithChildren) {
    const snackBar = useSnackBarContext()
    const nav = useNavigate()

    const [fsec, setFsec] = useState<FsecDetailedModel>({} as FsecDetailedModel);
    const {versionUuid} = useParams<{ versionUuid: string }>();

    useEffect(() => {
        if (versionUuid) {
            getFsecByUuid(versionUuid).then((fsec: FsecDetailedModel) => setFsec(fsec)).catch(responseError => {
                responseError.json().then((json: any) => {
                    snackBar.openSnackbar(json.message, 'error');
                });
                nav('/fsecs')
            });
        }
    }, [nav, snackBar, versionUuid]);

    return <FsecContext.Provider value={{fsec, setFsec}}>
        {props.children}
    </FsecContext.Provider>;
}

export const useFsecContext = () => {
    const context = useContext(FsecContext);

    if (!context) {
        throw new Error('useFsecContext must be used in FsecProvider');
    }

    return context;
};
