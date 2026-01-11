/**
 * Sealing Step Schema
 * @module entities/steps/model
 * 
 * Source: cible/domain/steps/models/sealing_step_bean.py
 */

import { z } from 'zod';

export const SealingStepApiSchema = z.object({
    uuid: z.string().uuid(),
    fsec_version_id: z.string().uuid(),
    interface_io: z.string().nullable(),
    comments: z.string().nullable(),
});

export const SealingStepSchema = SealingStepApiSchema.transform((api) => ({
    uuid: api.uuid,
    fsecVersionId: api.fsec_version_id,
    interfaceIo: api.interface_io,
    comments: api.comments,
}));

export type SealingStep = z.infer<typeof SealingStepSchema>;

export const SealingStepListSchema = z.array(SealingStepApiSchema).transform((list) =>
    list.map((api) => SealingStepSchema.parse(api))
);
