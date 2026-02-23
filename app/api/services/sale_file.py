import os
import zipfile
from io import BytesIO
import logging
import shutil

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


logger = logging.getLogger(__name__)


def generate_sales_file(request):

    TEMPLATE_PATH = os.path.join(
        settings.MEDIA_ROOT,
        "templates",
        "sale_summary_template.xlsx"
    )

    LOGO_PATH = os.path.join(
        settings.MEDIA_ROOT,
        "templates",
        "logo.png"
    )

    START_ROW = 24


    try:

        sale_data = request.data.get("saleNumber")

        if not sale_data:

            raise ValidationError(
                "saleNumber is required"
            )

        sale_number = sale_data.get("sale number")

        if not sale_number:

            raise ValidationError(
                "Sale Number must not be empty"
            )


        logger.info(
            f"Generating sale file for sale: {sale_number}"
        )


        base_dir = os.path.join(
            settings.MEDIA_ROOT,
            "summaries"
        )

        os.makedirs(
            base_dir,
            exist_ok=True
        )


        generated_files = []


        coffees = Coffee.objects.filter(
            sale=sale_number
        ).select_related("code")


        serializer = CoffeeSerializer(
            coffees,
            many=True
        )

        coffees_data = serializer.data


        logger.info(
            f"Fetched {len(coffees_data)} coffee records"
        )


        grouped = {}

        for coffee in coffees_data:

            code = coffee.get("code")

            if not code:

                logger.warning(
                    "Skipping coffee record with no code"
                )

                continue

            grouped.setdefault(
                code,
                []
            ).append(coffee)


        logger.info(
            f"Grouped into {len(grouped)} codes"
        )


        for code, records in grouped.items():

            try:

                if not records:

                    continue


                mark = (
                    records[0]
                    .get("farmer", {})
                    .get("mark")
                )


                code_dir = os.path.join(
                    base_dir,
                    code
                )

                os.makedirs(
                    code_dir,
                    exist_ok=True
                )


                filename = (
                    f"{code}_summary_"
                    f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
                )


                file_path = os.path.join(
                    code_dir,
                    filename
                )


                shutil.copy(
                    TEMPLATE_PATH,
                    file_path
                )


                wb = load_workbook(
                    file_path,
                    data_only=False,
                    keep_vba=True
                )


                ws = wb.active


                # Optional logo
                # self.add_company_logo(ws, LOGO_PATH)


                ws["B1"].value = code
                ws["B2"].value = mark
                ws["B3"].value = sale_number


                for row_offset, record in enumerate(
                    records,
                    start=1
                ):

                    row = START_ROW + row_offset


                    values = [

                        record.get("outturn"),
                        record.get("season"),
                        record.get("bags"),
                        record.get("pockets"),
                        record.get("weight"),
                        record.get("grade"),
                        record.get("price"),
                        record.get("gross_value"),
                        record.get("warehouse_charges"),
                        record.get("brokerage_charges"),
                        record.get("milling_charges"),
                        record.get("mill"),
                        record.get("export_charges"),
                        record.get("transport_charges"),
                        record.get("net_value"),

                    ]


                    for col_index, value in enumerate(
                        values,
                        start=1
                    ):

                        cell = ws.cell(
                            row=row,
                            column=col_index
                        )


                        if isinstance(
                            cell,
                            MergedCell
                        ):
                            continue


                        cell.value = value


                wb.save(file_path)


                generated_files.append(
                    file_path
                )


                logger.info(
                    f"Generated file: {file_path}"
                )


            except Exception as e:

                logger.exception(
                    f"Failed generating file for code {code}: {str(e)}"
                )


        if not generated_files:

            raise ValidationError(
                "No files were generated"
            )


        zip_buffer = BytesIO()


        with zipfile.ZipFile(
            zip_buffer,
            "w"
        ) as zip_file:

            for file_path in generated_files:

                zip_file.write(
                    file_path,
                    os.path.basename(file_path)
                )


        zip_buffer.seek(0)


        logger.info(
            "ZIP file generated successfully"
        )


        return FileResponse(

            zip_buffer,

            as_attachment=True,

            filename=(
                "stock_summaries_"
                f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"
            ),

            content_type="application/zip"

        )


    except ValidationError as e:

        logger.warning(str(e))

        return Response(

            {"error": str(e)},

            status=status.HTTP_400_BAD_REQUEST

        )


    except Exception as e:

        logger.exception(
            "Internal server error during sale file generation"
        )

        return Response(

            {
                "error":
                "Internal server error"
            },

            status=status.HTTP_500_INTERNAL_SERVER_ERROR

        )
