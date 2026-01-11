"""
URL Configuration for CIBLE project.
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("cible.api.urls")),  # Exposure of CIBLE API
]
