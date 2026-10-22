package com.material.utils;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public final class DateUtils {

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter
            .ofPattern("yyyy-MM-dd HH:mm:ss")
            .withZone(ZoneId.systemDefault());

    private DateUtils() {}

    public static String formatInstant(Instant instant) {
        if (instant == null) return null;
        return ISO_FORMATTER.format(instant);
    }
}
