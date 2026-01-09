/**
 * Metrology Step Queries - TanStack Query Hooks
 * @module entities/steps/api
 * 
 * Endpoint verified: /api/metrology-steps/fsec/{fsec_id}/
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/api';
import { MetrologyStep, MetrologyStepSchema, MetrologyStepListSchema } from '../model';
import { stepKeys } from './steps.keys';

/**
 * Fetch metrology steps by FSEC version UUID
 */
export function useMetrologyStepsByFsec(fsecVersionUuid: string) {
    return useQuery({
        queryKey: stepKeys.metrology.byFsec(fsecVersionUuid),
        queryFn: async (): Promise<MetrologyStep[]> => {
            const data = await api.get(`/metrology-steps/fsec/${fsecVersionUuid}/`);
            return MetrologyStepListSchema.parse(data);
        },
        enabled: Boolean(fsecVersionUuid),
    });
}

/**
 * Fetch single metrology step by UUID
 */
export function useMetrologyStep(uuid: string) {
    return useQuery({
        queryKey: stepKeys.metrology.detail(uuid),
        queryFn: async (): Promise<MetrologyStep> => {
            const data = await api.get(`/metrology-steps/${uuid}/`);
            return MetrologyStepSchema.parse(data);
        },
        enabled: Boolean(uuid),
    });
}

interface UpdateMetrologyStepInput {
    uuid: string;
    fsecVersionId: string;
    machineId?: number | null;
    date?: Date | null;
    comments?: string | null;
}

/**
 * Update metrology step
 */
export function useUpdateMetrologyStep() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateMetrologyStepInput): Promise<MetrologyStep> => {
            const apiData = {
                fsec_version_id: input.fsecVersionId,
                machine_id: input.machineId ?? null,
                date: input.date?.toISOString().split('T')[0] ?? null,
                comments: input.comments ?? null,
            };
            const response = await api.put(`/metrology-steps/${input.uuid}/`, apiData);
            return MetrologyStepSchema.parse(response);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: stepKeys.metrology.detail(variables.uuid),
            });
            queryClient.invalidateQueries({
                queryKey: stepKeys.metrology.byFsec(variables.fsecVersionId),
            });
        },
    });
}
