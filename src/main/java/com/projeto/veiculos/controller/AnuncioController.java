package com.projeto.veiculos.controller;

import com.projeto.veiculos.model.Usuario;
import com.projeto.veiculos.model.Veiculo;
import com.projeto.veiculos.repository.UsuarioRepository;
import com.projeto.veiculos.repository.VeiculoRepository;

import com.projeto.veiculos.model.Anuncio;
import com.projeto.veiculos.repository.AnuncioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/anuncios")
public class AnuncioController {

    @Autowired
    private AnuncioRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VeiculoRepository veiculoRepository;

    @GetMapping
    public List<Anuncio> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Anuncio buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }
    @GetMapping("/disponiveis")
    public List<Anuncio> listarDisponiveis() {
        return repository.findByVeiculoDisponivelTrue();
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Anuncio atualizar(@PathVariable Long id, @RequestBody Anuncio dadosNovos) {

        Anuncio anuncio = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anúncio não encontrado"));

        anuncio.setDescricao(dadosNovos.getDescricao());

        if (dadosNovos.getVeiculo() != null) {
            Veiculo veiculo = veiculoRepository
                    .findById(dadosNovos.getVeiculo().getId())
                    .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

            anuncio.setVeiculo(veiculo);
        }

        return repository.save(anuncio);
    }

    @PostMapping
    public Anuncio criar(@RequestBody Anuncio a) {

        a.setDataCriacao(LocalDate.now());

        Usuario usuario = usuarioRepository
                .findById(a.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Veiculo veiculo = veiculoRepository
                .findById(a.getVeiculo().getId())
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        a.setUsuario(usuario);
        a.setVeiculo(veiculo);

        return repository.save(a);
    }
}