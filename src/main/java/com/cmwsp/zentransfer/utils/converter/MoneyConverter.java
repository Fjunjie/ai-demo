package com.cmwsp.zentransfer.utils.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.joda.money.CurrencyUnit;
import org.joda.money.Money;

import java.math.BigDecimal;

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
