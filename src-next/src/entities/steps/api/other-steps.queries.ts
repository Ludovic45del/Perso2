/**
 * Generic Step Queries Factory - TanStack Query Hooks
 * @module entities/steps/api
 * 
 * Creates query hooks for any step type with consistent patterns
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '@shared/api';
import { stepKeys } from './steps.keys';

import {
    SealingStepListSchema,
    SealingStep,
    PicturesStepListSchema,
    PicturesStep,
    AirtightnessStepListSchema,
    AirtightnessStep,
    GasFillingBpStepListSchema,
    GasFillingBpStep,
    GasFillingHpStepListSchema,
    GasFillingHpStep,
    PermeationStepListSchema,
    PermeationStep,
    DepressurizationStepListSchema,
    DepressurizationStep,
    RepressurizationStepListSchema,
    RepressurizationStep,
} from '../model';

// ============ Sealing Steps ============
export function useSealingStepsByFsec(fsecVersionUuid: string) {
    return useQuery({
        queryKey: stepKeys.sealing.byFsec(fsecVersionUuid),
        queryFn: async (): Promise<SealingStep[]> => {
            const data = await api.get(`/sealing-steps/fsec/${fsecVersionUuid}/`);
            return SealingStepListSchema.parse(data);
        },
        enabled: Boolean(fsecVersionUuid),
    });
}

// ============ Pictures Steps ============
export function usePicturesStepsByFsec(fsecVersionUuid: string) {
    return useQuery({
        queryKey: stepKeys.pictures.byFsec(fsecVersionUuid),
        queryFn: async (): Promise<PicturesStep[]> => {
            const data = await api.get(`/pictures-steps/fsec/${fsecVersionUuid}/`);
            return PicturesStepListSchema.parse(data);
        },
        enabled: Boolean(fsecVersionUuid),
    });
}

// ============ Airtightness Test LP Steps ============
export function useAirtightnessStepsByFsec(fsecVersionUuid: string) {
    return useQuery({
        queryKey: stepKeys.airtightnessTestLp.byFsec(fsecVersionUuid),
        queryFn: async (): Promise<AirtightnessStep[]> => {
            const data = await api.get(`/airtightness-test-lp-steps/fsec/${fsecVersionUuid}/`);
            return AirtightnessStepListSchema.parse(data);
        },
        enabled: Boolean(fsecVersionUuid),
    });
}

// ============ Gas Filling BP (Low Pressure) Steps ============
export function useGasFillingBpStepsByFsec(fsecVersionUuid: string) {
    return useQuery({
        queryKey: stepKeys.gasFillingBp.byFsec(fsecVersionUuid),
        queryFn: async (): Promise<GasFillingBpStep[]> => {
            const data = await api.get(`/gas-filling-bp-steps/fsec/${fsecVersionUuid}/`);
            return GasFillingBpStepListSchema.parse(data);
        },
        enabled: Boolean(fsecVersionUuid),
    });
}

// ============ Gas Filling HP (High Pressure) Steps ============
export function useGasFillingHpStepsByFsec(fsecVersionUuid: string) {
    return useQuery({
        queryKey: stepKeys.gasFillingHp.byFsec(fsecVersionUuid),
        queryFn: async (): Promise<GasFillingHpStep[]> => {
            const data = await api.get(`/gas-filling-hp-steps/fsec/${fsecVersionUuid}/`);
            return GasFillingHpStepListSchema.parse(data);
        },
        enabled: Boolean(fsecVersionUuid),
    });
}

// ============ Permeation Steps ============
export function usePermeationStepsByFsec(fsecVersionUuid: string) {
    return useQuery({
        queryKey: stepKeys.permeation.byFsec(fsecVersionUuid),
        queryFn: async (): Promise<PermeationStep[]> => {
            const data = await api.get(`/permeation-steps/fsec/${fsecVersionUuid}/`);
            return PermeationStepListSchema.parse(data);
        },
        enabled: Boolean(fsecVersionUuid),
    });
}

// ============ Depressurization Steps ============
export function useDepressurizationStepsByFsec(fsecVersionUuid: string) {
    return useQuery({
        queryKey: stepKeys.depressurization.byFsec(fsecVersionUuid),
        queryFn: async (): Promise<DepressurizationStep[]> => {
            const data = await api.get(`/depressurization-steps/fsec/${fsecVersionUuid}/`);
            return DepressurizationStepListSchema.parse(data);
        },
        enabled: Boolean(fsecVersionUuid),
    });
}

// ============ Repressurization Steps ============
export function useRepressurizationStepsByFsec(fsecVersionUuid: string) {
    return useQuery({
        queryKey: stepKeys.repressurization.byFsec(fsecVersionUuid),
        queryFn: async (): Promise<RepressurizationStep[]> => {
            const data = await api.get(`/repressurization-steps/fsec/${fsecVersionUuid}/`);
            return RepressurizationStepListSchema.parse(data);
        },
        enabled: Boolean(fsecVersionUuid),
    });
}
