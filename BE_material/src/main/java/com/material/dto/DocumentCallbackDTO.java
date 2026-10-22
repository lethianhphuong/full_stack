package com.material.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class DocumentCallbackDTO {

    /**
     * 1 - Tài liệu đang được chỉnh sửa
     * 2 - Tài liệu đã sẵn sàng để lưu (người dùng đóng tab hoặc bấm save)
     * 3 - Lỗi khi lưu
     * 4 - Đóng tài liệu nhưng không có thay đổi
     * 6 - Force save (lưu tức thì)
     * 7 - Lỗi force save
     */
    private Integer status;

    /**
     * Đường dẫn file mới đã được Document Server biên tập xong để Backend tải về
     */
    private String url;

    private String key;

    private List<String> users;

    private String userdata;
}
