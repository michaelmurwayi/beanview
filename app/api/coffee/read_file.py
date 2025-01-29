import pandas as pd

def read_xls_file(file, sheet_names):
    data_df = {}  # Dictionary to store dataframes for each sheet
    file_path = file.get("file")  # Safely retrieve the file object
    file_name = file_path.name if file_path else "Unknown"

    # Check if file_path exists
    if not file_path:
        print("No file path provided.")
        return None, None

    for sheet in sheet_names:
        try:
            # Check if the sheet exists in the file
            sheet_data = pd.read_excel(file_path, sheet_name=None)  # Read all sheets temporarily to check for existence
            if sheet not in sheet_data:
                print(f"Sheet '{sheet}' not found in the file.")
                continue  # Skip this sheet and proceed to the next one

            # Read the sheet starting from row 5 (index 4)
            data_df[sheet] = pd.read_excel(file_path, sheet_name=sheet, skiprows=5)
            print(f"Sheet '{sheet}' loaded successfully.")
        except FileNotFoundError:
            print(f"File '{file_name}' not found.")
            break  # Exit the loop if the file is not found
        except ValueError as ve:
            print(f"ValueError: {ve} - Likely caused by an invalid sheet name or file format.")
        except Exception as e:
            print(f"Error loading sheet '{sheet}': {e}")

    return data_df, file_name  # Return after processing all sheets
