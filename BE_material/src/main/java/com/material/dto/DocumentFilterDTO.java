package com.material.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DocumentFilterDTO {
    private int page = 0;
    private int size = 10;
    private String sort = "createdAt,desc";
    private String search;
    private String fileType; // all, docx, xlsx, pptx, pdf
}
