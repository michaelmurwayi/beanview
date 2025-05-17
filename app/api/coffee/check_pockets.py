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
        
        for (outturn, grade), group in records.items():
            
            aggregated_row = {
                'outturn': outturn,
                'bulkoutturn': group[0]['BULK_OUTTURN'],
                'mark': group[0]['MARK'],
                'type': group[0]['COFFEE TYPE'],
                'grade': grade,
                'bags': group[0]['BAGS'],
                'pockets': group[0]["POCKETS"],
                'weight': group[0]['WEIGHT'],
                'sale': group[0]['SALE NO'],
                'season': group[0]['SEASON'],
                'certificate': group[0]['CERTIFICATE'],
                'mill': group[0]['MILL'],
                'warehouse': group[0]['W/H'],
                'price': group[0]['PRICE'],
                'buyer': group[0]['BUYER'],
                'status': group[0]["STATUS"],
                "file": sheet,
            }
            
            updated_data.append(aggregated_row)

    return updated_data
