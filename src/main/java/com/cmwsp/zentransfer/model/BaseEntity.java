package com.cmwsp.zentransfer.model;

import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@MappedSuperclass
public abstract class BaseEntity implements Serializable {

    private static final long serialVersionUID = -5031948652904830067L;

    // 实体ID
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private String id;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(updatable = true, nullable = false)
    private LocalDateTime updatedAt;

    // getters and setters
    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }
}