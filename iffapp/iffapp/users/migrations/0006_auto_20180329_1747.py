# Generated by Django 2.0.3 on 2018-03-29 17:47

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_auto_20180329_0018'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='friends_with',
            field=models.ManyToManyField(related_name='_user_friends_with_+', to=settings.AUTH_USER_MODEL),
        ),
    ]
