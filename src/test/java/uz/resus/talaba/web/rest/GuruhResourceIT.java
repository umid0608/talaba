package uz.resus.talaba.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import uz.resus.talaba.domain.Yunalish;
import uz.resus.talaba.repository.GuruhRepository;

/**
 * Integration tests for the {@link GuruhResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GuruhResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final Integer DEFAULT_YIL = 1;
    private static final Integer UPDATED_YIL = 2;

    private static final String ENTITY_API_URL = "/api/guruhs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GuruhRepository guruhRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGuruhMockMvc;

    private Guruh guruh;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Guruh createEntity(EntityManager em) {
        Guruh guruh = new Guruh().nom(DEFAULT_NOM).yil(DEFAULT_YIL);
        // Add required entity
        Yunalish yunalish;
        if (TestUtil.findAll(em, Yunalish.class).isEmpty()) {
            yunalish = YunalishResourceIT.createEntity(em);
            em.persist(yunalish);
            em.flush();
        } else {
            yunalish = TestUtil.findAll(em, Yunalish.class).get(0);
        }
        guruh.setYunalish(yunalish);
        return guruh;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Guruh createUpdatedEntity(EntityManager em) {
        Guruh guruh = new Guruh().nom(UPDATED_NOM).yil(UPDATED_YIL);
        // Add required entity
        Yunalish yunalish;
        if (TestUtil.findAll(em, Yunalish.class).isEmpty()) {
            yunalish = YunalishResourceIT.createUpdatedEntity(em);
            em.persist(yunalish);
            em.flush();
        } else {
            yunalish = TestUtil.findAll(em, Yunalish.class).get(0);
        }
        guruh.setYunalish(yunalish);
        return guruh;
    }

    @BeforeEach
    public void initTest() {
        guruh = createEntity(em);
    }

    @Test
    @Transactional
    void createGuruh() throws Exception {
        int databaseSizeBeforeCreate = guruhRepository.findAll().size();
        // Create the Guruh
        restGuruhMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guruh)))
            .andExpect(status().isCreated());

        // Validate the Guruh in the database
        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeCreate + 1);
        Guruh testGuruh = guruhList.get(guruhList.size() - 1);
        assertThat(testGuruh.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testGuruh.getYil()).isEqualTo(DEFAULT_YIL);
    }

    @Test
    @Transactional
    void createGuruhWithExistingId() throws Exception {
        // Create the Guruh with an existing ID
        guruh.setId(1L);

        int databaseSizeBeforeCreate = guruhRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGuruhMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guruh)))
            .andExpect(status().isBadRequest());

        // Validate the Guruh in the database
        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = guruhRepository.findAll().size();
        // set the field null
        guruh.setNom(null);

        // Create the Guruh, which fails.

        restGuruhMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guruh)))
            .andExpect(status().isBadRequest());

        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkYilIsRequired() throws Exception {
        int databaseSizeBeforeTest = guruhRepository.findAll().size();
        // set the field null
        guruh.setYil(null);

        // Create the Guruh, which fails.

        restGuruhMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guruh)))
            .andExpect(status().isBadRequest());

        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGuruhs() throws Exception {
        // Initialize the database
        guruhRepository.saveAndFlush(guruh);

        // Get all the guruhList
        restGuruhMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(guruh.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].yil").value(hasItem(DEFAULT_YIL)));
    }

    @Test
    @Transactional
    void getGuruh() throws Exception {
        // Initialize the database
        guruhRepository.saveAndFlush(guruh);

        // Get the guruh
        restGuruhMockMvc
            .perform(get(ENTITY_API_URL_ID, guruh.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(guruh.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.yil").value(DEFAULT_YIL));
    }

    @Test
    @Transactional
    void getNonExistingGuruh() throws Exception {
        // Get the guruh
        restGuruhMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGuruh() throws Exception {
        // Initialize the database
        guruhRepository.saveAndFlush(guruh);

        int databaseSizeBeforeUpdate = guruhRepository.findAll().size();

        // Update the guruh
        Guruh updatedGuruh = guruhRepository.findById(guruh.getId()).get();
        // Disconnect from session so that the updates on updatedGuruh are not directly saved in db
        em.detach(updatedGuruh);
        updatedGuruh.nom(UPDATED_NOM).yil(UPDATED_YIL);

        restGuruhMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGuruh.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGuruh))
            )
            .andExpect(status().isOk());

        // Validate the Guruh in the database
        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeUpdate);
        Guruh testGuruh = guruhList.get(guruhList.size() - 1);
        assertThat(testGuruh.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testGuruh.getYil()).isEqualTo(UPDATED_YIL);
    }

    @Test
    @Transactional
    void putNonExistingGuruh() throws Exception {
        int databaseSizeBeforeUpdate = guruhRepository.findAll().size();
        guruh.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGuruhMockMvc
            .perform(
                put(ENTITY_API_URL_ID, guruh.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(guruh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guruh in the database
        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGuruh() throws Exception {
        int databaseSizeBeforeUpdate = guruhRepository.findAll().size();
        guruh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGuruhMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(guruh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guruh in the database
        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGuruh() throws Exception {
        int databaseSizeBeforeUpdate = guruhRepository.findAll().size();
        guruh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGuruhMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guruh)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Guruh in the database
        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGuruhWithPatch() throws Exception {
        // Initialize the database
        guruhRepository.saveAndFlush(guruh);

        int databaseSizeBeforeUpdate = guruhRepository.findAll().size();

        // Update the guruh using partial update
        Guruh partialUpdatedGuruh = new Guruh();
        partialUpdatedGuruh.setId(guruh.getId());

        partialUpdatedGuruh.nom(UPDATED_NOM).yil(UPDATED_YIL);

        restGuruhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGuruh.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGuruh))
            )
            .andExpect(status().isOk());

        // Validate the Guruh in the database
        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeUpdate);
        Guruh testGuruh = guruhList.get(guruhList.size() - 1);
        assertThat(testGuruh.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testGuruh.getYil()).isEqualTo(UPDATED_YIL);
    }

    @Test
    @Transactional
    void fullUpdateGuruhWithPatch() throws Exception {
        // Initialize the database
        guruhRepository.saveAndFlush(guruh);

        int databaseSizeBeforeUpdate = guruhRepository.findAll().size();

        // Update the guruh using partial update
        Guruh partialUpdatedGuruh = new Guruh();
        partialUpdatedGuruh.setId(guruh.getId());

        partialUpdatedGuruh.nom(UPDATED_NOM).yil(UPDATED_YIL);

        restGuruhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGuruh.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGuruh))
            )
            .andExpect(status().isOk());

        // Validate the Guruh in the database
        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeUpdate);
        Guruh testGuruh = guruhList.get(guruhList.size() - 1);
        assertThat(testGuruh.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testGuruh.getYil()).isEqualTo(UPDATED_YIL);
    }

    @Test
    @Transactional
    void patchNonExistingGuruh() throws Exception {
        int databaseSizeBeforeUpdate = guruhRepository.findAll().size();
        guruh.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGuruhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, guruh.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(guruh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guruh in the database
        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGuruh() throws Exception {
        int databaseSizeBeforeUpdate = guruhRepository.findAll().size();
        guruh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGuruhMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(guruh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guruh in the database
        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGuruh() throws Exception {
        int databaseSizeBeforeUpdate = guruhRepository.findAll().size();
        guruh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGuruhMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(guruh)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Guruh in the database
        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGuruh() throws Exception {
        // Initialize the database
        guruhRepository.saveAndFlush(guruh);

        int databaseSizeBeforeDelete = guruhRepository.findAll().size();

        // Delete the guruh
        restGuruhMockMvc
            .perform(delete(ENTITY_API_URL_ID, guruh.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Guruh> guruhList = guruhRepository.findAll();
        assertThat(guruhList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
