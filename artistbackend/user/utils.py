from django.db import connection
from django.contrib.auth.hashers import make_password
import datetime

def dictFromQuery(cursor): 
    "Returns all rows from a cursor as a dict" 
    desc = cursor.description 
    return [
            dict(zip([col[0] for col in desc], row)) 
            for row in cursor.fetchall() 
    ]
    
    
def register_user(data):
        now = datetime.datetime.now()
        password = make_password(data['password'])
        cursor = connection.cursor()
        query = 'insert into user (email, password, dob,role_type,is_superuser,is_staff,is_active, first_name, last_name, address, phone, gender,created_at, updated_at,is_active) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);'
        cursor.execute(query,[data["email"], str(password),data["dob"], data["role_type"],"0","0","1",data["first_name"],data["last_name"],data["address"],data["phone"],data["gender"],str(now),str(now),'1'])
    
        return cursor.lastrowid