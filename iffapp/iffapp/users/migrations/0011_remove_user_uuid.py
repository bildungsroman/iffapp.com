# Generated by Django 2.0.3 on 2018-04-06 02:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_user_uuid'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='uuid',
        ),
    ]
