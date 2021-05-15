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
import uz.resus.talaba.domain.Talaba;
import uz.resus.talaba.repository.TalabaRepository;
import uz.resus.talaba.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uz.resus.talaba.domain.Talaba}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TalabaResource {

    private final Logger log = LoggerFactory.getLogger(TalabaResource.class);

    private static final String ENTITY_NAME = "talaba";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TalabaRepository talabaRepository;

    public TalabaResource(TalabaRepository talabaRepository) {
        this.talabaRepository = talabaRepository;
    }

    /**
     * {@code POST  /talabas} : Create a new talaba.
     *
     * @param talaba the talaba to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new talaba, or with status {@code 400 (Bad Request)} if the talaba has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/talabas")
    public ResponseEntity<Talaba> createTalaba(@Valid @RequestBody Talaba talaba) throws URISyntaxException {
        log.debug("REST request to save Talaba : {}", talaba);
        if (talaba.getId() != null) {
            throw new BadRequestAlertException("A new talaba cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Talaba result = talabaRepository.save(talaba);
        return ResponseEntity
            .created(new URI("/api/talabas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /talabas/:id} : Updates an existing talaba.
     *
     * @param id the id of the talaba to save.
     * @param talaba the talaba to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated talaba,
     * or with status {@code 400 (Bad Request)} if the talaba is not valid,
     * or with status {@code 500 (Internal Server Error)} if the talaba couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/talabas/{id}")
    public ResponseEntity<Talaba> updateTalaba(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Talaba talaba
    ) throws URISyntaxException {
        log.debug("REST request to update Talaba : {}, {}", id, talaba);
        if (talaba.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, talaba.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!talabaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Talaba result = talabaRepository.save(talaba);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, talaba.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /talabas/:id} : Partial updates given fields of an existing talaba, field will ignore if it is null
     *
     * @param id the id of the talaba to save.
     * @param talaba the talaba to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated talaba,
     * or with status {@code 400 (Bad Request)} if the talaba is not valid,
     * or with status {@code 404 (Not Found)} if the talaba is not found,
     * or with status {@code 500 (Internal Server Error)} if the talaba couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/talabas/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Talaba> partialUpdateTalaba(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Talaba talaba
    ) throws URISyntaxException {
        log.debug("REST request to partial update Talaba partially : {}, {}", id, talaba);
        if (talaba.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, talaba.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!talabaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Talaba> result = talabaRepository
            .findById(talaba.getId())
            .map(
                existingTalaba -> {
                    if (talaba.getIsm() != null) {
                        existingTalaba.setIsm(talaba.getIsm());
                    }
                    if (talaba.getFamiliya() != null) {
                        existingTalaba.setFamiliya(talaba.getFamiliya());
                    }
                    if (talaba.getSharif() != null) {
                        existingTalaba.setSharif(talaba.getSharif());
                    }
                    if (talaba.getTugilganKun() != null) {
                        existingTalaba.setTugilganKun(talaba.getTugilganKun());
                    }

                    return existingTalaba;
                }
            )
            .map(talabaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, talaba.getId().toString())
        );
    }

    /**
     * {@code GET  /talabas} : get all the talabas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of talabas in body.
     */
    @GetMapping("/talabas")
    public List<Talaba> getAllTalabas() {
        log.debug("REST request to get all Talabas");
        return talabaRepository.findAll();
    }

    /**
     * {@code GET  /talabas/:id} : get the "id" talaba.
     *
     * @param id the id of the talaba to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the talaba, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/talabas/{id}")
    public ResponseEntity<Talaba> getTalaba(@PathVariable Long id) {
        log.debug("REST request to get Talaba : {}", id);
        Optional<Talaba> talaba = talabaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(talaba);
    }

    /**
     * {@code DELETE  /talabas/:id} : delete the "id" talaba.
     *
     * @param id the id of the talaba to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/talabas/{id}")
    public ResponseEntity<Void> deleteTalaba(@PathVariable Long id) {
        log.debug("REST request to delete Talaba : {}", id);
        talabaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
