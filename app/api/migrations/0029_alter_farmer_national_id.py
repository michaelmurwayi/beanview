# Generated by Django 4.2.6 on 2025-06-15 15:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_alter_farmer_phonenumber'),
    ]

    operations = [
        migrations.AlterField(
            model_name='farmer',
            name='national_id',
            field=models.CharField(blank=True, default='', max_length=10, null=True),
        ),
    ]
