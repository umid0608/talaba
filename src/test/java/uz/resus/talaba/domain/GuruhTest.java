package uz.resus.talaba.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uz.resus.talaba.web.rest.TestUtil;

class GuruhTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Guruh.class);
        Guruh guruh1 = new Guruh();
        guruh1.setId(1L);
        Guruh guruh2 = new Guruh();
        guruh2.setId(guruh1.getId());
        assertThat(guruh1).isEqualTo(guruh2);
        guruh2.setId(2L);
        assertThat(guruh1).isNotEqualTo(guruh2);
        guruh1.setId(null);
        assertThat(guruh1).isNotEqualTo(guruh2);
    }
}
