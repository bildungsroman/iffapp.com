# Generated by Django 2.0.4 on 2018-04-10 17:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ifftasks', '0008_auto_20180410_0123'),
    ]

    operations = [
        migrations.AddField(
            model_name='todoitem',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]