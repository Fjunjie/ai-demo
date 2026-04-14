package com.cmwsp.zentransfer.utils.converter.uorder;

import org.joda.money.Money;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

import com.cmwsp.zentransfer.dto.uorder.OrderDTO;
import com.cmwsp.zentransfer.model.uorder.Order;
import com.cmwsp.zentransfer.utils.converter.BaseMapper;

@Component
public class OrderMapper extends BaseMapper<OrderDTO, Order>{
  private final ModelMapper modelMapper;

  public OrderMapper(ModelMapper modelMapper) {
    this.modelMapper = modelMapper;
    configureModelMapper();
  }

  private void configureModelMapper() {

    var toMoney = new AbstractConverter<String, Money>() {
      @Override
      protected Money convert(String source) {
        return Money.parse("CNY" + source);
      }
    };

    modelMapper.addConverter(toMoney);

    modelMapper.addMappings(new PropertyMap<OrderDTO, Order>() {
      @Override
      protected void configure() {
        using(toMoney).map(source.getAmount(), destination.getAmount());
        skip().setId(null);
      }
    });
  }
}