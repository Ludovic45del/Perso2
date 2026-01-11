import CampaignModel from "../../../core/domain/campaign/Campaign.model.ts";
import {RegisterOptions} from "react-hook-form";

export const campaignTypeValidation = {
    required: {
        message: 'Veuillez sélectionner un type',
        value: true
    }
};

export const campaignInstallationValidation = {
    required: {
        message: 'Veuillez sélectionner une installation',
        value: true
    }
};


export const campaignSemesterValidation = {
    required: {
        message: 'Veuillez sélectionner un semestre',
        value: true
    }
};

export const campaignDescriptionValidation = {
    maxLength: {
        value: 4000,
        message: 'La description saisie est trop longue, 4000 caractères maximun'
    }
};

export const campaignYearValidation= {
    required: {
        value: true,
        message: 'Veuillez saisir l\'année',
    },
    pattern: {
        value: /^[0-9]{4}$/,
        message: 'Veuillez saisir l\'année au format AAAA'
    }
};

export const campaignNameValidation = {
    required: {
        value: true,
        message: 'Veuillez saisir le nom',
    },
    pattern: {
        value: /^[A-Za-z0-9-_]+$/,
        message: 'Format incorrect'
    },
    maxLength: {
        value: 50,
        message: 'Le nom saisi est trop long (max 50 chars)'
    }
};

export const campaignStartDateValidation: RegisterOptions<CampaignModel> =
    {
        validate: {
            startDateBeforeEnd: (_, formValues) => (
                    formValues.startDate === null
                    || formValues.endDate === null
                    || !formValues.endDate.isValid()
                    || formValues.startDate?.isBefore(formValues.endDate))
                || 'Doit être inférieure à celle de fin'
        }
    };

export const campaignEndDateValidation: RegisterOptions<CampaignModel> =
    {
        validate: {
            endDateAfterStart: (_, formValues) => ((
                        formValues.startDate === null
                        || formValues.endDate === null
                        || !formValues.startDate.isValid)
                    || formValues.endDate?.isAfter(formValues.startDate))
                || 'Doit être supérieure à celle de début'
        }
    };
