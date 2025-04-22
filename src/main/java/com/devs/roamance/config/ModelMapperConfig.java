package com.devs.roamance.config;

import com.devs.roamance.dto.request.travel.journal.JournalCreateRequestDto;
import com.devs.roamance.model.travel.journal.Journal;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

  @Bean
  ModelMapper modelMapper() {
    ModelMapper modelMapper = new ModelMapper();

    modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

    modelMapper
        .typeMap(JournalCreateRequestDto.class, Journal.class)
        .addMappings(mapper -> mapper.skip(Journal::setSubsections));

    return modelMapper;
  }
}
