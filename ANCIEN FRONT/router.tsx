import {lazy} from "react";
import {HomeScene} from "./scenes/home/Home.scene.tsx";
import {ErrorScene} from "./scenes/error/Error.scene.tsx";

export const routerConfig = [
    {
        path: '/',
        element: <HomeScene/>,
        errorElement: <ErrorScene/>,
        children: [{
            path: 'dashboard',
            Component: lazy(() => import('./scenes/dashboard/Dashboard.scene'))
        }, {
            path: 'campagnes',
            Component: lazy(() => import('./scenes/campaigns/Campaigns.scene.tsx'))
        }, {
            path: 'fsecs',
            Component: lazy(() => import('./scenes/fsecs/Fsecs.scene.tsx'))
        },
            {
                path: 'fsec-details/:versionUuid',
                Component: lazy(() => import('./scenes/fsecDetails/FsecDetails.scene.tsx')),
                children: [
                    {
                        path: 'overview',
                        Component: lazy(() => import('./scenes/fsecDetails/FsecDetailsTabs/FsecDetailsTabOverview/FsecDetailsTabOverview.scene.tsx'))
                    },
                    {
                        path: 'assemblage',
                        Component: lazy(() => import('./scenes/fsecDetails/FsecDetailsTabs/FsecDetailsTabAssemblage/FsecDetailsTabAssemblage.scene.tsx'))
                    },
                    {
                        path: 'metrologie',
                        Component: lazy(() => import('./scenes/fsecDetails/FsecDetailsTabs/FsecDetailsTabControleMetrologique/FsecDetailsTabControleMetrologique.scene.tsx'))
                    },
                    {
                        path: 'photo',
                        Component: lazy(() => import('./scenes/fsecDetails/FsecDetailsTabs/FsecDetailsTabVuePhoto/FsecDetailsTabVuePhoto.scene.tsx'))
                    },
                    {
                        path: 'alignement',
                        Component: lazy(() => import('./scenes/fsecDetails/FsecDetailsTabs/FsecDetailsTabAlignementLivraisonResultat/FsecDetailsTabAlignementLivraisonResultat.scene.tsx'))
                    },
                    {
                        path: 'permeation',
                        Component: lazy(() => import('./scenes/fsecDetails/FsecDetailsTabs/FsecDetailsTabPermeation.scene.tsx'))
                    },
                    {
                        path: 'remplissagebp',
                        Component: lazy(() => import('./scenes/fsecDetails/FsecDetailsTabs/FsecDetailsTabGasFillingLowPressure.scene.tsx'))
                    },
                    {
                        path: 'remplissagehp',
                        Component: lazy(() => import('./scenes/fsecDetails/FsecDetailsTabs/FsecDetailsTabGasFillingHighPressure.scene.tsx'))
                    },
                    {
                        path: 'depressurisation',
                        Component: lazy(() => import('./scenes/fsecDetails/FsecDetailsTabs/FsecDetailsTabDepressurization.scene.tsx'))
                    },
                    {
                        path: 'repressurisation',
                        Component: lazy(() => import('./scenes/fsecDetails/FsecDetailsTabs/FsecDetailsTabRepressurization.scene.tsx'))
                    },
                    {
                        path: 'etancheite',
                        Component: lazy(() => import('./scenes/fsecDetails/FsecDetailsTabs/FsecDetailsTabAirtightness.scene.tsx'))
                    },
                ]
            },
            {
                path: 'fa',
                Component: lazy(() => import('./scenes/errorsReport/ErrorReports.scene.tsx'))
            }, {
                path: 'indicateurs',
                Component: lazy(() => import('./scenes/indicators/Indicators.scene.tsx'))
            }, {
                path: 'planning',
                Component: lazy(() => import('./scenes/schedule/Schedule.scene.tsx'))
            }, {
                path: 'stocks',
                Component: lazy(() => import('./scenes/stocks/stocks.scene.tsx')),
                children: [
                    {
                        path: 'structuring',
                        Component: lazy(() => import('./scenes/stocks/stocksTabs/structuringTab/StructuringTabMenu.scene.tsx')),
                        children: [
                            {
                                path: 'basic-structuring',
                                Component: lazy(() => import('./scenes/stocks/stocksTabs/structuringTab/subTabs/StructuringTab.scene.tsx')),
                            },
                            {
                                path: 'special-structuring',
                                Component: lazy(() => import('./scenes/stocks/stocksTabs/structuringTab/subTabs/SpecialStructuringTab.scene.tsx')),
                            },
                        ]
                    },
                    {
                        path: 'consumables',
                        Component: lazy(() => import('./scenes/stocks/stocksTabs/consumablesTab/ConsumablesTabMenu.scene.tsx')),
                        children: [
                            {
                                path: 'glues',
                                Component: lazy(() => import('./scenes/stocks/stocksTabs/consumablesTab/subTab/ConsumablesGluesTab.scene.tsx')),
                            },
                            {
                                path: 'other',
                                Component: lazy(() => import('./scenes/stocks/stocksTabs/consumablesTab/subTab/OtherConsumablesTab.scene.tsx')),
                            },
                        ]
                    },
                    {
                        path: 'inventory',
                        Component: lazy(() => import('./scenes/stocks/stocksTabs/inventoryTab/InventoryTabMenu.scene.tsx')),
                        children: [
                            {
                                path: 'basic-parts-catalog',
                                Component: lazy(() => import('./scenes/stocks/stocksTabs/inventoryTab/subTabs/InventoryBasicPartsCatalogTab.scene.tsx')),
                            },
                            {
                                path: 'ec-structuring',
                                Component: lazy(() => import('./scenes/stocks/stocksTabs/inventoryTab/subTabs/InventoryEcStructuringTab.scene.tsx')),
                            },
                            {
                                path: 'lmj',
                                Component: lazy(() => import('./scenes/stocks/stocksTabs/inventoryTab/subTabs/InventoryLmjTab.scene.tsx')),
                            },
                            {
                                path: 'omega',
                                Component: lazy(() => import('./scenes/stocks/stocksTabs/inventoryTab/subTabs/InventoryOmegaTab.scene.tsx')),
                            }
                        ]
                    },
                    {
                        path: 'transfers',
                        Component: lazy(() => import('./scenes/stocks/stocksTabs/transfersTab/TransfersTab.scene.tsx'))
                    },
                ]
            }, {
                path: 'campagne-details/:campaignName',
                Component: lazy(() => import('./scenes/campaignDetails/CampaignDetails.scene.tsx')),
                children: [
                    {
                        path: 'overview',
                        Component: lazy(() => import('./scenes/campaignDetails/CampaignDetailsTabs/CampaignDetailsTabOverview/CampaignDetailsTabOverview.scene.tsx'))
                    },
                    {
                        path: 'assemblage',
                        Component: lazy(() => import('./scenes/campaignDetails/CampaignDetailsTabs/CampaignDetailsTabAssemblage/CampaignDetailsTabAssemblage.scene.tsx'))
                    },
                    {
                        path: 'fa',
                        Component: lazy(() => import('./scenes/campaignDetails/CampaignDetailsTabs/CampaignDetailsTabFA/CampaignDetailsTabFA.scene.tsx'))
                    },
                    {
                        path: 'fsec',
                        Component: lazy(() => import('./scenes/campaignDetails/CampaignDetailsTabs/CampaignDetailsTabFSEC/CampaignDetailsTabFSEC.scene.tsx'))
                    },
                    {
                        path: 'fichiers-pals',
                        Component: lazy(() => import('./scenes/campaignDetails/CampaignDetailsTabs/CampaignDetailsTabFichiersPALS/CampaignDetailsTabFichiersPALS.scene.tsx'))
                    },
                    {
                        path: 'metrologie',
                        Component: lazy(() => import('./scenes/campaignDetails/CampaignDetailsTabs/CampaignDetailsTabMetrologie/CampaignDetailsTabMetrologie.scene.tsx'))
                    },
                    {
                        path: 'documentaire',
                        Component: lazy(() => import('./scenes/campaignDetails/CampaignDetailsTabs/CampaignDetailsTabDocumentaire/CampaignDetailsTabDocumentaire.scene.tsx'))
                    },
                    {
                        path: 'cao',
                        Component: lazy(() => import('./scenes/campaignDetails/CampaignDetailsTabs/CampaignDetailsTabCAO/CampaignDetailsTabCAO.scene.tsx'))
                    },
                    {
                        path: 'transport',
                        Component: lazy(() => import('./scenes/campaignDetails/CampaignDetailsTabs/CampaignDetailsTabTransport/CampaignDetailsTabTransport.scene.tsx'))
                    },
                ]
            },
        ],
    }, {
        path: '/login',
        Component: lazy(() => import('./scenes/login/login')),
    },

];