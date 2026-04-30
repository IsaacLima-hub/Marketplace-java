package com.projeto.veiculos.controller;

import com.projeto.veiculos.model.Veiculo;
import com.projeto.veiculos.repository.VeiculoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/veiculos")
@CrossOrigin(origins = "*")
public class VeiculoController {

    @Autowired
    private VeiculoRepository repository;

    // LISTAR
    @GetMapping
    public List<Veiculo> listar() {
        return repository.findAll();
    }

    // CRIAR ANÚNCIO
    @PostMapping
    public Veiculo criar(@RequestBody Veiculo v) {
        v.setDataAnuncio(LocalDate.now());
        v.setDisponivel(true);
        return repository.save(v);
    }

    // DELETAR
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PutMapping("/reservar/{id}")
    public Veiculo reservar(@PathVariable Long id) {
        Veiculo v = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        v.setDisponivel(false);

        return repository.save(v);
    }
    @PutMapping("/{id}")
    public Veiculo atualizar(@PathVariable Long id, @RequestBody Veiculo dadosNovos) {

        Veiculo veiculo = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        veiculo.setMarca(dadosNovos.getMarca());
        veiculo.setModelo(dadosNovos.getModelo());
        veiculo.setAno(dadosNovos.getAno());
        veiculo.setPreco(dadosNovos.getPreco());
        veiculo.setImagem(dadosNovos.getImagem());
        veiculo.setDescricao(dadosNovos.getDescricao());
        veiculo.setDisponivel(dadosNovos.isDisponivel());

        return repository.save(veiculo);
    }
}