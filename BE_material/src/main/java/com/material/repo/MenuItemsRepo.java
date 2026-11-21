package com.material.repo;

import com.material.entity.TBL_MenuItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MenuItemsRepo extends JpaRepository<TBL_MenuItemEntity, UUID>, JpaSpecificationExecutor<TBL_MenuItemEntity> {

    @Query(value = """
    SELECT COALESCE(MAX(tms.sort_order), 0) from tbl_menu_items tms WHERE tms.is_deleted = 0
            """,nativeQuery = true)
    int maxSortOrder();

    List<TBL_MenuItemEntity> findAllBySectionIdInOrderBySortOrderAsc(List<String> sectionsId);
}
