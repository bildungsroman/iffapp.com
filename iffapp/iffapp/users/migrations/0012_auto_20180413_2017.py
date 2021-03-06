# Generated by Django 2.0.4 on 2018-04-13 20:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_remove_user_uuid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_pic',
            field=models.ImageField(blank=True, default='media/profile_pics/user_default.png', null=True, upload_to='media/profile_pics'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_bio',
            field=models.TextField(blank=True, default='', null=True, verbose_name='A short bio'),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_goals',
            field=models.TextField(blank=True, default='', max_length=255, null=True, verbose_name='Your current goals'),
        ),
    ]
