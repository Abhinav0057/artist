# Generated by Django 4.1 on 2024-08-29 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='date_joined',
        ),
        migrations.RemoveField(
            model_name='user',
            name='groups',
        ),
        migrations.RemoveField(
            model_name='user',
            name='user_permissions',
        ),
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
        migrations.AlterField(
            model_name='user',
            name='gender',
            field=models.CharField(blank=True, choices=[('m', 'Male'), ('f', 'Female'), ('o', 'Other')], max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='role_type',
            field=models.CharField(blank=True, choices=[('super_admin', 'Super Admin'), ('artist_manager', 'Artist Manager'), ('artist', 'Artist')], max_length=20, null=True),
        ),
    ]
