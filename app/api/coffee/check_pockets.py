def check_for_pockets(df, sheets):
    """
    Checks for duplicate records based on 'Outturn' and 'Grade', 
    aggregates the data, and assigns a pocket value for duplicates.

    Args:
        df (pd.DataFrame): DataFrame to process.

    Returns:
        list: A list of dictionaries containing aggregated records.
    """
    records = {}
    

    for sheet in sheets:
        for index, row in df[sheet].iterrows():
            outturn_grade = (row['OUTTURN'], row['GRADE'])

            if outturn_grade not in records:
                records[outturn_grade] = []
            records[outturn_grade].append(row)

        updated_data = []
        # Format coffee season
        start_year = f""
        end_year = f""
        
    for record in records:
        
        updated_row = {
            'outturn': record['OUTTURN'],
            'bulkoutturn': record['BULK_OUTTURN'],
            'mark': record['MARK'],
            'type': record['COFFEE TYPE'],
            'grade': record['GRADE'],
            'bags': record['BAGS'],
            'pockets': record["POCKETS"],
            'weight': record['WEIGHT'],
            'sale': record['SALE NO'],
            'season': record['SEASON'],
            'certificate': record['CERTIFICATE'],
            'mill': record['MILL'],
            'warehouse': record['WAREHOUSE'],
            'price': record['PRICE'],
            'buyer': record['BUYER'],
            'status': record["STATUS"],
            'file': sheet,
        }

        updated_data.append(updated_row)

    return updated_data
