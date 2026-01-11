import "../scenes.scss";
import {FsecProvider} from "../../hooks/contexts/Fsec.context.tsx";
import './FsecDetails.scene.scss';
import FsecDetails from "./FsecDetails.tsx";


export default function FsecDetailsScene() {
    return (
        <FsecProvider>
            <FsecDetails></FsecDetails>
        </FsecProvider>
    );
}
