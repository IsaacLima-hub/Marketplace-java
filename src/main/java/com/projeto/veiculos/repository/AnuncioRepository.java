package com.projeto.veiculos.repository;

import com.projeto.veiculos.model.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {
    List<Anuncio> findByVeiculoDisponivelTrue();
}