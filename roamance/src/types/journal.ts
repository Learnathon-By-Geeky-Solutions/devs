import { Audit } from './audit';
import { Location } from './location';
import { BaseResponse } from './response';
import {
  SubsectionRequest,
  SightseeingSubsectionDto,
  ActivitySubsectionDto,
  RouteSubsectionDto,
  Subsection,
} from './subsection';
import { User } from './user';

export interface BaseJournal {
  title: string;
  destination: Location;
  description: string;
  is_favorite: boolean;
  is_archived: boolean;
  is_shared: boolean;
  date: string;
  cover_image: string;
}

export interface Journal extends BaseJournal {
  id: string;
  subsections: Subsection[];
  user: User;
  audit: Audit;
}

/* --------------------------------- Create --------------------------------- */

export interface JournalCreateRequest extends BaseJournal {
  subsections: SubsectionRequest[];
}

/* -------------------------------- Response -------------------------------- */

export interface JournalDto extends BaseJournal {
  id: string;
  audit: Audit;
}

export interface JournalBrief extends JournalDto {
  total_subsections: number;
}

export interface JournalDetail extends JournalDto {
  subsections: (
    | SightseeingSubsectionDto
    | ActivitySubsectionDto
    | RouteSubsectionDto
  )[];
}

export type JournalBriefResponse = BaseResponse<JournalBrief>;
export type JournalListResponse = BaseResponse<JournalBrief[]>;
export type JournalDetailResponse = BaseResponse<JournalDetail>;
