/**
 * Pictures Step Schema
 * @module entities/steps/model
 * 
 * Source: cible/domain/steps/models/pictures_step_bean.py
 */

import { z } from 'zod';

export const PicturesStepApiSchema = z.object({
    uuid: z.string().uuid(),
    fsec_version_id: z.string().uuid(),
    last_updated: z.string().nullable(),
    comments: z.string().nullable(),
});

export const PicturesStepSchema = PicturesStepApiSchema.transform((api) => ({
    uuid: api.uuid,
    fsecVersionId: api.fsec_version_id,
    lastUpdated: api.last_updated ? new Date(api.last_updated) : null,
    comments: api.comments,
}));

export type PicturesStep = z.infer<typeof PicturesStepSchema>;

export const PicturesStepListSchema = z.array(PicturesStepApiSchema).transform((list) =>
    list.map((api) => PicturesStepSchema.parse(api))
);
