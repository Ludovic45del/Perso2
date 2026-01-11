import {RegisterOptions} from "react-hook-form";
import FsecActiveModel from "../../../core/domain/fsec/FsecActive.model.ts";
import FsecAssemblyStepModel from "../../../core/domain/fsec/steps/FsecAssemblyStep.model.ts";

export const fsecNameValidation = {
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

export const fsecCampaignValidation = {
    required: {
        value: true,
        message: 'Veuillez sélectionner une campagne'
    }
};

export const fsecCategoryValidation = {
    required: {
        value: true,
        message: 'Veuillez sélectionner une catégorie'
    }
};

export const fsecDescriptionValidation = {
    maxLength: {
        value: 4000,
        message: 'La description saisie est trop longue, 4000 caractères maximun'
    }
};


export const fsecAssemblyStartDateValidation: RegisterOptions<FsecActiveModel> =
    {
        validate: {
            startDateBeforeEnd: (_, formValues) => (
                    formValues.assemblyStep.startDate === null
                    || formValues.assemblyStep.endDate === null
                    || !formValues.assemblyStep.endDate?.isValid()
                    || formValues.assemblyStep.startDate?.isBefore(formValues.assemblyStep.endDate)
                    || formValues.assemblyStep.startDate?.isSame(formValues.assemblyStep.endDate))
                || 'Doit être inférieure à celle de fin'
        }
    };

export const fsecAssemblyEndDateValidation: RegisterOptions<FsecActiveModel> =
    {
        validate: {
            endDateAfterStart: (_, formValues) => (
                    formValues.assemblyStep.startDate === null
                    || formValues.assemblyStep.endDate === null
                    || !formValues.assemblyStep.startDate?.isValid()
                    || formValues.assemblyStep.endDate?.isAfter(formValues.assemblyStep.startDate)
                    || formValues.assemblyStep.endDate?.isSame(formValues.assemblyStep.startDate))
                || 'Doit être supérieure à celle de début'
        }
    };

export const fsecAssemblyWorkflowStartDateValidation: RegisterOptions<FsecAssemblyStepModel> =
    {
        validate: {
            startDateBeforeEnd: (_, formValues) => (
                    formValues.startDate === null
                    || formValues.endDate === null
                    || !formValues.endDate?.isValid()
                    || formValues.startDate?.isBefore(formValues.endDate)
                    || formValues.startDate?.isSame(formValues.endDate))
                || 'Doit être inférieure à celle de fin'
        }
    };

export const fsecAssemblyWorkflowSEndDateValidation: RegisterOptions<FsecAssemblyStepModel> =
    {
        validate: {
            endDateAfterStart: (_, formValues) => (
                    formValues.startDate === null
                    || formValues.endDate === null
                    || !formValues.startDate?.isValid()
                    || formValues.endDate?.isAfter(formValues.startDate)
                    || formValues.endDate?.isSame(formValues.startDate))
                || 'Doit être supérieure à celle de début'
        }
    };