from django.urls import include, path

from cible.api import account_controller

urlpatterns = [
    path(
        "account",
        account_controller.AccountController.as_view(),
        name="account",
    ),
    path("campaign/", include("cible.api.campaign.urls")),
    path("fsec/", include("cible.api.fsec.urls")),
    path("stocks/", include("cible.api.stock.urls")),
]
