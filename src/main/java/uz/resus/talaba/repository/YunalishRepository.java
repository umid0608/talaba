package uz.resus.talaba.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uz.resus.talaba.domain.Yunalish;

/**
 * Spring Data SQL repository for the Yunalish entity.
 */
@SuppressWarnings("unused")
@Repository
public interface YunalishRepository extends JpaRepository<Yunalish, Long> {}
