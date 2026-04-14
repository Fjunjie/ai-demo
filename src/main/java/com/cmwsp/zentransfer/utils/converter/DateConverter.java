package com.cmwsp.zentransfer.utils.converter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class DateConverter {
  public static LocalDateTime convertDateToLocalDateTime(Date date) {
    return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
  }
}
