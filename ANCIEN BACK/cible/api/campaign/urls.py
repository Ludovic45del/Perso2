from django.urls import path

from cible.api.campaign import (
    campaign_controller,
    campaign_document_controller,
    campaign_installation_controller,
    campaign_role_controller,
    campaign_status_controller,
    campaign_team_controller,
    campaign_type_controller,
)

urlpatterns = [
    path(
        "",
        campaign_controller.CampaignController.as_view(
            {
                "get": "get_all_campaigns",
                "post": "create_campaign",
                "put": "update_campaign",
            }
        ),
        name="campaign_view",
    ),
    path(
        "type",
        campaign_type_controller.CampaignTypeController.as_view(
            {"get": "get_campaign_types"}
        ),
        name="campaign_types_view",
    ),
    path(
        "status",
        campaign_status_controller.CampaignStatusController.as_view(
            {"get": "get_campaign_status"}
        ),
        name="campaign_status_view",
    ),
    path(
        "installation",
        campaign_installation_controller.CampaignInstallationController.as_view(
            {"get": "get_campaign_installations"}
        ),
        name="campaign_installation_view",
    ),
    path(
        "documents/type",
        campaign_document_controller.CampaignDocumentController.as_view(
            {"get": "get_campaign_documents_type"}
        ),
        name="campaign_documents_view",
    ),
    path(
        "documents/<str:campaign_name>",
        campaign_document_controller.CampaignDocumentController.as_view(
            {"get": "get_campaign_documents_by_campaign_name"}
        ),
        name="campaign_documents_view",
    ),
    path(
        "team/<str:campaign_uuid>",
        campaign_team_controller.CampaignTeamController.as_view(
            {"get": "get_campaign_team_by_campaign"}
        ),
        name="campaign_team_view",
    ),
    path(
        "roles",
        campaign_role_controller.CampaignRoleController.as_view(
            {"get": "get_campaign_roles"}
        ),
        name="campaign_roles_view",
    ),
    path(
        "delete/<uuid:uuid>",
        campaign_controller.CampaignController.as_view({"delete": "delete_campaign"}),
        name="campaign_delete_view",
    ),
    path(
        "<str:campaign_name>",
        campaign_controller.CampaignController.as_view({"get": "get_campaign_by_name"}),
        name="campaign_view",
    ),
]
