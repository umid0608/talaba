package uz.resus.talaba.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Guruh.
 */
@Entity
@Table(name = "guruh")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Guruh implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotNull
    @Column(name = "yil", nullable = false)
    private Integer yil;

    @ManyToOne(optional = false)
    @NotNull
    private Yunalish yunalish;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Guruh id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Guruh nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Integer getYil() {
        return this.yil;
    }

    public Guruh yil(Integer yil) {
        this.yil = yil;
        return this;
    }

    public void setYil(Integer yil) {
        this.yil = yil;
    }

    public Yunalish getYunalish() {
        return this.yunalish;
    }

    public Guruh yunalish(Yunalish yunalish) {
        this.setYunalish(yunalish);
        return this;
    }

    public void setYunalish(Yunalish yunalish) {
        this.yunalish = yunalish;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Guruh)) {
            return false;
        }
        return id != null && id.equals(((Guruh) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Guruh{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", yil=" + getYil() +
            "}";
    }
}
