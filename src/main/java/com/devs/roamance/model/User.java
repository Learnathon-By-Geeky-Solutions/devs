package com.devs.roamance.model;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String email;
    private String password;

    @ElementCollection
    @CollectionTable(name = "user_followers")
    @Column(name = "follower_id")
    private List<Long> followers = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_followings")
    @Column(name = "following_id")
    private List<Long> followings = new ArrayList<>();

    private ZonedDateTime createdAt;

    @PrePersist
    protected void onCreate() {

        this.createdAt = ZonedDateTime.now();
    }
}