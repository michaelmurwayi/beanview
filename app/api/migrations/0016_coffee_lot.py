# Generated by Django 4.2.6 on 2025-05-17 08:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_rename_sale_number_coffee_sale'),
    ]

    operations = [
        migrations.AddField(
            model_name='coffee',
            name='lot',
            field=models.CharField(default='', max_length=100),
        ),
    ]
