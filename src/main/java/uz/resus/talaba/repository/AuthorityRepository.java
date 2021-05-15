package uz.resus.talaba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.resus.talaba.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
