import pandas as pd
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
django.setup()

from api.models import Farmer


def ImportFarmers(file):
    # Read the CSV file into a pandas DataFrame
    # import ipdb;ipdb.set_trace()
    df = pd.read_excel(file, skiprows=0)
    # Process the data as needed, e.g., manipulate, clean, or transform it
    try:
    # If you're using Django, save the data to the database
        for row in df.values.tolist():
            # import ipdb;ipdb.set_trace()
            Farmer.objects.create(
                ref_no=row[0],
                name=row[1],
                address = row[2],
                town = row[3],
                estate_name = row[4],
                mark = row[5],
                location = row[6],
                division = row[7],
                district = row[8]
                # Map the DataFrame columns to model fields
            )
            print("Farmer information saved")
    
    except Exception as E:
        print(f"r{row}, {E}") 



file = '/home/korvo/Downloads/farmers.xls'
ImportFarmers(file)