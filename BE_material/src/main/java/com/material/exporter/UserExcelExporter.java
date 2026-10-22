package com.material.exporter;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import com.material.vo.UserVO;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Component
public class UserExcelExporter {

    private static final String[] HEADERS = {
        "STT", "Họ và tên", "Email", "Số điện thoại", "Công ty", "Vai trò", "Trạng thái", "Ngày tạo"
    };

    public byte[] exportToExcel(List<UserVO> users) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Danh sách người dùng");

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Header Row
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < HEADERS.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(HEADERS[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data Rows
            int rowIdx = 1;
            for (UserVO user : users) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(rowIdx - 1);
                row.createCell(1).setCellValue(user.fullName() != null ? user.fullName() : "");
                row.createCell(2).setCellValue(user.email() != null ? user.email() : "");
                row.createCell(3).setCellValue(user.phoneNumber() != null ? user.phoneNumber() : "");
                row.createCell(4).setCellValue(user.company() != null ? user.company() : "");
                row.createCell(5).setCellValue(user.role() != null ? user.role().name() : "");
                row.createCell(6).setCellValue(user.status() != null ? user.status().name() : "");
                row.createCell(7).setCellValue(user.createdAt() != null ? user.createdAt().toString() : "");
            }

            for (int i = 0; i < HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
