import os
import zipfile
from io import BytesIO
import logging
import shutil
import traceback

from ..models import *
from ..serializers import *
from django.http import FileResponse
from django.conf import settings
from datetime import datetime, timedelta
from openpyxl import load_workbook
from openpyxl.cell.cell import MergedCell

from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError


def generate_summary_files(request):
        TEMPLATE_PATH = os.path.join(settings.MEDIA_ROOT, 'templates', 'stock_summary_template.xlsx')
        START_ROW = 32

        try:
            summaries = request.data.get('summaries', [])

            if not summaries:
                raise ValidationError("'summaries' is required and must not be empty.")

            base_dir = os.path.join(settings.MEDIA_ROOT, 'summaries')
            os.makedirs(base_dir, exist_ok=True)

            generated_files = []

            for summary in summaries:
                mark = summary.get('mark')
                records = summary.get('records', [])
                code = summary.get("records")[0]["code"]

                if not mark or not records:
                    continue

                mark_dir = os.path.join(base_dir, mark)
                os.makedirs(mark_dir, exist_ok=True)

                filename = f"{mark}_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                file_path = os.path.join(mark_dir, filename)

                wb = load_workbook(TEMPLATE_PATH)
                ws = wb.active
                # Set mark name in cell B6
                ws['B3'] = code
                ws['B4'] = mark
                
                for row_offset, record in enumerate(records, start=1):
                    row = START_ROW + row_offset

                    values = [
                        record.get('outturn'),
                        record.get('bulkoutturn'),
                        record.get('mark'),
                        record.get('type'),
                        record.get('grade'),
                        record.get('bags'),
                        record.get('pockets'),
                        record.get('weight'),
                        record.get('sale_number'),
                        record.get('season'),
                        record.get('certificate'),
                        record.get('mill'),
                        record.get('warehouse'),
                        record.get('price'),
                        record.get('buyer'),
                        record.get('status'),
                    ]

                    for col_index, value in enumerate(values, start=1):
                        cell = ws.cell(row=row, column=col_index)
                        if isinstance(cell, MergedCell):
                            continue
                        cell.value = value

                wb.save(file_path)
                generated_files.append(file_path)

            # ✅ Create ZIP in memory
            zip_buffer = BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
                for file_path in generated_files:
                    arcname = os.path.basename(file_path)
                    zip_file.write(file_path, arcname=arcname)

            zip_buffer.seek(0)

            # ✅ Return as downloadable file
            return FileResponse(
                zip_buffer,
                as_attachment=True,
                filename=f"stock_summaries_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip",
                content_type='application/zip'
            )

        except ValidationError as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
