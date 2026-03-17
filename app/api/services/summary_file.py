import os
import zipfile
from io import BytesIO
import logging
import traceback
import re
from datetime import datetime
from django.conf import settings
from django.http import FileResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from openpyxl import load_workbook
from openpyxl.cell.cell import MergedCell

from ..models import Coffee

logger = logging.getLogger(__name__)


def clean_mark(mark: str) -> str:
    """Remove spaces and special characters from mark."""
    if not mark:
        return "UNKNOWN"
    return re.sub(r'[^A-Za-z0-9]', '', mark.strip())


def generate_summary_files(request):
    """
    Generates Excel summary files for each growerCode using provided Coffee records.
    Returns a ZIP file with all generated summaries.
    """
    TEMPLATE_PATH = os.path.join(settings.MEDIA_ROOT, 'templates', 'stock_summary_template.xlsx')
    START_ROW = 32

    try:
        summaries = request.data.get('summaries', [])

        if not summaries:
            raise ValidationError("'summaries' is required and must not be empty.")

        if not os.path.exists(TEMPLATE_PATH):
            raise ValidationError(f"Template not found at {TEMPLATE_PATH}")

        base_dir = os.path.join(settings.MEDIA_ROOT, 'summaries')
        os.makedirs(base_dir, exist_ok=True)

        generated_files = []

        for summary in summaries:
            import ipdb; ipdb.set_trace()
            grower_code = summary.get('growerCode')
            if not grower_code:
                logger.warning("Skipping summary: missing growerCode")
                continue

            # Fetch Coffee records for this grower code
            coffees = Coffee.objects.select_related('farmer', 'mill', 'warehouse', 'status').filter(
                farmer__code=grower_code
            )

            if not coffees.exists():
                logger.warning(f"No coffee records found for grower code: {grower_code}")
                continue

            mark = clean_mark(coffees.first().farmer.mark)
            mark_dir = os.path.join(base_dir, mark)
            os.makedirs(mark_dir, exist_ok=True)

            filename = f"{mark}_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            file_path = os.path.join(mark_dir, filename)

            # Load template
            wb = load_workbook(TEMPLATE_PATH)
            ws = wb.active

            # Write grower code and mark
            ws['B3'] = grower_code
            ws['B4'] = mark

            # Write coffee records starting from START_ROW
            for row_offset, coffee in enumerate(coffees, start=1):
                row = START_ROW + row_offset
                values = [
                    coffee.outturn,
                    getattr(coffee, 'bulkoutturn', ''),  # optional field
                    coffee.farmer.mark if coffee.farmer else '',
                    coffee.type,
                    coffee.grade,
                    coffee.bags,
                    coffee.pockets,
                    coffee.weight,
                    coffee.sale,
                    coffee.season,
                    coffee.certificate,
                    coffee.mill.name if coffee.mill else '',
                    coffee.warehouse.name if coffee.warehouse else '',
                    coffee.price,
                    coffee.buyer,
                    coffee.status.name if coffee.status else '',
                ]

                for col_index, value in enumerate(values, start=1):
                    cell = ws.cell(row=row, column=col_index)
                    if isinstance(cell, MergedCell):
                        continue
                    cell.value = value

            # Save individual file
            wb.save(file_path)
            generated_files.append(file_path)
            logger.info(f"Generated summary file: {file_path}")

        if not generated_files:
            raise ValidationError("No summary files were generated. Check input data and template path.")

        # Create ZIP in memory
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
            for file_path in generated_files:
                zip_file.write(file_path, arcname=os.path.basename(file_path))
        zip_buffer.seek(0)

        return FileResponse(
            zip_buffer,
            as_attachment=True,
            filename=f"stock_summaries_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip",
            content_type='application/zip'
        )

    except ValidationError as e:
        logger.warning(traceback.format_exc())
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(traceback.format_exc())
        return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)