package uz.resus.talaba.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uz.resus.talaba.domain.Yunalish;
import uz.resus.talaba.repository.YunalishRepository;
import uz.resus.talaba.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uz.resus.talaba.domain.Yunalish}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class YunalishResource {

    private final Logger log = LoggerFactory.getLogger(YunalishResource.class);

    private static final String ENTITY_NAME = "yunalish";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final YunalishRepository yunalishRepository;

    public YunalishResource(YunalishRepository yunalishRepository) {
        this.yunalishRepository = yunalishRepository;
    }

    /**
     * {@code POST  /yunalishes} : Create a new yunalish.
     *
     * @param yunalish the yunalish to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new yunalish, or with status {@code 400 (Bad Request)} if the yunalish has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/yunalishes")
    public ResponseEntity<Yunalish> createYunalish(@RequestBody Yunalish yunalish) throws URISyntaxException {
        log.debug("REST request to save Yunalish : {}", yunalish);
        if (yunalish.getId() != null) {
            throw new BadRequestAlertException("A new yunalish cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Yunalish result = yunalishRepository.save(yunalish);
        return ResponseEntity
            .created(new URI("/api/yunalishes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /yunalishes/:id} : Updates an existing yunalish.
     *
     * @param id the id of the yunalish to save.
     * @param yunalish the yunalish to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated yunalish,
     * or with status {@code 400 (Bad Request)} if the yunalish is not valid,
     * or with status {@code 500 (Internal Server Error)} if the yunalish couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/yunalishes/{id}")
    public ResponseEntity<Yunalish> updateYunalish(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Yunalish yunalish
    ) throws URISyntaxException {
        log.debug("REST request to update Yunalish : {}, {}", id, yunalish);
        if (yunalish.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, yunalish.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!yunalishRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Yunalish result = yunalishRepository.save(yunalish);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, yunalish.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /yunalishes/:id} : Partial updates given fields of an existing yunalish, field will ignore if it is null
     *
     * @param id the id of the yunalish to save.
     * @param yunalish the yunalish to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated yunalish,
     * or with status {@code 400 (Bad Request)} if the yunalish is not valid,
     * or with status {@code 404 (Not Found)} if the yunalish is not found,
     * or with status {@code 500 (Internal Server Error)} if the yunalish couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/yunalishes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Yunalish> partialUpdateYunalish(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Yunalish yunalish
    ) throws URISyntaxException {
        log.debug("REST request to partial update Yunalish partially : {}, {}", id, yunalish);
        if (yunalish.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, yunalish.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!yunalishRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Yunalish> result = yunalishRepository
            .findById(yunalish.getId())
            .map(
                existingYunalish -> {
                    if (yunalish.getNom() != null) {
                        existingYunalish.setNom(yunalish.getNom());
                    }
                    if (yunalish.getKod() != null) {
                        existingYunalish.setKod(yunalish.getKod());
                    }

                    return existingYunalish;
                }
            )
            .map(yunalishRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, yunalish.getId().toString())
        );
    }

    /**
     * {@code GET  /yunalishes} : get all the yunalishes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of yunalishes in body.
     */
    @GetMapping("/yunalishes")
    public List<Yunalish> getAllYunalishes() {
        log.debug("REST request to get all Yunalishes");
        return yunalishRepository.findAll();
    }

    /**
     * {@code GET  /yunalishes/:id} : get the "id" yunalish.
     *
     * @param id the id of the yunalish to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the yunalish, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/yunalishes/{id}")
    public ResponseEntity<Yunalish> getYunalish(@PathVariable Long id) {
        log.debug("REST request to get Yunalish : {}", id);
        Optional<Yunalish> yunalish = yunalishRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(yunalish);
    }

    /**
     * {@code DELETE  /yunalishes/:id} : delete the "id" yunalish.
     *
     * @param id the id of the yunalish to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/yunalishes/{id}")
    public ResponseEntity<Void> deleteYunalish(@PathVariable Long id) {
        log.debug("REST request to delete Yunalish : {}", id);
        yunalishRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
