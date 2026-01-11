import {Modal, Stack, ThemeProvider} from '@mui/material';
import React, {ReactNode, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import StepperComponent, {StepModal} from './stepper/StepperComponent.tsx';
import Button from '@mui/material/Button';
import {ArrowBackOutlined, ArrowForwardOutlined, SaveOutlined} from '@mui/icons-material';
import {getModalTheme, styleModalBox} from '../../data/ModalTheme.ts';
import {FieldValues, Form, FormProvider, SubmitHandler, useForm, UseFormGetValues} from 'react-hook-form';
import {useSnackBarContext} from '../../scenes/home/Home.scene.tsx';
import ModalTitle from "./ModalTitle.tsx";
import {useNavigate, useParams} from "react-router-dom";
import SaveConfirmationModal from "./SaveConfirmationModal.tsx";
import SaveWarningModal from "./SaveWarningModal.tsx";
import ChangeWorkflowStepModal from "./ChangeWorkflowStepModal.tsx";

export interface ModalContent {
    step: StepModal,
    component?: ReactNode,
    isStepCompleted?: (getValues: UseFormGetValues<any>) => boolean
}

interface CreationModalProps {
    title: string,
    content: ModalContent[],
    isFormModalOpen: boolean,
    closeFormModal: () => void,
    closeModalForWorkflowChange?: (type: string) => void,
    handleUpdate?: (object?: any) => void,
    saveMethod: (object: any, uuid?: any) => Promise<any>,
    defaultValueForm: any,
    titleWarningModal: string
    messageWarningModal: string,
    buttonLabelWarningModal: string,
    saveConfirmation?: string,
    saveNav?: string,
    openStep?: number
    isWorkflowReturnModal?: boolean
    depressurizationFailed?: boolean
}

export default function FormModal(props: CreationModalProps) {
    const {openSnackbar} = useSnackBarContext();
    const nav = useNavigate();
    const navTo = (id: string) => {
        nav(props.saveNav.replace('value', id));
    };
    const {versionUuid} = useParams<{ versionUuid: string }>();

    const methods = useForm<any>({
        defaultValues: props.defaultValueForm,
        mode: 'onChange',
    });

    const [activeStep, setActiveStep] = useState(props.openStep || 0);
    const [lastRequiredStep, setLastRequiredStep] = useState(-1);
    const [completedSteps, setCompletedSteps] = React.useState<{
        [key: number]: boolean;
    }>({});
    const [isSaveWarningModalOpen, setIsSaveWarningModalOpen] = useState(false);
    const [isSaveConfirmationModalOpen, setIsSaveConfirmationModalOpen] = useState(false);
    const [isSaveComplete, setIsSaveComplete] = useState<boolean>(false);
    const [isChangeWorkflowAssemblyStepModalOpen, setIsChangeWorkflowAssemblyStepModalOpen] = useState(false);
    const [isChangeWorkflowReassemblyStepModalOpen, setIsChangeWorkflowReassemblyStepModalOpen] = useState(false);
    const [isChangeWorkflowMetrologyStepModalOpen, setIsChangeWorkflowMetrologyStepModalOpen] = useState(false);
    const [isChangeWorkflowPressurizationStepModalOpen, setIsChangeWorkflowPresurizationStepModalOpen] = useState(false);

    const nbStepsDisabled = props.content.filter(content => content.step.isDisabled).length;

    useEffect(() => {
        for (let i = props.content.length - 1; i >= 0; i--) {
            if (props.content[i].step.required) {
                setLastRequiredStep(i);
                break;
            }
        }
    }, [props.content]);

    useEffect(function initStepCompleted() {
        const stepsCompleted: { [key: number]: boolean } = {};
        props.content.forEach((step, index) =>
            stepsCompleted[index] = step.isStepCompleted ? step.isStepCompleted(methods.getValues) : false);
        setCompletedSteps(stepsCompleted);
    }, [methods.getValues, props.content]);


    const handleComplete = (stepToGo: number) => {
        const newCompleted = {...completedSteps};
        newCompleted[activeStep] = true;
        const {isStepCompleted} = props.content[activeStep];
        newCompleted[activeStep] = isStepCompleted ? isStepCompleted(methods.getValues) : false;
        setCompletedSteps(newCompleted);
        setActiveStep(stepToGo);
    };


    function handleSaveWarningClose(reason?: ('saveButton' | 'cancelButton' | 'quitButton')) {
        if (reason === 'quitButton') {
            resetForm();
            props.closeFormModal();
        }
        setIsSaveWarningModalOpen(false);
    }

    function handleSaveConfirmationClose(reason?: ('saveButton' | 'cancelButton' | 'quitButton')) {
        if (reason === 'saveButton') {
            resetForm();
            props.closeFormModal();
        }
        setIsSaveConfirmationModalOpen(false);
    }

    function handleFormClose() {
        if (JSON.stringify(props.defaultValueForm) === JSON.stringify(methods.getValues())) {
            props.closeFormModal();
            resetForm();
        } else {
            setIsSaveWarningModalOpen(true);
        }
    }

    function handleFormSave() {
        if (props.saveConfirmation) {
            setIsSaveConfirmationModalOpen(true)
        } else {
            onSubmit(methods.getValues())
        }
    }

    function resetForm() {
        methods.reset(props.defaultValueForm);
        setActiveStep(0);
        setCompletedSteps({});
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsSaveComplete(true)
        if (props.isWorkflowReturnModal) {
            props.saveMethod(data, versionUuid).then((response: any) => {
                if (props.saveNav) {
                    if (response.uuid) {
                        navTo(response.uuid)
                    } else if (response.versionUuid) {
                        navTo(response.versionUuid)
                    }
                } else {
                    props.handleUpdate(response);
                }
                props.closeFormModal();
                resetForm();
                openSnackbar('Enregistré avec succès', 'success');
                setIsSaveComplete(false)
            }).catch(responseError => {
                responseError.json().then((json: any) => {
                    openSnackbar(json.message, 'error');
                });
                setIsSaveComplete(false)
            });

        } else {
            props.saveMethod(data).then((response: any) => {
                if (props.saveNav) {
                    if (response.uuid) {
                        navTo(response.uuid)
                    } else if (response.versionUuid) {
                        navTo(response.versionUuid)
                    }
                } else {
                    props.handleUpdate(response);
                }
                props.closeFormModal();
                resetForm();
                openSnackbar('Enregistré avec succès', 'success');
                setIsSaveComplete(false)
            }).catch(responseError => {
                responseError.json().then((json: any) => {
                    openSnackbar(json.message, 'error');
                });
                setIsSaveComplete(false)
            });
        }

    };

    return <Modal
        open={props.isFormModalOpen}
        onClose={() => handleFormClose()}
        id='modal'
    >
        <Box sx={styleModalBox} height="85vh">
            <ModalTitle title={props.title}
                        close={handleFormClose}
                        iconId="close-icon-formmodal-testid"/>
            <StepperComponent steps={props.content.map(content => content.step)}
                              activeStep={activeStep}
                              completedSteps={completedSteps}
                              onClick={(stepIndex: number) => methods.trigger().then((isValid) => {
                                  if (isValid) handleComplete(stepIndex);
                              })}
                              depressurizationFailed={props.depressurizationFailed}/>

            <FormProvider {...methods}>
                <Form style={{height: '80%', display: 'flex', flexDirection: 'column', flexGrow: 1}}
                      noValidate>
                    <Box display="flex" width="95%" marginX="auto" paddingTop="3vh" overflow="auto"
                         style={{flexGrow: 1, marginBottom: "0.5em",}}>
                        <ThemeProvider theme={getModalTheme()}>
                            {props.content[activeStep]?.component ?? <>Error component not found</>}
                        </ThemeProvider>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: "flex-end"}}>
                        <Stack width={'50%'} direction="row" justifyContent="flex-start"
                               spacing={{xs: 1, sm: 2, md: 4}}>
                            {props?.content[activeStep].step?.hasWorkflowButtons?.showAssemblyButton &&
                                <Button onClick={() => {
                                    setIsChangeWorkflowAssemblyStepModalOpen(true)
                                }}>
                                    Revenir à l'Assemblage
                                </Button>}
                            {props?.content[activeStep].step?.hasWorkflowButtons?.showReassemblyButton &&
                                <Button onClick={() => {
                                    setIsChangeWorkflowReassemblyStepModalOpen(true)
                                }}>
                                    Réassemblage
                                </Button>}
                            {props?.content[activeStep].step?.hasWorkflowButtons?.showMetrologyButton &&
                                <Button onClick={() => {
                                    setIsChangeWorkflowMetrologyStepModalOpen(true)
                                }}>
                                    Revenir à la Métrologie
                                </Button>}
                            {props?.content[activeStep].step?.hasWorkflowButtons?.showPressurizationButton &&
                                <Button onClick={() => {
                                    setIsChangeWorkflowPresurizationStepModalOpen(true)
                                }}>
                                    Repressurisation
                                </Button>}
                        </Stack>
                        <Stack width={'50%'} direction="row" justifyContent="flex-end" spacing={{xs: 1, sm: 2, md: 4}}>
                            {(lastRequiredStep === -1 || lastRequiredStep <= activeStep) &&
                                <Button disabled={isSaveComplete} startIcon={<SaveOutlined/>}
                                        onClick={methods.handleSubmit(handleFormSave)}>
                                    Sauvegarder et quitter
                                </Button>}
                            <Button startIcon={<ArrowBackOutlined/>}
                                    onClick={() => methods.trigger().then((isValid) => {
                                        if (isValid) handleComplete(activeStep - 1);
                                    })}
                                    sx={{
                                        display: activeStep === 0
                                            ? {xs: 'none', xl: 'none'}
                                            : {xs: 'inherit', xl: 'inherit'}
                                    }}>
                                Précédent
                            </Button>
                            <Button startIcon={<ArrowForwardOutlined/>}
                                    onClick={() => methods.trigger().then((isValid) => {
                                        if (isValid) handleComplete(activeStep + 1);
                                    })}
                                    sx={{
                                        display: activeStep >= props.content.length - (1 + nbStepsDisabled)
                                            ? {xs: 'none', xl: 'none'}
                                            : {xs: 'inherit', xl: 'inherit'}
                                    }}>
                                Suivant
                            </Button>
                        </Stack>
                    </Box>
                    <SaveWarningModal isOpen={isSaveWarningModalOpen}
                                      handleClose={handleSaveWarningClose}
                                      onSubmit={onSubmit}
                                      title={props.titleWarningModal}
                                      message={props.messageWarningModal}
                                      buttonLabel={props.buttonLabelWarningModal}/>
                    {props.saveConfirmation && <SaveConfirmationModal isOpen={isSaveConfirmationModalOpen}
                                                                      handleClose={handleSaveConfirmationClose}
                                                                      onSubmit={onSubmit}
                                                                      title={props.titleWarningModal}
                                                                      message={props.saveConfirmation}
                                                                      buttonLabel={props.buttonLabelWarningModal}/>}
                    <ChangeWorkflowStepModal isOpen={isChangeWorkflowAssemblyStepModalOpen} onSubmit={() => {
                        props.closeModalForWorkflowChange('Assembly')
                        props.closeFormModal();
                    }} handleClose={() => {
                        setIsChangeWorkflowAssemblyStepModalOpen(false)
                    }} title={'Changement d\'étape'} message={'Confirmez-vous le retour à l\'Assemblage ?'}
                                             buttonLabel={'Confirmer'}/>
                    <ChangeWorkflowStepModal isOpen={isChangeWorkflowMetrologyStepModalOpen} onSubmit={() => {
                        props.closeModalForWorkflowChange('Metrology')
                        props.closeFormModal();
                    }} handleClose={() => {
                        setIsChangeWorkflowMetrologyStepModalOpen(false)
                    }} title={'Changement d\'étape'} message={'Confirmez-vous le retour à la Métrologie ?'}
                                             buttonLabel={'Confirmer'}/>
                    <ChangeWorkflowStepModal isOpen={isChangeWorkflowPressurizationStepModalOpen} onSubmit={() => {
                        props.closeModalForWorkflowChange('Repressurization')
                        props.closeFormModal();
                    }} handleClose={() => {
                        setIsChangeWorkflowPresurizationStepModalOpen(false)
                    }} title={'Changement d\'étape'} message={'Confirmez-vous le retour à la Repressurisation ?'}
                                             buttonLabel={'Confirmer'}/>
                    <ChangeWorkflowStepModal isOpen={isChangeWorkflowReassemblyStepModalOpen} onSubmit={() => {
                        props.closeModalForWorkflowChange('Reassembly')
                        props.closeFormModal();
                    }} handleClose={() => {
                        setIsChangeWorkflowReassemblyStepModalOpen(false)
                    }} title={'Changement d\'étape'} message={'Confirmez-vous le Réassemblage ?'}
                                             buttonLabel={'Confirmer'}/>
                </Form>
            </FormProvider>
        </Box>
    </Modal>;
}



