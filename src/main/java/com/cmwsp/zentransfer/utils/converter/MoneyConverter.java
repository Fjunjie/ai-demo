package com.cmwsp.zentransfer.utils.converter;

import java.math.BigDecimal;

import org.joda.money.CurrencyUnit;
import org.joda.money.Money;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MoneyConverter implements AttributeConverter<Money, BigDecimal> {

  @Override
  public BigDecimal convertToDatabaseColumn(Money attribute) {
    if (attribute == null) {
      return null;
    }

    return attribute.getAmount();
  }

  @Override
  public Money convertToEntityAttribute(BigDecimal dbData) {
    if (dbData == null) {
      return null;
    }

    return Money.of(CurrencyUnit.of("CNY"), dbData);
  }

}
