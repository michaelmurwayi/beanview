# Generated by Django 4.2.6 on 2025-06-15 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_merge_20250615_1448'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='farmer',
            name='id',
        ),
        migrations.AlterField(
            model_name='farmer',
            name='code',
            field=models.CharField(max_length=100, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='farmer',
            name='email',
            field=models.EmailField(default='', max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='farmer',
            name='national_id',
            field=models.CharField(blank=True, default='', max_length=10, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='farmer',
            name='phonenumber',
            field=models.CharField(blank=True, default='', max_length=15, null=True, unique=True),
        ),
    ]
