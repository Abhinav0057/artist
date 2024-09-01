from django.shortcuts import render
from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializer import *
from rest_framework import status
from rest_framework.response import Response

from user.utils import dictFromQuery,register_user
from  artistbackend.pagination import MycustomPagination
from user.permissions import *
from django.db import connection
import datetime
from django.db import connection


# Create your views here.

class CreateArtist(APIView):
    permission_classes=(IsAuthenticated,IsArtistManager,)
    def post(self,request):
        data=request.data
        serilizer= CreateArtistSerializer(data = request.data)
        if serilizer.is_valid():
            data["role_type"]="artist"
            user_id=register_user(data)
            cursor = connection.cursor()
            now = datetime.datetime.now()
            name = data['first_name'] + ' ' +  data['last_name']
            cursor.execute('insert into artist (name, first_release_year, no_of_albums_released, user_id, created_at, updated_at) values (%s,%s,%s,%s,%s,%s)',[name,data["first_release_year"],data["no_of_albums_released"],str(user_id),str(now),str(now)])
            return Response({"message":"Data updated successfully","data":[]},status=status.HTTP_201_CREATED)  
        else:
            return Response({"data":serilizer.errors},status=status.HTTP_400_BAD_REQUEST)
        
class GetArtistList(APIView):
    permission_classes=(IsAuthenticated,IsSuperAdmin|IsArtistManager,)
    def get(self,request):
            paginator = MycustomPagination()
            page = paginator.page_query_param
            page_size = paginator.get_page_size(request)
            offset = paginator.get_offset(request)
            cursor = connection.cursor()
            cursor.execute("SELECT COUNT(*) FROM artist ")
            total_count = cursor.fetchone()[0]     
            query = "select a.id as id, a.name as name, u.dob ,a.first_release_year , a.no_of_albums_released, u.id as user_id, u.email , u.gender , u.address, u.phone from artist a join user u on a.user_id=u.id limit %s offset %s;"
            cursor.execute(query,[page_size,offset])
            data = dictFromQuery(cursor)
            response_data = paginator.get_paginated_data(data,offset,total_count)
            return Response({"message":"Fetched Successfully","data":response_data,"status": status.HTTP_200_OK})


class UpdateArtist(APIView):
	permission_classes = (permissions.IsAuthenticated,IsArtistManager)

	def post(self,request, pk):
		# if request.user.role_type == 'super admin':
		data = request.data
		serilizer= ArtistUpdateSerializer(data = request.data)
		if serilizer.is_valid():
			now = datetime.datetime.now()
			cursor = connection.cursor()
			artist_query = 'select * from artist where id=%s'
			cursor.execute(artist_query,[pk])
			user = dictFromQuery(cursor)[0]
			name = data['first_name'] + ' ' +  data['last_name']
			user_id = user.user_id
			cursor.execute('update artist set name=%s,first_release_year=%s,no_of_albums_releases=%s,updated_at=%s where id=%s',[name,data["first_release_year"],data["no_of_albums_releases"],str(now),str(pk)])
			cursor.execute('update user set first_name=%s,last_name=%s,dob=%s,gender=%s,phone=%s,address=%s,updated_at=%s where id =%s',[data['first_name'],data["last_name"],data["dob"],data["gender"],data["phone"],data["address"],str(now),str(user_id)])
			return Response({"message":"Data updated successfully"},status=status.HTTP_200_OK)
		else:
			return Response({"data":serilizer.errors},status=status.HTTP_400_BAD_REQUEST)

class DeleteArtist(APIView):
	permission_classes = (permissions.IsAuthenticated,IsArtistManager)
	def post(self,request):
		artist_id = request.data["id"]
		cursor = connection.cursor()
		query = "Delete from music where artist_id="+str(artist_id)+";"
		cursor.execute(query)
		query = "Delete from artist where id="+str(artist_id)+";"
		
		cursor.execute(query)
		return Response({"message":"Data deleted successfully"},status=status.HTTP_200_OK)



class GetSongsList(APIView):
	permission_classes = (permissions.IsAuthenticated,IsSuperAdmin|IsArtistManager)

	def get(self,request, pk):
		query = 'select * from music where artist_id ='+str(pk)+';'
		cursor = connection.cursor()
		cursor.execute(query)
		data = dictFromQuery(cursor)
		return Response({"data":data},status=status.HTTP_200_OK)

class CreateSong(APIView):
	permission_classes = (permissions.IsAuthenticated,IsArtist)

	def post(self,request):
		data = request.data
		serilizer= CreateSongSerializer(data = request.data)
		if serilizer.is_valid():
			now = datetime.datetime.now()
			cursor = connection.cursor()
			artist = "select * from artist where user_id= %s"
			cursor.execute(artist,[request.user.id])
			# data = cursor.fetchone()
			artist_data = dictFromQuery(cursor)
			artist_id = artist_data[0].id
			query = 'INSERT INTO music (title,genre,album_name, artist_id, created_at,updated_at) VALUES( "%s,%s,%s,%s,%s,%s");'
			cursor.execute(query,[data["title"],data["genre"],data["album_name"],str(artist_id),+str(now),str(now)])
            
			return Response({"message":"Music Added successfully"},status=status.HTTP_200_OK)
		else:
			return Response({"data":serilizer.errors},status=status.HTTP_400_BAD_REQUEST)

class UpdateSong(APIView):
	permission_classes = (permissions.IsAuthenticated,)

	def post(self,request, pk):
		data = request.data
		now = datetime.datetime.now()
		serilizer= CreateSongSerializer(data = request.data)
		if serilizer.is_valid():
			cursor = connection.cursor()
			cursor.execute('update music set title=%s,album_name=%s,genre=%s,updated_at=%s where id=%s;',[data["title"],data["album_name"],data["genre"],str(now),str(pk)])
			return Response({"message":"Data updated successfully"},status=status.HTTP_200_OK)
		else:
			return Response({"data":serilizer.errors},status=status.HTTP_400_BAD_REQUEST)


class DeleteSong(APIView):
    permission_classes = (permissions.IsAuthenticated,IsArtist)
    def post(self,request):
        music_id = request.data["music_id"]
        cursor=connection.cursor()
        query = "SELECT COUNT(*) FROM  music m left join artist a on a.id=m.artist_id where a.id=%s and  m.id=%s"
        
        cursor.execute(query, [request.user.id,music_id])
        count = cursor.fetchone()[0]
        if count > 0:
            query = "Delete from music where id= %s"
            cursor = connection.cursor()
            cursor.execute(query,[music_id])
        else:
            return Response({"message":"You are not authorized to peform this "},status=status.HTTP_403_FORBIDDEN)
        return Response({"message":"Data deleted successfully"},status=status.HTTP_200_OK)


