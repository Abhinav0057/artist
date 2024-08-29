from django.shortcuts import render
from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializer import *
from rest_framework import status
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.


class CreateUser(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        data = request.data
        serializer = CreateUserSerializer(data=data)
        try:
            if serializer.is_valid():
                new_user = serializer.save()
                new_user.set_password(request.data["password"])
                new_user.save()
                data_ = []
                message = "Successfully Created host"
                status_code = status.HTTP_200_OK
            else:
                data_ = serializer.errors
                message = "There was an error"
                status_code = status.HTTP_400_BAD_REQUEST    
        except Exception as e:
            data_ = str(e)
            message = "Failed to create"
            status_code = status.HTTP_400_BAD_REQUEST
        res = {"data": data_, "message": message, "status": status_code}
        return Response(res, status=status_code)
        

class LoginUser(TokenObtainPairView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            return Response({
                "token": response.data.get("access"),
                "refresh_token": response.data.get("refresh"),
                "message": "Login successful"
            }, status=status.HTTP_200_OK)
        return response

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = CreateUserSerializer(user)
        return Response(serializer.data)