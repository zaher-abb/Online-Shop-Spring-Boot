package th.project.enterprise.Entity;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Builder
@Entity
@Setter
@Getter
@AllArgsConstructor
@Table(name = "euser")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String firstName;
    private String lastName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "adress_id")
    private Adress adress;

    private String roles;

    @NotNull
    @Size(min = 4)
    private String password;

    @NotNull
    @Column(nullable = false, unique = true)
    private String Email;

    public User() {
        setRoles("USER");
    }


    public void setAdress(Adress adress) {
        this.adress = adress;
    }

    public Adress getAdress() {
        return adress;
    }

    public String getFullname() {
        return this.getFirstName() + " " + this.getLastName();
    }


}