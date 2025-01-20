import pandas as pd

class DataCleaner:
    def __init__(self, file_path, sheet_names):
        """
        Initializes the DataCleaner instance with the file path and sheet names.

        Args:
            file_path (str): Path to the Excel file to be processed.
            sheet_names (list): List of sheet names to process.
        """
        self.file_path = file_path
        self.sheet_names = sheet_names
        self.sheets_data = {}

        for sheet in sheet_names:
            try:
                self.sheets_data[sheet] = pd.read_excel(file_path, sheet_name=sheet)
                print(f"Sheet '{sheet}' loaded successfully.")
            except Exception as e:
                print(f"Error loading sheet '{sheet}': {e}")

    def clean_outturns(self, df):
        """
        Cleans the 'Outturn' column by stripping leading/trailing spaces,
        replacing 'O' with '0', and removing any special characters.

        Args:
            df (pd.DataFrame): DataFrame to clean.

        Returns:
            pd.DataFrame: The cleaned DataFrame with the 'Outturn' column cleaned.
        """
        if 'OUTTURN' in df.columns:
            df = df.copy()
            df['OUTTURN'] = df['OUTTURN'].str.strip()
            df['OUTTURN'] = df['OUTTURN'].replace({'O': '0'}, regex=True)
            df['OUTTURN'] = df['OUTTURN'].str.replace(r'[^a-zA-Z0-9]', '', regex=True)

        else:
            print("'Outturn' column not found in the DataFrame.")
        return df

    def check_for_pockets(self, df):
        """
        Checks for duplicate records based on 'Outturn' and 'Grade', 
        aggregates the data, and assigns a pocket value for duplicates.

        Args:
            df (pd.DataFrame): DataFrame to process.

        Returns:
            list: A list of dictionaries containing aggregated records.
        """
        records = {}
        for index, row in df.iterrows():
            outturn_grade = (row['OUTTURN'], row['GRADE'])

            if outturn_grade not in records:
                records[outturn_grade] = []
            records[outturn_grade].append(row)

        updated_data = []
        # Format coffee season
        start_year = f""
        end_year = f""
        for (outturn, grade), group in records.items():
            aggregated_row = {
                'outturn': outturn,
                'grade': grade,
                'mark': group[0]['MARK'],
                'bags': group[0]['BAGS'],
                'pockets': group[1]['Weight'] if len(group) > 1 else 0,
                'weight': sum(row['Weight'] for row in group),
                'mill': group[0]['MILL'],
                'warehouse': group[0]['W/H'],
                'season': f"{start_year}/{end_year}",
                'status': group[0]["STATUS"],
                "file": self.file_path.name,
            }
            
            updated_data.append(aggregated_row)

        return updated_data

    def process(self):
        """
        Processes the specified sheets in the Excel file by cleaning 'Outturn' and checking for duplicates.

        Returns:
            dict: A dictionary with sheet names as keys and lists of cleaned and aggregated records as values.
        """
        processed_data = {}

        for sheet_name, df in self.sheets_data.items():
            try:
                df.columns = df.iloc[4]  # Use row 4 as the column header
                df = df.iloc[5:]  # Drop the first 5 rows
                # df = df[1:]  # Remove the row used as column headers
                # df = df.drop(df.columns[0], axis=1)  # Remove the first column
                df = self.clean_outturns(df)
                processed_data[sheet_name] = self.check_for_pockets(df)
            except Exception as e:
                print(f"Error processing sheet '{sheet_name}': {e}")

        return processed_data