package com.projeto.veiculos.controller;

import com.projeto.veiculos.model.Usuario;
import com.projeto.veiculos.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @GetMapping
    public List<Usuario> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Usuario criar(@RequestBody Usuario u) {
        return repository.save(u);
    }

    // Buscar usuário pelo e-mail
    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> buscarPorEmail(@PathVariable String email) {
        Optional<Usuario> usuario = repository.findByEmail(email);

        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        }

        return ResponseEntity.notFound().build();
    }

    // Alterar senha
    @PutMapping("/{id}/senha")
    public ResponseEntity<?> alterarSenha(
            @PathVariable Long id,
            @RequestBody Map<String, String> dados) {

        Optional<Usuario> optionalUsuario = repository.findById(id);

        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = optionalUsuario.get();

        String senhaAtual = dados.get("senhaAtual");
        String novaSenha = dados.get("novaSenha");

        // Verifica se a senha atual está correta
        if (!usuario.getSenha().equals(senhaAtual)) {
            return ResponseEntity.badRequest()
                    .body("Senha atual incorreta.");
        }

        // Atualiza a senha
        usuario.setSenha(novaSenha);
        repository.save(usuario);

        return ResponseEntity.ok("Senha alterada com sucesso.");
    }
}