package com.cmwsp.zentransfer.utils.converter;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class BaseMapper<D, E> {
  @Autowired
  protected ModelMapper modelMapper;

  public E toEntity(D dto, Class<E> entityClass) {
    return modelMapper.map(dto, entityClass);
  }

  public D toDTO(E entity, Class<D> dtoClass) {
    return modelMapper.map(entity, dtoClass);
  }
}
