import pandas as pd

def clean_outturns(df, sheets):
    """
    Cleans the 'Outturn' column by stripping leading/trailing spaces,
    replacing 'O' with '0', and removing any special characters.

    Args:
        df (pd.DataFrame): DataFrame to clean.
        sheets (list): List of sheet names to process.

    Returns:
        pd.DataFrame: The cleaned DataFrame with the 'Outturn' column cleaned.
    """
    for sheet in sheets:
        try:
            # Check if the sheet exists in the dataframe
            if sheet not in df:
                print(f"Sheet '{sheet}' not found in the DataFrame.")
                continue

            # Check if 'OUTTURN' column exists in the current sheet
            if 'OUTTURN' in df[sheet].columns:
                # Perform cleaning on the 'OUTTURN' column
                df[sheet]['OUTTURN'] = df[sheet]['OUTTURN'].str.strip()
                df[sheet]['OUTTURN'] = df[sheet]['OUTTURN'].replace({'O': '0'}, regex=True)
                df[sheet]['OUTTURN'] = df[sheet]['OUTTURN'].str.replace(r'[^a-zA-Z0-9]', '', regex=True)
                print(f"Sheet '{sheet}' cleaned successfully.")
            else:
                print(f"'OUTTURN' column not found in sheet '{sheet}'.")
        except Exception as e:
            # Catch any errors that occur during processing
            print(f"Error processing sheet '{sheet}': {e}")
    
    return df
