package com.projeto.veiculos.controller;

import com.projeto.veiculos.model.Usuario;
import com.projeto.veiculos.model.Veiculo;
import com.projeto.veiculos.repository.VeiculoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import com.projeto.veiculos.model.Usuario;
import com.projeto.veiculos.repository.UsuarioRepository;

@RestController
@RequestMapping("/veiculos")
@CrossOrigin(origins = "*")
public class VeiculoController {

    @Autowired
    private VeiculoRepository repository;
    @Autowired
    private UsuarioRepository usuarioRepository;

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

    @PutMapping("/reservar/{idVeiculo}/{idUsuario}")
    public Veiculo reservarVeiculo(
            @PathVariable Long idVeiculo,
            @PathVariable Long idUsuario) {

        Veiculo veiculo = repository.findById(idVeiculo).orElseThrow();
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow();

        veiculo.setDisponivel(false);
        veiculo.setReservadoPor(usuario);

        return repository.save(veiculo);
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