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
from django.db import connection,transaction
from pathlib import Path
from django.http import HttpResponse, HttpResponseNotFound
import csv
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils.dateparse import parse_date
from django.contrib.auth.hashers import make_password
import io


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
			user_id = data['id']
			cursor.execute('update artist set name=%s,first_release_year=%s,no_of_albums_released=%s,updated_at=%s where id=%s',[name,data["first_release_year"],data["no_of_albums_released"],str(now),str(pk)])
			cursor.execute('update user set first_name=%s,last_name=%s,dob=%s,gender=%s,phone=%s,address=%s,updated_at=%s where id =%s',[data['first_name'],data["last_name"],data["dob"],data["gender"],data["phone"],data["address"],str(now),str(user_id)])
			return Response({"message":"Data updated successfully"},status=status.HTTP_200_OK)
		else:
			return Response({"data":serilizer.errors},status=status.HTTP_400_BAD_REQUEST)

class DeleteArtist(APIView):
	permission_classes = (permissions.IsAuthenticated,IsArtistManager)
	def post(self,request,pk):
		artist_id = pk
		cursor = connection.cursor()
		query = "Delete from music where artist_id= %s"
		cursor.execute(query,[pk])
		query = "Delete from artist where id= %s"
		cursor.execute(query,[pk])
		return Response({"message":"Data deleted successfully"},status=status.HTTP_200_OK)



class GetSongsList(APIView):
	permission_classes = (permissions.IsAuthenticated,IsSuperAdmin|IsArtistManager|IsArtist)

	def get(self,request, pk):
		cursor = connection.cursor()
		artist_query = 'select * from artist where user_id=%s'
		cursor.execute(artist_query,[pk])
		artist_id = dictFromQuery(cursor)[0]['id']
		query = 'select * from music where artist_id = %s;'
		cursor = connection.cursor()
		cursor.execute(query,[artist_id])
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
			artist_id = artist_data[0]['id']
			query = 'INSERT INTO music (title, genre, album_name, artist_id, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s);'
			cursor.execute(query, [data["title"], data["genre"], data["album_name"], str(artist_id), str(now), str(now)])

            
			return Response({"message":"Music Added successfully"},status=status.HTTP_200_OK)
		else:
			return Response({"data":serilizer.errors},status=status.HTTP_400_BAD_REQUEST)

class UpdateSong(APIView):
	permission_classes = (permissions.IsAuthenticated,IsArtist)

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
    
    def post(self,request,pk):
        music_id =str(pk)
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


class GetSampleArtistFile(APIView):
	permissions_classes =  (permissions.IsAuthenticated,IsArtistManager)
	def get(self,request):
		BASE_DIR = Path(__file__).resolve().parent.parent
		file_location = BASE_DIR/'static/sampleartist.csv'
		try:    
			with open(file_location, 'r') as f:
				file_data = f.read()
				# sending response 
				response = HttpResponse(file_data, content_type='text/csv')
				response['Content-Disposition'] = 'attachment; filename="sample.csv"'

		except IOError:
			# handle file not exist case here
			response = HttpResponseNotFound('<h1>File not exist</h1>')

		return response
class GetAllArtistFile(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        cursor = connection.cursor()
        query = "SELECT a.id as id, a.name as name, u.dob, a.first_release_year, a.no_of_albums_released, u.id as user_id, u.email, u.gender, u.address, u.phone FROM artist a JOIN user u ON a.user_id = u.id;"
        cursor.execute(query)
        data = cursor.fetchall()

        # Define CSV headers based on your query
        headers = [
            'ID', 'name', 'dob', 'first_release_year', 'no_of_albums_releases', 
            'User ID', 'email', 'gender', 'address', 'phone'
        ]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="all_artists.csv"'

        writer = csv.writer(response)
        writer.writerow(headers)

        for row in data:
            writer.writerow(row)

        return response
    
class BulkUploadArtists(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'message': 'No file uploaded'}, status=400)

        try:
            # Read the file data
            file_data = file.read().decode('utf-8')
            csv_reader = csv.DictReader(io.StringIO(file_data))
            print(csv_reader.fieldnames)

            # Check if file is empty or missing required headers
            if not csv_reader.fieldnames or 'email' not in csv_reader.fieldnames:
                return Response({'message': 'Invalid CSV format'}, status=400)

            # Count rows
            row_count = sum(1 for _ in csv_reader)
            if row_count == 0:
                return Response({'message': 'CSV file is empty'}, status=400)
            
            # Re-read the file to process it
            file.seek(0)
            csv_reader = csv.DictReader(io.StringIO(file_data))

            now = datetime.datetime.now()
            with transaction.atomic():
                cursor = connection.cursor()
                
                for row in csv_reader:
                    # Check required fields
                    if not row.get("email") or not row.get("password"):
                        continue  # Skip rows with missing email or password
                    
                    # Hash the password
                    password_hashed = make_password(row.get('password'))

                    # Insert user record
                    cursor.execute(
                        '''
                        INSERT INTO user (email, password, dob, is_superuser, is_staff, is_active, first_name, last_name, address, phone, gender, role_type, created_at, updated_at) 
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ''',
                        [
                            row.get("email"), password_hashed, row.get("dob"), 0, 0, 1,
                            row.get("first_name"), row.get("last_name"), row.get("address"),
                            row.get("phone"), row.get("gender"), "artist", now, now
                        ]
                    )
                    
                    # Get last inserted user_id
                    user_id = cursor.lastrowid

                    # Insert artist record
                    cursor.execute(
                        '''
                        INSERT INTO artist (name, first_release_year, no_of_albums_released, user_id, created_at, updated_at) 
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ''',
                        [
                            f"{row.get('first_name')} {row.get('last_name')}",
                            row.get("first_release_year"), row.get("no_of_albums_releases"),
                            user_id, now, now
                        ]
                    )

            return Response({'message': 'Data uploaded and processed successfully'}, status=200)

        except csv.Error as e:
            return Response({'message': f"CSV format error: {str(e)}"}, status=400)
        except Exception as e:
            return Response({'message': f"Server error: {str(e)}"}, status=500)