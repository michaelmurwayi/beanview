import pandas as pd
import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
django.setup()

from api.models import Farmer

def ImportFarmers(file_path):
    try:
        # Load Excel file
        df = pd.read_excel(file_path)

        print("📄 Excel file loaded. Preview:")
        print(df.head())

        # Normalize column names
        df.columns = [col.strip().lower() for col in df.columns]

        # Rename common misspellings
        if 'brank' in df.columns:
            df.rename(columns={'brank': 'branch'}, inplace=True)

        # Drop completely empty rows
        df.dropna(how='all', inplace=True)

        # Ensure required columns exist
        required_columns = ['code', 'name']
        for col in required_columns:
            if col not in df.columns:
                print(f"❌ Required column '{col}' not found in the file.")
                return

        # Fix phone numbers (keep as string and pad with zeros)
        if 'phonenumber' in df.columns:
            df['phonenumber'] = df['phonenumber'].astype('Int64').astype(str).str.zfill(10)

        # Fix account numbers (as string, drop decimals)
        if 'account' in df.columns:
            df['account'] = df['account'].apply(lambda x: str(int(x)) if pd.notnull(x) else None)

        # Fill missing currency values
        if 'currency' in df.columns:
            df['currency'] = df['currency'].fillna('KES')

        # Import each row
        for index, row in df.iterrows():
            if pd.isna(row.get('code')):
                print(f"⚠️ Skipping row {index} without 'code': {row.to_dict()}")
                continue

            try:
                # Clean all string fields of leading/trailing spaces
                cleaned_data = {
                    key: (str(value).strip() if isinstance(value, str) else value)
                    for key, value in row.items()
                }

                farmer, created = Farmer.objects.update_or_create(
                    code=cleaned_data['code'],
                    defaults={
                        'name': cleaned_data.get('name'),
                        'national_id': cleaned_data.get('national_id'),
                        'mark': cleaned_data.get('mark'),
                        'address': cleaned_data.get('address'),
                        'phonenumber': cleaned_data.get('phonenumber'),
                        'email': cleaned_data.get('email'),
                        'county': cleaned_data.get('county'),
                        'town': cleaned_data.get('town'),
                        'bank': cleaned_data.get('bank'),
                        'branch': cleaned_data.get('branch'),
                        'account': cleaned_data.get('account'),
                        'currency': cleaned_data.get('currency')
                    }
                )
                print(f"{'🆕 Created' if created else '🔁 Updated'}: {farmer.code}")

            except Exception as e:
                print(f"❌ Failed to save row {index}: {row.to_dict()}\nError: {e}")

        print(f"✅ Import complete. Total farmers in DB: {Farmer.objects.count()}")

    except Exception as e:
        print(f"❌ Critical error: {e}")

# Run the import
file = os.path.expanduser('~/Downloads/farmers.xlsx')
ImportFarmers(file)
