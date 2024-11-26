# data_cleaner.py

import pandas as pd

class DataCleaner:
    def __init__(self, file_path):
        """
        Initializes the DataCleaner instance with the file path.
        
        Args:
            file_path (str): Path to the Excel file to be processed.
        """
        self.file_path = file_path
        self.df = pd.read_excel(file_path)
        print("file recieved")
    
    def clean_outturns(self):
        """
        Cleans the 'Outturn' column by stripping leading/trailing spaces,
        replacing 'O' with '0', and removing any special characters.

        Returns:
            pd.DataFrame: The cleaned DataFrame with the 'Outturn' column cleaned.
        """
        # Remove leading/trailing spaces
        self.df['Outturn'] = self.df['Outturn'].str.strip()
        
        # Replace 'O' with '0' (optional, if OCR issues are present)
        self.df['Outturn'] = self.df['Outturn'].replace({'O': '0'}, regex=True)
        
        # Remove any special characters (keep only alphanumeric characters)
        self.df['Outturn'] = self.df['Outturn'].str.replace(r'[^a-zA-Z0-9]', '', regex=True)
        
        return self.df
    
    def check_for_pockets(self):
        """
        Checks for duplicate records based on 'Outturn' and 'Grade', 
        aggregates the data, and assigns a pocket value for duplicates.
        
        Returns:
            list: A list of dictionaries containing aggregated records.
        """
        records = {}
        # Iterate through each row in the DataFrame
        for index, row in self.df.iterrows():
            outturn_grade = (row['Outturn'], row['Grade'])
            
            # Add records to the dictionary
            if outturn_grade not in records:
                records[outturn_grade] = []
            records[outturn_grade].append(row)

        # Aggregating the data
        updated_data = []
        for (outturn, grade), group in records.items():
            # Aggregating the data
            aggregated_row = {
                'outturn': outturn,
                'grade': grade,
                'mark': group[0]['Mark'],  # Keep the first value for 'Marks'
                'bags': group[0]['Bags'],  # Sum the 'Bags'
                'pockets': group[1]['Net_Weight'] if len(group) > 1 else 0,  # Assign second 'Net_Weight' if available
                'weight': sum(row['Net_Weight'] for row in group),  # Sum the 'Net_Weight'
                'mill': self.file_path.name.split("_")[0],
                'warehouse': group[0]['Location'],  # Keep the first value for 'Location'
                'season': self.file_path.name.split("_")[1],
                'status': "RECIEVED",
                "file": self.file_path.name,

            }
            
            updated_data.append(aggregated_row)

        return updated_data
    
    def process(self):
        """
        Processes the Excel file by cleaning 'Outturn' and checking for duplicates.
        
        Returns:
            list: A list of dictionaries containing cleaned and aggregated records.
        """
        # Clean the DataFrame by removing the first column and cleaning 'Outturn'
        self.df = self.df.drop(self.df.columns[0], axis=1)  # Remove the first column
        self.clean_outturns()

        # Check for duplicates and aggregate records
        final_records = self.check_for_pockets()

        return final_records

