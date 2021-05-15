package uz.resus.talaba.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uz.resus.talaba.web.rest.TestUtil;

class TalabaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Talaba.class);
        Talaba talaba1 = new Talaba();
        talaba1.setId(1L);
        Talaba talaba2 = new Talaba();
        talaba2.setId(talaba1.getId());
        assertThat(talaba1).isEqualTo(talaba2);
        talaba2.setId(2L);
        assertThat(talaba1).isNotEqualTo(talaba2);
        talaba1.setId(null);
        assertThat(talaba1).isNotEqualTo(talaba2);
    }
}
