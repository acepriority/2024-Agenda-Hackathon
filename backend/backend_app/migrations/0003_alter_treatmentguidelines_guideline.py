# Generated by Django 5.1.1 on 2024-10-20 04:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_app', '0002_pestsanddiseases_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='treatmentguidelines',
            name='guideline',
            field=models.CharField(max_length=255),
        ),
    ]
