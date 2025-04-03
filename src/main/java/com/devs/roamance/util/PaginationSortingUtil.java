package com.devs.roamance.util;

import org.springframework.data.domain.Sort;

public class PaginationSortingUtil {

  private PaginationSortingUtil() {}

  public static int[] validatePaginationParams(int pageNumber, int pageSize) {

    final int MAX_PAGE_NUMBER = 10_000;
    final int MAX_PAGE_SIZE = 50;

    return new int[] {
      Math.clamp(pageNumber, 0, MAX_PAGE_NUMBER), Math.clamp(pageSize, 1, MAX_PAGE_SIZE)
    };
  }

  public static Sort.Direction getSortDirection(String sortDir) {

    return sortDir != null && sortDir.equalsIgnoreCase("desc")
        ? Sort.Direction.DESC
        : Sort.Direction.ASC;
  }
}
