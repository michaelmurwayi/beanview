# Generated by Django 4.2.6 on 2023-10-21 21:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_user_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='roles',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
