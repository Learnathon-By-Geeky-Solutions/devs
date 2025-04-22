package com.devs.roamance.service;

import com.devs.roamance.dto.response.BaseResponseDto;

public interface BaseService<R, E, C, U, I> {

  R create(C createRequestDto);

  E get(I id);

  R update(U updateRequestDto, I id);

  BaseResponseDto delete(I id);
}
