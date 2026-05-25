package com.projeto.veiculos.controller;

import com.projeto.veiculos.model.Usuario;
import com.projeto.veiculos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Listar todos os usuários
    @GetMapping
    public List<Usuario> listar() {
        return repository.findAll();
    }

    // Criar usuário com senha criptografada
    @PostMapping
    public Usuario criar(@RequestBody Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setAdmin(false);
        return repository.save(usuario);
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
        if (!passwordEncoder.matches(senhaAtual, usuario.getSenha())) {
            return ResponseEntity.badRequest()
                    .body("Senha atual incorreta.");
        }

        // Salva a nova senha criptografada
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        repository.save(usuario);

        return ResponseEntity.ok("Senha alterada com sucesso.");
    }
    // ==========================
// TORNAR USUÁRIO ADMIN
// ==========================
    @PutMapping("/{id}/tornar-admin")
    public ResponseEntity<String> tornarAdmin(@PathVariable Long id) {

        Optional<Usuario> optionalUsuario = repository.findById(id);

        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = optionalUsuario.get();
        usuario.setAdmin(true);

        repository.save(usuario);

        return ResponseEntity.ok("Usuário promovido para administrador com sucesso.");
    }

    // ==========================
// EXCLUIR USUÁRIO
// ==========================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluirUsuario(@PathVariable Long id) {

        Optional<Usuario> optionalUsuario = repository.findById(id);

        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.ok("Usuário excluído com sucesso.");
    }
    // ==========================
// ATUALIZAR PERFIL
// ==========================
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarPerfil(
            @PathVariable Long id,
            @RequestBody Usuario dados) {

        Optional<Usuario> optionalUsuario = repository.findById(id);

        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = optionalUsuario.get();

        // Atualiza apenas os dados do perfil
        usuario.setNome(dados.getNome());
        usuario.setEmail(dados.getEmail());
        usuario.setTelefone(dados.getTelefone());
        usuario.setCpf(dados.getCpf());

        // Não altera senha nem admin
        repository.save(usuario);

        return ResponseEntity.ok(usuario);
    }

}