# Generated by Django 2.0.3 on 2018-04-05 20:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ifftasks', '0003_auto_20180405_1709'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ifflist',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='list_set', to=settings.AUTH_USER_MODEL),
        ),
    ]
