import {fetcher} from "../utils/fetch-utils.service.ts";
import {BASE_API_CIBLE_HREF} from "../../constants.ts";
import FsecModel from "../../core/domain/fsec/Fsec.model.ts";
import FsecDetailedModel from "../../core/domain/fsec/FsecDetailed.model.ts";
import FsecAssemblyStepModel from "../../core/domain/fsec/steps/FsecAssemblyStep.model.ts";
import FsecMetrologyWorkflowStepModel from "../../core/domain/fsec/steps/FsecMetrologyWorkflowStep.model.ts";
import FsecGasFillingLowPressureStepModel from "../../core/domain/fsec/steps/FsecGasFillingLowPressureStep.model.ts";

export function getAllFsecs(): Promise<FsecModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/`, requestOptions);
}

export function createFsec(fsec: FsecModel): Promise<FsecModel> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(fsec)
    };

    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/`, requestOptions)
}
export function getFsecByUuid(uuid: string): Promise<FsecDetailedModel> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/${uuid}`, requestOptions);
}

export function updateFsec(fsec: FsecDetailedModel): Promise<FsecDetailedModel> {
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(fsec)
    };

    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/`, requestOptions)
}

export function deleteFsec(uuid: string): Promise<null> {
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/${uuid}`, requestOptions);
}

export function getAllFsecsByCampaignUUID(campaignUUID: string): Promise<FsecModel[]> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/campaign/${campaignUUID}`, requestOptions);
}

export function returnToAssembly(assembly: FsecAssemblyStepModel, uuid: string): Promise<FsecDetailedModel> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(assembly)
    };

    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/workflow/assembly/${uuid}`, requestOptions)
}

export function returnToMetrology(metrology: FsecMetrologyWorkflowStepModel, uuid: string): Promise<FsecDetailedModel> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(metrology)
    };

    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/workflow/metrology/${uuid}`, requestOptions)
}

export function setDepressurizationFailedStatus(uuid: string): Promise<FsecGasFillingLowPressureStepModel> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    };

    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/workflow/depressurization-fail/${uuid}`, requestOptions)
}

export function returnToRepressurization(uuid: string): Promise<FsecDetailedModel> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    };

    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/workflow/repressurization/${uuid}`, requestOptions)
}


export function returnToReassembly(uuid: string): Promise<FsecDetailedModel> {
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    };

    return fetcher(`${BASE_API_CIBLE_HREF}/fsec/workflow/reassembly/${uuid}`, requestOptions)
}


