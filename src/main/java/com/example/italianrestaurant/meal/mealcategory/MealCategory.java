package com.example.italianrestaurant.meal.mealcategory;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;

import java.util.Objects;

@Entity
@Table(name = "meal_categories")
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MealCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    private String imgPath;

    public MealCategory(String name, String imgPath) {
        this.name = name;
        this.imgPath = imgPath;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        MealCategory mealCategory = (MealCategory) o;
        return getId() != null && Objects.equals(getId(), mealCategory.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
