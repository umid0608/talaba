package uz.resus.talaba.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uz.resus.talaba.IntegrationTest;
import uz.resus.talaba.domain.Guruh;
import uz.resus.talaba.domain.Talaba;
import uz.resus.talaba.repository.TalabaRepository;

/**
 * Integration tests for the {@link TalabaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TalabaResourceIT {

    private static final String DEFAULT_ISM = "AAAAAAAAAA";
    private static final String UPDATED_ISM = "BBBBBBBBBB";

    private static final String DEFAULT_FAMILIYA = "AAAAAAAAAA";
    private static final String UPDATED_FAMILIYA = "BBBBBBBBBB";

    private static final String DEFAULT_SHARIF = "AAAAAAAAAA";
    private static final String UPDATED_SHARIF = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_TUGILGAN_KUN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_TUGILGAN_KUN = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/talabas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TalabaRepository talabaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTalabaMockMvc;

    private Talaba talaba;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Talaba createEntity(EntityManager em) {
        Talaba talaba = new Talaba().ism(DEFAULT_ISM).familiya(DEFAULT_FAMILIYA).sharif(DEFAULT_SHARIF).tugilganKun(DEFAULT_TUGILGAN_KUN);
        // Add required entity
        Guruh guruh;
        if (TestUtil.findAll(em, Guruh.class).isEmpty()) {
            guruh = GuruhResourceIT.createEntity(em);
            em.persist(guruh);
            em.flush();
        } else {
            guruh = TestUtil.findAll(em, Guruh.class).get(0);
        }
        talaba.setGuruh(guruh);
        return talaba;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Talaba createUpdatedEntity(EntityManager em) {
        Talaba talaba = new Talaba().ism(UPDATED_ISM).familiya(UPDATED_FAMILIYA).sharif(UPDATED_SHARIF).tugilganKun(UPDATED_TUGILGAN_KUN);
        // Add required entity
        Guruh guruh;
        if (TestUtil.findAll(em, Guruh.class).isEmpty()) {
            guruh = GuruhResourceIT.createUpdatedEntity(em);
            em.persist(guruh);
            em.flush();
        } else {
            guruh = TestUtil.findAll(em, Guruh.class).get(0);
        }
        talaba.setGuruh(guruh);
        return talaba;
    }

    @BeforeEach
    public void initTest() {
        talaba = createEntity(em);
    }

    @Test
    @Transactional
    void createTalaba() throws Exception {
        int databaseSizeBeforeCreate = talabaRepository.findAll().size();
        // Create the Talaba
        restTalabaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(talaba)))
            .andExpect(status().isCreated());

        // Validate the Talaba in the database
        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeCreate + 1);
        Talaba testTalaba = talabaList.get(talabaList.size() - 1);
        assertThat(testTalaba.getIsm()).isEqualTo(DEFAULT_ISM);
        assertThat(testTalaba.getFamiliya()).isEqualTo(DEFAULT_FAMILIYA);
        assertThat(testTalaba.getSharif()).isEqualTo(DEFAULT_SHARIF);
        assertThat(testTalaba.getTugilganKun()).isEqualTo(DEFAULT_TUGILGAN_KUN);
    }

    @Test
    @Transactional
    void createTalabaWithExistingId() throws Exception {
        // Create the Talaba with an existing ID
        talaba.setId(1L);

        int databaseSizeBeforeCreate = talabaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTalabaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(talaba)))
            .andExpect(status().isBadRequest());

        // Validate the Talaba in the database
        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkIsmIsRequired() throws Exception {
        int databaseSizeBeforeTest = talabaRepository.findAll().size();
        // set the field null
        talaba.setIsm(null);

        // Create the Talaba, which fails.

        restTalabaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(talaba)))
            .andExpect(status().isBadRequest());

        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTalabas() throws Exception {
        // Initialize the database
        talabaRepository.saveAndFlush(talaba);

        // Get all the talabaList
        restTalabaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(talaba.getId().intValue())))
            .andExpect(jsonPath("$.[*].ism").value(hasItem(DEFAULT_ISM)))
            .andExpect(jsonPath("$.[*].familiya").value(hasItem(DEFAULT_FAMILIYA)))
            .andExpect(jsonPath("$.[*].sharif").value(hasItem(DEFAULT_SHARIF)))
            .andExpect(jsonPath("$.[*].tugilganKun").value(hasItem(DEFAULT_TUGILGAN_KUN.toString())));
    }

    @Test
    @Transactional
    void getTalaba() throws Exception {
        // Initialize the database
        talabaRepository.saveAndFlush(talaba);

        // Get the talaba
        restTalabaMockMvc
            .perform(get(ENTITY_API_URL_ID, talaba.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(talaba.getId().intValue()))
            .andExpect(jsonPath("$.ism").value(DEFAULT_ISM))
            .andExpect(jsonPath("$.familiya").value(DEFAULT_FAMILIYA))
            .andExpect(jsonPath("$.sharif").value(DEFAULT_SHARIF))
            .andExpect(jsonPath("$.tugilganKun").value(DEFAULT_TUGILGAN_KUN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTalaba() throws Exception {
        // Get the talaba
        restTalabaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTalaba() throws Exception {
        // Initialize the database
        talabaRepository.saveAndFlush(talaba);

        int databaseSizeBeforeUpdate = talabaRepository.findAll().size();

        // Update the talaba
        Talaba updatedTalaba = talabaRepository.findById(talaba.getId()).get();
        // Disconnect from session so that the updates on updatedTalaba are not directly saved in db
        em.detach(updatedTalaba);
        updatedTalaba.ism(UPDATED_ISM).familiya(UPDATED_FAMILIYA).sharif(UPDATED_SHARIF).tugilganKun(UPDATED_TUGILGAN_KUN);

        restTalabaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTalaba.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTalaba))
            )
            .andExpect(status().isOk());

        // Validate the Talaba in the database
        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeUpdate);
        Talaba testTalaba = talabaList.get(talabaList.size() - 1);
        assertThat(testTalaba.getIsm()).isEqualTo(UPDATED_ISM);
        assertThat(testTalaba.getFamiliya()).isEqualTo(UPDATED_FAMILIYA);
        assertThat(testTalaba.getSharif()).isEqualTo(UPDATED_SHARIF);
        assertThat(testTalaba.getTugilganKun()).isEqualTo(UPDATED_TUGILGAN_KUN);
    }

    @Test
    @Transactional
    void putNonExistingTalaba() throws Exception {
        int databaseSizeBeforeUpdate = talabaRepository.findAll().size();
        talaba.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTalabaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, talaba.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(talaba))
            )
            .andExpect(status().isBadRequest());

        // Validate the Talaba in the database
        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTalaba() throws Exception {
        int databaseSizeBeforeUpdate = talabaRepository.findAll().size();
        talaba.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTalabaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(talaba))
            )
            .andExpect(status().isBadRequest());

        // Validate the Talaba in the database
        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTalaba() throws Exception {
        int databaseSizeBeforeUpdate = talabaRepository.findAll().size();
        talaba.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTalabaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(talaba)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Talaba in the database
        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTalabaWithPatch() throws Exception {
        // Initialize the database
        talabaRepository.saveAndFlush(talaba);

        int databaseSizeBeforeUpdate = talabaRepository.findAll().size();

        // Update the talaba using partial update
        Talaba partialUpdatedTalaba = new Talaba();
        partialUpdatedTalaba.setId(talaba.getId());

        restTalabaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTalaba.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTalaba))
            )
            .andExpect(status().isOk());

        // Validate the Talaba in the database
        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeUpdate);
        Talaba testTalaba = talabaList.get(talabaList.size() - 1);
        assertThat(testTalaba.getIsm()).isEqualTo(DEFAULT_ISM);
        assertThat(testTalaba.getFamiliya()).isEqualTo(DEFAULT_FAMILIYA);
        assertThat(testTalaba.getSharif()).isEqualTo(DEFAULT_SHARIF);
        assertThat(testTalaba.getTugilganKun()).isEqualTo(DEFAULT_TUGILGAN_KUN);
    }

    @Test
    @Transactional
    void fullUpdateTalabaWithPatch() throws Exception {
        // Initialize the database
        talabaRepository.saveAndFlush(talaba);

        int databaseSizeBeforeUpdate = talabaRepository.findAll().size();

        // Update the talaba using partial update
        Talaba partialUpdatedTalaba = new Talaba();
        partialUpdatedTalaba.setId(talaba.getId());

        partialUpdatedTalaba.ism(UPDATED_ISM).familiya(UPDATED_FAMILIYA).sharif(UPDATED_SHARIF).tugilganKun(UPDATED_TUGILGAN_KUN);

        restTalabaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTalaba.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTalaba))
            )
            .andExpect(status().isOk());

        // Validate the Talaba in the database
        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeUpdate);
        Talaba testTalaba = talabaList.get(talabaList.size() - 1);
        assertThat(testTalaba.getIsm()).isEqualTo(UPDATED_ISM);
        assertThat(testTalaba.getFamiliya()).isEqualTo(UPDATED_FAMILIYA);
        assertThat(testTalaba.getSharif()).isEqualTo(UPDATED_SHARIF);
        assertThat(testTalaba.getTugilganKun()).isEqualTo(UPDATED_TUGILGAN_KUN);
    }

    @Test
    @Transactional
    void patchNonExistingTalaba() throws Exception {
        int databaseSizeBeforeUpdate = talabaRepository.findAll().size();
        talaba.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTalabaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, talaba.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(talaba))
            )
            .andExpect(status().isBadRequest());

        // Validate the Talaba in the database
        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTalaba() throws Exception {
        int databaseSizeBeforeUpdate = talabaRepository.findAll().size();
        talaba.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTalabaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(talaba))
            )
            .andExpect(status().isBadRequest());

        // Validate the Talaba in the database
        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTalaba() throws Exception {
        int databaseSizeBeforeUpdate = talabaRepository.findAll().size();
        talaba.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTalabaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(talaba)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Talaba in the database
        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTalaba() throws Exception {
        // Initialize the database
        talabaRepository.saveAndFlush(talaba);

        int databaseSizeBeforeDelete = talabaRepository.findAll().size();

        // Delete the talaba
        restTalabaMockMvc
            .perform(delete(ENTITY_API_URL_ID, talaba.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Talaba> talabaList = talabaRepository.findAll();
        assertThat(talabaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
