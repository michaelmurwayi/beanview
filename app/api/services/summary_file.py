import os
import zipfile
from io import BytesIO
import logging
import traceback
import re
from datetime import datetime

import pandas as pd
from django.conf import settings
from django.http import FileResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

from ..models import Coffee
from .file_to_pdf import dataframe_to_pdf_buffer

logger = logging.getLogger(__name__)


def clean_mark(mark: str) -> str:
    """Remove spaces and special characters from mark."""
    if not mark:
        return "UNKNOWN"
    return re.sub(r'[^A-Za-z0-9]', '', str(mark).strip())


def build_coffee_dataframe(coffees):
    """
    Build a DataFrame from coffee queryset for PDF export.
    """
    rows = []

    for coffee in coffees:
        rows.append({
            "Outturn": coffee.outturn,
            "Bulk Outturn": getattr(coffee, 'bulkoutturn', ''),
            "Mark": coffee.farmer.mark if coffee.farmer else '',
            "Type": getattr(coffee, 'type', ''),
            "Grade": coffee.grade,
            "Bags": coffee.bags,
            "Pockets": coffee.pockets,
            "Weight": coffee.weight,
            "Sale": coffee.sale,
            "Season": getattr(coffee, 'season', ''),
            "Certificate": getattr(coffee, 'certificate', ''),
            "Mill": coffee.mill.name if coffee.mill else '',
            "Warehouse": coffee.warehouse.name if coffee.warehouse else '',
            "Price": coffee.price,
            "Buyer": coffee.buyer,
            "Status": coffee.status.name if coffee.status else '',
        })

    return pd.DataFrame(rows)


def generate_summary_files(request):
    """
    Generates PDF summary files for each growerCode using Coffee records.
    - If one growerCode: returns single PDF directly
    - If multiple growerCodes: returns ZIP containing PDFs only
    """
    try:
        logger.warning(">>> NEW PDF generate_summary_files CALLED <<<")
        print(">>> NEW PDF generate_summary_files CALLED <<<")

        summaries = request.data.get('summaries', [])

        if not summaries:
            raise ValidationError("'summaries' is required and must not be empty.")

        base_dir = os.path.join(settings.MEDIA_ROOT, 'summaries')
        os.makedirs(base_dir, exist_ok=True)

        generated_pdf_files = []

        for summary in summaries:
            grower_code = summary.get('growerCode')
            if not grower_code:
                logger.warning("Skipping summary: missing growerCode")
                continue

            coffees = Coffee.objects.select_related(
                'farmer', 'mill', 'warehouse', 'status'
            ).filter(
                farmer__code=grower_code
            )

            if not coffees.exists():
                logger.warning(f"No coffee records found for grower code: {grower_code}")
                continue

            first_coffee = coffees.first()
            mark = clean_mark(first_coffee.farmer.mark if first_coffee and first_coffee.farmer else grower_code)

            mark_dir = os.path.join(base_dir, mark)
            os.makedirs(mark_dir, exist_ok=True)

            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            pdf_filename = f"{mark}_summary_{timestamp}.pdf"
            pdf_file_path = os.path.join(mark_dir, pdf_filename)

            pdf_df = build_coffee_dataframe(coffees)
            pdf_title = f"Stock Summary Report - {mark} ({grower_code})"

            pdf_buffer = dataframe_to_pdf_buffer(pdf_df, title=pdf_title)

            with open(pdf_file_path, "wb") as pdf_file:
                pdf_file.write(pdf_buffer.getvalue())

            generated_pdf_files.append(pdf_file_path)
            logger.info(f"Generated PDF summary file: {pdf_file_path}")

        if not generated_pdf_files:
            raise ValidationError("No PDF summary files were generated. Check input data.")

        # Return single PDF directly
        if len(generated_pdf_files) == 1:
            pdf_path = generated_pdf_files[0]
            response = FileResponse(
                open(pdf_path, 'rb'),
                as_attachment=True,
                filename=os.path.basename(pdf_path),
                content_type='application/pdf'
            )
            response["Content-Disposition"] = f'attachment; filename="{os.path.basename(pdf_path)}"'
            return response

        # Return ZIP of PDFs only
        zip_buffer = BytesIO()
        zip_filename = f"stock_summaries_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"

        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for pdf_path in generated_pdf_files:
                zip_file.write(pdf_path, arcname=os.path.basename(pdf_path))

        zip_buffer.seek(0)

        response = FileResponse(
            zip_buffer,
            as_attachment=True,
            filename=zip_filename,
            content_type='application/zip'
        )
        response["Content-Disposition"] = f'attachment; filename="{zip_filename}"'
        return response

    except ValidationError as e:
        logger.warning(traceback.format_exc())
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(traceback.format_exc())
        return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)