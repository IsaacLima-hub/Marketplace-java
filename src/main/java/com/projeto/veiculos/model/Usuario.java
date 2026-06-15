package com.projeto.veiculos.model;

import jakarta.persistence.*;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String senha;
    @Column(unique = true)
    private String cpf;

    @Column(unique = true)
    private String telefone;

    @Column(unique = true)
    private String email;

    private Boolean admin = false;

    // GETTERS
    public Long getId() { return id; }

    public String getNome() { return nome; }

    public String getEmail() { return email; }

    public String getSenha() { return senha; }

    public String getTelefone() { return telefone; }

    public Boolean getAdmin() { return admin; }

    public String getCpf() {return cpf;}

    // SETTERS
    public void setId(Long id) { this.id = id; }

    public void setNome(String nome) { this.nome = nome; }

    public void setEmail(String email) { this.email = email; }

    public void setSenha(String senha) { this.senha = senha; }

    public void setTelefone(String telefone) { this.telefone = telefone; }

    public void setAdmin(Boolean admin) { this.admin = admin; }

    public void setCpf(String cpf) {this.cpf = cpf;}

}