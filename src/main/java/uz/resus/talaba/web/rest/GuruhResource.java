package uz.resus.talaba.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uz.resus.talaba.domain.Guruh;
import uz.resus.talaba.repository.GuruhRepository;
import uz.resus.talaba.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uz.resus.talaba.domain.Guruh}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GuruhResource {

    private final Logger log = LoggerFactory.getLogger(GuruhResource.class);

    private static final String ENTITY_NAME = "guruh";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GuruhRepository guruhRepository;

    public GuruhResource(GuruhRepository guruhRepository) {
        this.guruhRepository = guruhRepository;
    }

    /**
     * {@code POST  /guruhs} : Create a new guruh.
     *
     * @param guruh the guruh to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new guruh, or with status {@code 400 (Bad Request)} if the guruh has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/guruhs")
    public ResponseEntity<Guruh> createGuruh(@Valid @RequestBody Guruh guruh) throws URISyntaxException {
        log.debug("REST request to save Guruh : {}", guruh);
        if (guruh.getId() != null) {
            throw new BadRequestAlertException("A new guruh cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Guruh result = guruhRepository.save(guruh);
        return ResponseEntity
            .created(new URI("/api/guruhs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /guruhs/:id} : Updates an existing guruh.
     *
     * @param id the id of the guruh to save.
     * @param guruh the guruh to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated guruh,
     * or with status {@code 400 (Bad Request)} if the guruh is not valid,
     * or with status {@code 500 (Internal Server Error)} if the guruh couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/guruhs/{id}")
    public ResponseEntity<Guruh> updateGuruh(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Guruh guruh)
        throws URISyntaxException {
        log.debug("REST request to update Guruh : {}, {}", id, guruh);
        if (guruh.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, guruh.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!guruhRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Guruh result = guruhRepository.save(guruh);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, guruh.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /guruhs/:id} : Partial updates given fields of an existing guruh, field will ignore if it is null
     *
     * @param id the id of the guruh to save.
     * @param guruh the guruh to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated guruh,
     * or with status {@code 400 (Bad Request)} if the guruh is not valid,
     * or with status {@code 404 (Not Found)} if the guruh is not found,
     * or with status {@code 500 (Internal Server Error)} if the guruh couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/guruhs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Guruh> partialUpdateGuruh(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Guruh guruh
    ) throws URISyntaxException {
        log.debug("REST request to partial update Guruh partially : {}, {}", id, guruh);
        if (guruh.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, guruh.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!guruhRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Guruh> result = guruhRepository
            .findById(guruh.getId())
            .map(
                existingGuruh -> {
                    if (guruh.getNom() != null) {
                        existingGuruh.setNom(guruh.getNom());
                    }
                    if (guruh.getYil() != null) {
                        existingGuruh.setYil(guruh.getYil());
                    }

                    return existingGuruh;
                }
            )
            .map(guruhRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, guruh.getId().toString())
        );
    }

    /**
     * {@code GET  /guruhs} : get all the guruhs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of guruhs in body.
     */
    @GetMapping("/guruhs")
    public List<Guruh> getAllGuruhs() {
        log.debug("REST request to get all Guruhs");
        return guruhRepository.findAll();
    }

    /**
     * {@code GET  /guruhs/:id} : get the "id" guruh.
     *
     * @param id the id of the guruh to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the guruh, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/guruhs/{id}")
    public ResponseEntity<Guruh> getGuruh(@PathVariable Long id) {
        log.debug("REST request to get Guruh : {}", id);
        Optional<Guruh> guruh = guruhRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(guruh);
    }

    /**
     * {@code DELETE  /guruhs/:id} : delete the "id" guruh.
     *
     * @param id the id of the guruh to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/guruhs/{id}")
    public ResponseEntity<Void> deleteGuruh(@PathVariable Long id) {
        log.debug("REST request to delete Guruh : {}", id);
        guruhRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
