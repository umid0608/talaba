package uz.resus.talaba.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uz.resus.talaba.web.rest.TestUtil;

class YunalishTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Yunalish.class);
        Yunalish yunalish1 = new Yunalish();
        yunalish1.setId(1L);
        Yunalish yunalish2 = new Yunalish();
        yunalish2.setId(yunalish1.getId());
        assertThat(yunalish1).isEqualTo(yunalish2);
        yunalish2.setId(2L);
        assertThat(yunalish1).isNotEqualTo(yunalish2);
        yunalish1.setId(null);
        assertThat(yunalish1).isNotEqualTo(yunalish2);
    }
}
