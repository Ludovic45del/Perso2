from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


class AccountController(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return JsonResponse(
            {
                "username": request.user.username,
                "groups": list(request.user.groups.values_list("name", flat=True)),
            }
        )
