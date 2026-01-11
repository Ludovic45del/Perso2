/**
 * Campaign Zod Schema - Validation & Transformation
 * @module entities/campaign/model
 * 
 * Source of Truth: cible/domain/campaign/models/campaign_bean.py
 * API Format: snake_case → Domain Format: camelCase
 */

import { z } from 'zod';

/**
 * Raw API response schema (snake_case from Backend)
 */
export const CampaignApiSchema = z.object({
    uuid: z.string().uuid(),
    type_id: z.number().int().nullable(),
    status_id: z.number().int().nullable(),
    installation_id: z.number().int().nullable(),
    name: z.string().min(1),
    year: z.number().int(),
    semester: z.string(),
    last_updated: z.string().nullable(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    dtri_number: z.number().int().nullable(),
    description: z.string().nullable(),
});

/**
 * Domain schema with camelCase transformation
 */
export const CampaignSchema = CampaignApiSchema.transform((api) => ({
    uuid: api.uuid,
    typeId: api.type_id,
    statusId: api.status_id,
    installationId: api.installation_id,
    name: api.name,
    year: api.year,
    semester: api.semester,
    lastUpdated: api.last_updated ? new Date(api.last_updated) : null,
    startDate: api.start_date ? new Date(api.start_date) : null,
    endDate: api.end_date ? new Date(api.end_date) : null,
    dtriNumber: api.dtri_number,
    description: api.description,
}));

export type Campaign = z.infer<typeof CampaignSchema>;
export type CampaignApi = z.input<typeof CampaignSchema>;

/**
 * Schema for campaign list response
 */
export const CampaignListSchema = z.array(CampaignApiSchema).transform((list) =>
    list.map((api) => CampaignSchema.parse(api))
);

/**
 * Schema for creating a campaign (input to API)
 */
export const CampaignCreateSchema = z.object({
    name: z.string().min(1, 'Le nom est requis'),
    year: z.number().int().min(2000).max(2100),
    semester: z.enum(['S1', 'S2'], { required_error: 'Semestre requis' }),
    typeId: z.number().int({ message: 'Type requis' }),
    installationId: z.number().int({ message: 'Installation requise' }),
    statusId: z.number().int().nullable().optional(),
    startDate: z.date().nullable().optional(),
    endDate: z.date().nullable().optional(),
    dtriNumber: z.number().int().nullable().optional(),
    description: z.string().nullable().optional(),
    // Team members (optional)
    moe: z.string().optional(),
    rce: z.string().optional(),
    iec: z.string().optional(),
});

export type CampaignCreate = z.infer<typeof CampaignCreateSchema>;

/**
 * Transform CampaignCreate to API format (camelCase → snake_case)
 */
export function campaignCreateToApi(data: CampaignCreate): Record<string, unknown> {
    return {
        name: data.name,
        year: data.year,
        semester: data.semester,
        type_id: data.typeId,
        status_id: data.statusId ?? 0, // Default to "Brouillon" (ID 0)
        installation_id: data.installationId,
        start_date: data.startDate?.toISOString().split('T')[0] ?? null,
        end_date: data.endDate?.toISOString().split('T')[0] ?? null,
        dtri_number: data.dtriNumber ?? null,
        description: data.description ?? null,
    };
}
