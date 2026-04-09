# app/api/services/file_to_pdf.py

import os
import pandas as pd
from io import BytesIO
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet


def dataframe_to_pdf_buffer(df: pd.DataFrame, title: str = "Generated Report") -> BytesIO:
    """
    Convert a pandas DataFrame into a PDF stored in memory (BytesIO).
    Returns a BytesIO buffer ready for download.
    """
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=20,
        leftMargin=20,
        topMargin=20,
        bottomMargin=20
    )

    elements = []
    styles = getSampleStyleSheet()

    # Title
    elements.append(Paragraph(title, styles["Title"]))
    elements.append(Spacer(1, 12))

    # Handle empty dataframe
    if df.empty:
        elements.append(Paragraph("No data available.", styles["Normal"]))
        doc.build(elements)
        buffer.seek(0)
        return buffer

    # Convert all values to strings and replace NaN
    df = df.fillna("")
    df = df.astype(str)

    # Split large data into chunks for multi-page support
    chunk_size = 25  # rows per page
    chunks = [df.iloc[i:i + chunk_size] for i in range(0, len(df), chunk_size)]

    for index, chunk in enumerate(chunks):
        table_data = [list(chunk.columns)] + chunk.values.tolist()

        table = Table(table_data, repeatRows=1)

        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4F81BD")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
            ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]))

        elements.append(table)

        if index < len(chunks) - 1:
            elements.append(PageBreak())

    doc.build(elements)
    buffer.seek(0)
    return buffer


def file_to_pdf_buffer(file_path: str, title: str = "Generated Report") -> BytesIO:
    """
    Convert CSV or Excel file to PDF buffer.
    Supports .csv, .xlsx, .xls
    """
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".csv":
        df = pd.read_csv(file_path)
    elif ext in [".xlsx", ".xls"]:
        df = pd.read_excel(file_path)
    else:
        raise ValueError("Unsupported file format for PDF conversion. Use CSV or Excel.")

    return dataframe_to_pdf_buffer(df, title=title)