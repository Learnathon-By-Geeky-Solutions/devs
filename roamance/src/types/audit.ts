export interface AuditTime {
  created_at: string;
  last_modified_at: string;
}

export interface Audit extends AuditTime {
  created_by: string;
  last_modified_by: string;
}
