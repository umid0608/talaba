package uz.resus.talaba.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uz.resus.talaba.domain.Talaba;

/**
 * Spring Data SQL repository for the Talaba entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TalabaRepository extends JpaRepository<Talaba, Long> {}
