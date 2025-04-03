package com.devs.roamance.service;

public interface BaseService<B, E, C, U, I> {

  B create(C createRequestDto);

  E get(I id);

  B update(U updateRequestDto, I id);

  B delete(I id);
}
