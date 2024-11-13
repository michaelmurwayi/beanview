from pdf2image import convert_from_path
from PIL import Image
import pytesseract as tess
import re
import pandas as pd

# Set the path to the Tesseract executable
tess.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
import re
import pandas as pd
from pdf2image import convert_from_path
import pytesseract as tess

class PDFTableExtractor:
    def __init__(self, pdf_path, dpi=300):
        self.pdf_path = pdf_path
        self.dpi = dpi
        self.pages = None
        self.table_data = []
    
    def load_pdf(self):
        """Load the PDF and convert pages to images."""
        self.pages = convert_from_path(self.pdf_path, dpi=self.dpi)
        if len(self.pages) <= 1:
            raise ValueError("The PDF doesn't have a second page.")
    
    def clean_text(self, text):
        """Clean OCR text by removing unwanted lines."""
        return "\n".join(
            [line.strip() for line in text.splitlines()
             if line.strip() and not re.search(r"^(Supplier|File|Date|DONbr|N/A|Lot)", line)]
        )
    
    def extract_table_data(self, mill_code, pattern):
        """Extract table data from OCR text using regex."""
        for page in self.pages[1:2]:  # Process only the second page
            text = tess.image_to_string(page)
            clean_text = self.clean_text(text)
            matches = re.finditer(pattern, clean_text)
            
            for match in matches:
                row_data = match.groupdict()  # Convert match to dictionary
                # Check if Outturn is "Lot" or "P" and update it with the first item from Marks
                if row_data["Outturn"] == "Lot" or row_data["Outturn"] == "P" or row_data["Outturn"] == "p":
                    row_data["Outturn"] = row_data["Marks"].split()[0]
                    row_data["Marks"] = " ".join(row_data["Marks"].split()[1:])
                
                # Split and replace characters
                outturn_value = row_data["Outturn"].split("HM")[1].replace('o', '0').replace('O', '0')
                # Check if the resulting value has more than 4 characters
                if len(outturn_value) > 4:
                    outturn_value = outturn_value[1:]  # Drop the first character
                    
                    row_data["Outturn"] = row_data["Outturn"].split("HM")[0] + mill_code + outturn_value
                else:
                    row_data["Outturn"] = row_data["Outturn"].split("HM")[0] + mill_code + outturn_value
                    
                print(row_data)
            

                # Clean and extract Grade from Marks (removes special characters and takes the last item)
                row_data["Grade"] = re.sub(r"(N/A|\||[^\w\s])", "", row_data['Marks'], flags=re.IGNORECASE).strip().split().pop(-1)

                # Clean unwanted characters from 'Marks'
                cleaned_marks = re.sub(r"(N/A|\||[^\w\s])", "", row_data['Marks'], flags=re.IGNORECASE).strip()
                # Split Marks and remove the first (Outturn) and last (Grade) items
                marks_list = cleaned_marks.split()
                
                if len(marks_list) > 1:
                    row_data['Marks'] = " ".join(marks_list[0:-1])  # Keeping everything except first and last item

                # Add the row to table_data
                self.table_data.append(row_data)
    
    def get_table_data(self):
        """Return the table data as a DataFrame."""
        return pd.DataFrame(self.table_data)
    



def check_duplicates(df):
    # Create a set to store seen (Outturn, Grade) pairs
    seen = set()
    duplicates = []

     # Check if the seen set is empty, if yes, add all unique (Outturn, Grade) pairs to it
    if not seen:
        for index, row in df.iterrows():
            outturn_grade = (row['Outturn'],row['Marks'], row['Grade'], row['Bags'], row['Net_Weight'], row['Warehouse'])
            seen.add(outturn_grade)  # Add the (Outturn, Grade) pair to seen

    # Convert the data to a pandas DataFrame for easier manipulation
    df = pd.DataFrame(data, columns=['Outturn', 'Marks', 'Grade', 'Bags', 'Net_Weight', 'Warehouse'])

    # Initialize a dictionary to store records
    records = {}

    # Iterate through each row in the DataFrame
    for index, row in df.iterrows():
        outturn, marks, grade, Bags, price1, warehouse = row
        # Group records by 'Outturn' and 'Grade'
        key = (outturn, grade)
        if key not in records:
            records[key] = []
        records[key].append(row)

    # Process the records to check for quantities and update first record if necessary
    updated_data = []

    merged_df = df.groupby(['Outturn', 'Grade']).agg({
    'Marks': 'first',        # Keeping the first value for 'Marks'
    'Bags': 'first',           # Summing up 'Bags'
    'Net_Weight': 'first',     # Summing up 'Net_Weight'
    'Warehouse': 'first'     # Keeping the first value for 'Warehouse'
    }).reset_index()  # Resetting index for cleaner output

    # Add a 'Pocket' column with the second 'Bags' entry if it exists, otherwise set to 0
    merged_df['Pocket'] = df.groupby(['Outturn', 'Grade'])['Net_Weight'].apply(lambda x: x.iloc[1] if len(x) > 1 else 0).reset_index(drop=True)

    print(merged_df)
    return duplicates
    
# Usage example:

pdf_path = "test.pdf"
extractor = PDFTableExtractor(pdf_path)

# Load and process the PDF
try:
    extractor.load_pdf()
    # Define the regex pattern for extracting rows
    pattern = r"(?P<Outturn>\S+)\s+(?P<Marks>.+?)\s+(?P<Grade>\S+)\s+(?P<Bags>\d+|x)\s+(?P<Net_Weight>\d+\.\d{2})\s+(?P<Price2>\d+\.\d{2})\s+(?P<Total>\d+\.\d{2})\s+(?P<Warehouse>\S+)\s+(?P<Price3>\d+\.\d{2})"
    mill_code = "HM"
    # Extract and display table data
    extractor.extract_table_data(mill_code, pattern)
    data = extractor.get_table_data()
    # import ipdb;ipdb.set_trace()
    check_duplicates(data)
    
except ValueError as e:
    print(e)
