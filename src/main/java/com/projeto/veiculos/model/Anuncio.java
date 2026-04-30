package com.projeto.veiculos.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Anuncio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataCriacao;
    private String descricao;

    @ManyToOne
    private Usuario usuario;

    @ManyToOne
    private Veiculo veiculo;

    // GETTERS

    public Long getId() { return id; }

    public LocalDate getDataCriacao() { return dataCriacao; }

    public Usuario getUsuario() { return usuario; }

    public Veiculo getVeiculo() { return veiculo; }

    public String getDescricao() {return descricao;}


    // SETTERS

    public void setId(Long id) { this.id = id; }

    public void setDataCriacao(LocalDate dataCriacao) { this.dataCriacao = dataCriacao; }

    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public void setVeiculo(Veiculo veiculo) { this.veiculo = veiculo; }

    public void setDescricao(String descricao) { this.descricao = descricao;}


}