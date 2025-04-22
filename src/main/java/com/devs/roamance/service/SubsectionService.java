package com.devs.roamance.service;

import com.devs.roamance.dto.request.travel.journal.SubsectionCreateRequestDto;
import com.devs.roamance.dto.request.travel.journal.SubsectionUpdateRequestDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionListResponseDto;
import com.devs.roamance.dto.response.travel.journal.SubsectionResponseDto;
import java.util.UUID;

public interface SubsectionService
    extends BaseService<
        SubsectionResponseDto,
        SubsectionResponseDto,
        SubsectionCreateRequestDto,
        SubsectionUpdateRequestDto,
        UUID> {

  SubsectionListResponseDto getAll(int pageNumber, int pageSize, String sortBy, String sortDir);
}
