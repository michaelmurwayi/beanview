# Generated by Django 4.2.6 on 2025-06-15 15:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0027_alter_farmer_national_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='farmer',
            name='phonenumber',
            field=models.CharField(blank=True, default='', max_length=15, null=True),
        ),
    ]
