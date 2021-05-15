package uz.resus.talaba.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uz.resus.talaba.domain.Guruh;

/**
 * Spring Data SQL repository for the Guruh entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GuruhRepository extends JpaRepository<Guruh, Long> {}
