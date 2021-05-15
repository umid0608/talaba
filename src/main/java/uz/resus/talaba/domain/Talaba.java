package uz.resus.talaba.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Talaba.
 */
@Entity
@Table(name = "talaba")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Talaba implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "ism", nullable = false)
    private String ism;

    @Column(name = "familiya")
    private String familiya;

    @Column(name = "sharif")
    private String sharif;

    @Column(name = "tugilgan_kun")
    private LocalDate tugilganKun;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "yunalish" }, allowSetters = true)
    private Guruh guruh;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Talaba id(Long id) {
        this.id = id;
        return this;
    }

    public String getIsm() {
        return this.ism;
    }

    public Talaba ism(String ism) {
        this.ism = ism;
        return this;
    }

    public void setIsm(String ism) {
        this.ism = ism;
    }

    public String getFamiliya() {
        return this.familiya;
    }

    public Talaba familiya(String familiya) {
        this.familiya = familiya;
        return this;
    }

    public void setFamiliya(String familiya) {
        this.familiya = familiya;
    }

    public String getSharif() {
        return this.sharif;
    }

    public Talaba sharif(String sharif) {
        this.sharif = sharif;
        return this;
    }

    public void setSharif(String sharif) {
        this.sharif = sharif;
    }

    public LocalDate getTugilganKun() {
        return this.tugilganKun;
    }

    public Talaba tugilganKun(LocalDate tugilganKun) {
        this.tugilganKun = tugilganKun;
        return this;
    }

    public void setTugilganKun(LocalDate tugilganKun) {
        this.tugilganKun = tugilganKun;
    }

    public Guruh getGuruh() {
        return this.guruh;
    }

    public Talaba guruh(Guruh guruh) {
        this.setGuruh(guruh);
        return this;
    }

    public void setGuruh(Guruh guruh) {
        this.guruh = guruh;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Talaba)) {
            return false;
        }
        return id != null && id.equals(((Talaba) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Talaba{" +
            "id=" + getId() +
            ", ism='" + getIsm() + "'" +
            ", familiya='" + getFamiliya() + "'" +
            ", sharif='" + getSharif() + "'" +
            ", tugilganKun='" + getTugilganKun() + "'" +
            "}";
    }
}
