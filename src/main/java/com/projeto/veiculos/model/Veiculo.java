package com.projeto.veiculos.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String marca;
    private String modelo;
    private int ano;
    private double preco;

    @Column(columnDefinition = "LONGTEXT")
    private String imagem;

    @Column(length = 1000)
    private String descricao;

    private LocalDate dataAnuncio;
    private boolean disponivel;

    // GETTERS

    public Long getId() {
        return id;
    }

    public String getMarca() {
        return marca;
    }

    public String getModelo() {
        return modelo;
    }

    public int getAno() {
        return ano;
    }

    public double getPreco() {
        return preco;
    }

    public String getDescricao() {
        return descricao;
    }

    public LocalDate getDataAnuncio() {
        return dataAnuncio;
    }

    public boolean isDisponivel() {
        return disponivel;
    }
    public String getImagem() {return imagem;}

    // SETTERS

    public void setId(Long id) {
        this.id = id;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public void setAno(int ano) {
        this.ano = ano;
    }

    public void setPreco(double preco) {
        this.preco = preco;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setDataAnuncio(LocalDate dataAnuncio) {
        this.dataAnuncio = dataAnuncio;
    }

    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }
    public void setImagem(String imagem) {
        this.imagem = imagem;
    }
}