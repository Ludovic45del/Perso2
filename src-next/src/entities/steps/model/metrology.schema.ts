/**
 * Metrology Step Schema
 * @module entities/steps/model
 * 
 * Source: cible/domain/steps/models/metrology_step_bean.py
 */

import { z } from 'zod';

export const MetrologyStepApiSchema = z.object({
    uuid: z.string().uuid(),
    fsec_version_id: z.string().uuid(),
    machine_id: z.number().int().nullable(),
    date: z.string().nullable(),
    comments: z.string().nullable(),
});

export const MetrologyStepSchema = MetrologyStepApiSchema.transform((api) => ({
    uuid: api.uuid,
    fsecVersionId: api.fsec_version_id,
    machineId: api.machine_id,
    date: api.date ? new Date(api.date) : null,
    comments: api.comments,
}));

export type MetrologyStep = z.infer<typeof MetrologyStepSchema>;

export const MetrologyStepListSchema = z.array(MetrologyStepApiSchema).transform((list) =>
    list.map((api) => MetrologyStepSchema.parse(api))
);
