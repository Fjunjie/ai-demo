package com.cmwsp.zentransfer.utils;

import com.cmwsp.zentransfer.dto.alipay.Stringify;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

public class JsonUtil {
  private static final ObjectMapper objectMapper = new ObjectMapper();

  static {
    objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
  }

  public static <T extends Stringify> String convertToJsonString(T obj) throws JsonProcessingException {
    return objectMapper.writeValueAsString(obj);
  }
}