package com.material.repo;

import com.material.entity.TBL_MenuItemEntity;
import com.material.entity.TBL_MenuSectionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MenuSectionsRepo extends JpaRepository<TBL_MenuSectionsEntity, UUID>, JpaSpecificationExecutor<TBL_MenuSectionsEntity> {

    @Query(value = """
    SELECT COALESCE(MAX(tms.sort_order), 0) from tbl_menu_sections tms WHERE tms.is_deleted = 0
            """,nativeQuery = true)
    int maxSortOrder();
}
