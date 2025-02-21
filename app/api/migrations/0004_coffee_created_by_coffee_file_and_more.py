# Generated by Django 4.2.6 on 2024-11-26 11:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_coffee_weight'),
    ]

    operations = [
        migrations.AddField(
            model_name='coffee',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='coffee',
            name='file',
            field=models.CharField(default='Master_Log.xlsx', max_length=50),
        ),
        migrations.AlterField(
            model_name='coffee',
            name='certificate',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='coffee',
            name='status',
            field=models.CharField(choices=[('RECIEVED', 'recieved'), ('CATALOGUED', 'catalogued'), ('PENDING', 'pending'), ('SOLD', 'sold'), ('WITHDRAWN', 'withdrawn')], default='PENDING', max_length=50),
        ),
    ]
