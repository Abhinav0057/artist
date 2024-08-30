from django.shortcuts import render
from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializer import *
from rest_framework import status
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.db import connection
import datetime
from .utils import dictFromQuery
from  artistbackend.pagination import MycustomPagination




# Create your views here.


class CreateUser(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        data = request.data
        serializer = CreateUserSerializer(data=data)
        try:
            if serializer.is_valid():
                # new_user = serializer.save()
                # new_user.set_password(request.data["password"])
                # new_user.save()
                # using raw query instead of ORM
                now = datetime.datetime.now()
                password = make_password(data['password'])
                cursor = connection.cursor()
                query = 'insert into user (email, password, dob,role_type,is_superuser,is_staff,is_active, first_name, last_name, address, phone, gender,created_at, updated_at,is_active) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);'
                cursor.execute(query,[data["email"], str(password),data["dob"], 'artist',"0","0","1",data["first_name"],data["last_name"],data["address"],data["phone"],data["gender"],str(now),str(now),'1'])
                data_ = serializer.data
                message = "Successfully Created host"
                status_code = status.HTTP_201_CREATED
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
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        cursor = connection.cursor()
        cursor.execute("select id, email, role_type, first_name, last_name, phone, dob,gender,address, is_superuser from user where id=%s and is_active=1 ",[str(request.user.id),])
        data = dictFromQuery(cursor)
        res = {"data": data, "message": 'Fetched Successfully', "status": status.HTTP_200_OK}
        return Response(res, status=status.HTTP_200_OK)
        
class GetUserList(APIView):
    permission_classes=(IsAuthenticated,)
    
    def get(self,request):
        try:
            if  request.user.role_type == 'super_admin' or request.user.role_type=='artist_manager':
                paginator = MycustomPagination()
                page = paginator.page_query_param
                page_size = paginator.get_page_size(request)
                offset = paginator.get_offset(request)
                cursor = connection.cursor()
                if  request.user.role_type == 'super_admin':
                    cursor.execute("SELECT COUNT(*) FROM user ")
                    #  total-1(Self)
                    total_count = cursor.fetchone()[0]-1 
                    
                    cursor.execute("""
                            select id, email, role_type, first_name, last_name, phone, dob,gender,address from user where is_active=1 and  id!=%s
                            order BY id asc
                            limit %s offset %s
                        """, [request.user.id,page_size, offset])
                else:
                    cursor.execute("SELECT COUNT(*) FROM user where role_type in ('artist manager','artist') ")
                    #  total-1(Self)
                    total_count = cursor.fetchone()[0]-1 
                    
                    cursor.execute("""
                            select id, email, role_type, first_name, last_name, phone, dob,gender,address from user where is_active=1 and  id!=%s and role_type in ('artist manager','artist')
                            order BY id asc
                            limit %s offset %s
                        """, [request.user.id,page_size, offset])
                    
                # users = cursor.fetchall()
                users=dictFromQuery(cursor)
                response_data = paginator.get_paginated_data(users,offset,total_count)
                return Response({"message":"Fetched Successfully","data":response_data,"status": status.HTTP_200_OK})
            else:
                return Response({"message": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            print(e)
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
			
class RegisterUser(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self,request):
        data = request.data
        try:
            serializer = CreateUserSerializer(data=data)
            if serializer.is_valid():
                now = datetime.datetime.now()
                password = make_password(data['password'])
                cursor = connection.cursor()
                query = 'insert into user (email, password, dob,role_type,is_superuser,is_staff,is_active, first_name, last_name, address, phone, gender,created_at, updated_at,is_active) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);'
                cursor.execute(query,[data["email"], str(password),data["dob"], data["role_type"],"0","0","1",data["first_name"],data["last_name"],data["address"],data["phone"],data["gender"],str(now),str(now),'1'])
                data_ = serializer.data
                message = "Successfully Created host"
                status_code = status.HTTP_201_CREATED
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
    

class EditUser(APIView):
    def post(self,request, pk):
        if request.user.role_type == 'super_admin':
            users = User.objects.get(id=pk)
            # note: we donot need serializers as later i shall validate with custom validations
            serilizer= CreateUserSerializer(users,data = request.data, partial=True)
            if serilizer.is_valid():
                data = request.data
                cursor = connection.cursor()
                user_query = 'update user set first_name=%s,last_name=%s,dob=%s,gender=%s,phone=%s,address=%s where id =%s' ;     
                cursor.execute(user_query,[data['first_name'],data["last_name"],data["dob"],data["gender"],data["phone"],data["address"],str(pk)] )
                return Response({"message":"Data updated successfully","data":[]},status=status.HTTP_200_OK)
            else:
                return Response({"data":serilizer.errors},status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
            
            
class DeleteUser(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self,request,pk):
        if request.user.role_type == 'super_admin':
            cursor = connection.cursor()
            cursor.execute('DELETE FROM music WHERE id IN (SELECT m.id FROM music m INNER JOIN artist a ON a.id=m.artist_id INNER JOIN user u ON u.id=a.user_id WHERE u.id = %s)', (pk,))
            cursor.execute('DELETE FROM music WHERE id IN (SELECT m.id FROM music m INNER JOIN artist a ON a.id=m.artist_id INNER JOIN user u ON u.id=a.user_id WHERE u.id = %s)', (pk,))
            cursor.execute('DELETE FROM user WHERE id = %s', (pk,))
            return Response({"message":"Data deleted successfully"},status=status.HTTP_200_OK)

        else:
            return Response({"message": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
