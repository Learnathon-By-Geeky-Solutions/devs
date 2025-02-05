package com.devs.roamance.service;

public interface BaseService<B, L, E, C, U, I> {

  B create(C createRequestDto);

  L getAll();

  E getById(I id);

  B update(U updateRequestDto, I id);

  B delete(I id);
}
