package com.devs.roamance.model;

import com.devs.roamance.model.subsection.Subsection;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "journals", uniqueConstraints = @UniqueConstraint(columnNames = "title"))
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Journal {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NonNull
    private String title;

    @NonNull
    @Embedded
    private Location destination;

    @Nullable
    private String description;

    @NonNull
    @OneToMany(mappedBy = "journal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subsection> subsections = new ArrayList<>();

    // Auditing Fields

    @CreatedDate
    @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE")
    @Setter(AccessLevel.NONE)
    private ZonedDateTime createdAt;

    @LastModifiedDate
    @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime lastModified;

    @CreatedBy
    @Setter(AccessLevel.NONE)
    private long createdBy;

    @LastModifiedBy
    private long lastModifiedBy;
}
