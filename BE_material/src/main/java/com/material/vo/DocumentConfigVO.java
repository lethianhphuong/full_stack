package com.material.vo;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class DocumentConfigVO {

    private String documentServerUrl;
    private String displayName;
    private Map<String, Object> config;
}
