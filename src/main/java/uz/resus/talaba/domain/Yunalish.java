package uz.resus.talaba.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Yunalish.
 */
@Entity
@Table(name = "yunalish")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Yunalish implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "kod")
    private String kod;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Yunalish id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Yunalish nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getKod() {
        return this.kod;
    }

    public Yunalish kod(String kod) {
        this.kod = kod;
        return this;
    }

    public void setKod(String kod) {
        this.kod = kod;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Yunalish)) {
            return false;
        }
        return id != null && id.equals(((Yunalish) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Yunalish{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", kod='" + getKod() + "'" +
            "}";
    }
}
