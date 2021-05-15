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
import uz.resus.talaba.domain.Yunalish;
import uz.resus.talaba.repository.YunalishRepository;

/**
 * Integration tests for the {@link YunalishResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class YunalishResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_KOD = "AAAAAAAAAA";
    private static final String UPDATED_KOD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/yunalishes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private YunalishRepository yunalishRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restYunalishMockMvc;

    private Yunalish yunalish;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Yunalish createEntity(EntityManager em) {
        Yunalish yunalish = new Yunalish().nom(DEFAULT_NOM).kod(DEFAULT_KOD);
        return yunalish;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Yunalish createUpdatedEntity(EntityManager em) {
        Yunalish yunalish = new Yunalish().nom(UPDATED_NOM).kod(UPDATED_KOD);
        return yunalish;
    }

    @BeforeEach
    public void initTest() {
        yunalish = createEntity(em);
    }

    @Test
    @Transactional
    void createYunalish() throws Exception {
        int databaseSizeBeforeCreate = yunalishRepository.findAll().size();
        // Create the Yunalish
        restYunalishMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(yunalish)))
            .andExpect(status().isCreated());

        // Validate the Yunalish in the database
        List<Yunalish> yunalishList = yunalishRepository.findAll();
        assertThat(yunalishList).hasSize(databaseSizeBeforeCreate + 1);
        Yunalish testYunalish = yunalishList.get(yunalishList.size() - 1);
        assertThat(testYunalish.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testYunalish.getKod()).isEqualTo(DEFAULT_KOD);
    }

    @Test
    @Transactional
    void createYunalishWithExistingId() throws Exception {
        // Create the Yunalish with an existing ID
        yunalish.setId(1L);

        int databaseSizeBeforeCreate = yunalishRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restYunalishMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(yunalish)))
            .andExpect(status().isBadRequest());

        // Validate the Yunalish in the database
        List<Yunalish> yunalishList = yunalishRepository.findAll();
        assertThat(yunalishList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllYunalishes() throws Exception {
        // Initialize the database
        yunalishRepository.saveAndFlush(yunalish);

        // Get all the yunalishList
        restYunalishMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(yunalish.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].kod").value(hasItem(DEFAULT_KOD)));
    }

    @Test
    @Transactional
    void getYunalish() throws Exception {
        // Initialize the database
        yunalishRepository.saveAndFlush(yunalish);

        // Get the yunalish
        restYunalishMockMvc
            .perform(get(ENTITY_API_URL_ID, yunalish.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(yunalish.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.kod").value(DEFAULT_KOD));
    }

    @Test
    @Transactional
    void getNonExistingYunalish() throws Exception {
        // Get the yunalish
        restYunalishMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewYunalish() throws Exception {
        // Initialize the database
        yunalishRepository.saveAndFlush(yunalish);

        int databaseSizeBeforeUpdate = yunalishRepository.findAll().size();

        // Update the yunalish
        Yunalish updatedYunalish = yunalishRepository.findById(yunalish.getId()).get();
        // Disconnect from session so that the updates on updatedYunalish are not directly saved in db
        em.detach(updatedYunalish);
        updatedYunalish.nom(UPDATED_NOM).kod(UPDATED_KOD);

        restYunalishMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedYunalish.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedYunalish))
            )
            .andExpect(status().isOk());

        // Validate the Yunalish in the database
        List<Yunalish> yunalishList = yunalishRepository.findAll();
        assertThat(yunalishList).hasSize(databaseSizeBeforeUpdate);
        Yunalish testYunalish = yunalishList.get(yunalishList.size() - 1);
        assertThat(testYunalish.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testYunalish.getKod()).isEqualTo(UPDATED_KOD);
    }

    @Test
    @Transactional
    void putNonExistingYunalish() throws Exception {
        int databaseSizeBeforeUpdate = yunalishRepository.findAll().size();
        yunalish.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restYunalishMockMvc
            .perform(
                put(ENTITY_API_URL_ID, yunalish.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(yunalish))
            )
            .andExpect(status().isBadRequest());

        // Validate the Yunalish in the database
        List<Yunalish> yunalishList = yunalishRepository.findAll();
        assertThat(yunalishList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchYunalish() throws Exception {
        int databaseSizeBeforeUpdate = yunalishRepository.findAll().size();
        yunalish.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restYunalishMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(yunalish))
            )
            .andExpect(status().isBadRequest());

        // Validate the Yunalish in the database
        List<Yunalish> yunalishList = yunalishRepository.findAll();
        assertThat(yunalishList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamYunalish() throws Exception {
        int databaseSizeBeforeUpdate = yunalishRepository.findAll().size();
        yunalish.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restYunalishMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(yunalish)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Yunalish in the database
        List<Yunalish> yunalishList = yunalishRepository.findAll();
        assertThat(yunalishList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateYunalishWithPatch() throws Exception {
        // Initialize the database
        yunalishRepository.saveAndFlush(yunalish);

        int databaseSizeBeforeUpdate = yunalishRepository.findAll().size();

        // Update the yunalish using partial update
        Yunalish partialUpdatedYunalish = new Yunalish();
        partialUpdatedYunalish.setId(yunalish.getId());

        partialUpdatedYunalish.kod(UPDATED_KOD);

        restYunalishMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedYunalish.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedYunalish))
            )
            .andExpect(status().isOk());

        // Validate the Yunalish in the database
        List<Yunalish> yunalishList = yunalishRepository.findAll();
        assertThat(yunalishList).hasSize(databaseSizeBeforeUpdate);
        Yunalish testYunalish = yunalishList.get(yunalishList.size() - 1);
        assertThat(testYunalish.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testYunalish.getKod()).isEqualTo(UPDATED_KOD);
    }

    @Test
    @Transactional
    void fullUpdateYunalishWithPatch() throws Exception {
        // Initialize the database
        yunalishRepository.saveAndFlush(yunalish);

        int databaseSizeBeforeUpdate = yunalishRepository.findAll().size();

        // Update the yunalish using partial update
        Yunalish partialUpdatedYunalish = new Yunalish();
        partialUpdatedYunalish.setId(yunalish.getId());

        partialUpdatedYunalish.nom(UPDATED_NOM).kod(UPDATED_KOD);

        restYunalishMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedYunalish.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedYunalish))
            )
            .andExpect(status().isOk());

        // Validate the Yunalish in the database
        List<Yunalish> yunalishList = yunalishRepository.findAll();
        assertThat(yunalishList).hasSize(databaseSizeBeforeUpdate);
        Yunalish testYunalish = yunalishList.get(yunalishList.size() - 1);
        assertThat(testYunalish.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testYunalish.getKod()).isEqualTo(UPDATED_KOD);
    }

    @Test
    @Transactional
    void patchNonExistingYunalish() throws Exception {
        int databaseSizeBeforeUpdate = yunalishRepository.findAll().size();
        yunalish.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restYunalishMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, yunalish.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(yunalish))
            )
            .andExpect(status().isBadRequest());

        // Validate the Yunalish in the database
        List<Yunalish> yunalishList = yunalishRepository.findAll();
        assertThat(yunalishList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchYunalish() throws Exception {
        int databaseSizeBeforeUpdate = yunalishRepository.findAll().size();
        yunalish.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restYunalishMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(yunalish))
            )
            .andExpect(status().isBadRequest());

        // Validate the Yunalish in the database
        List<Yunalish> yunalishList = yunalishRepository.findAll();
        assertThat(yunalishList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamYunalish() throws Exception {
        int databaseSizeBeforeUpdate = yunalishRepository.findAll().size();
        yunalish.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restYunalishMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(yunalish)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Yunalish in the database
        List<Yunalish> yunalishList = yunalishRepository.findAll();
        assertThat(yunalishList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteYunalish() throws Exception {
        // Initialize the database
        yunalishRepository.saveAndFlush(yunalish);

        int databaseSizeBeforeDelete = yunalishRepository.findAll().size();

        // Delete the yunalish
        restYunalishMockMvc
            .perform(delete(ENTITY_API_URL_ID, yunalish.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Yunalish> yunalishList = yunalishRepository.findAll();
        assertThat(yunalishList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
