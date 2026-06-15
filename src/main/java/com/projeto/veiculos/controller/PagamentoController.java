package com.projeto.veiculos.controller;

import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;

import com.projeto.veiculos.model.Veiculo;
import com.projeto.veiculos.repository.VeiculoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Map;

import com.mercadopago.exceptions.MPApiException;

@RestController
@RequestMapping("/pagamentos")
@CrossOrigin(origins = "*")
public class PagamentoController {


    @Autowired
    private VeiculoRepository veiculoRepository;

    @PostMapping("/entrada/{veiculoId}")
    public Map<String, String> gerarPagamentoEntrada(
            @PathVariable Long veiculoId) throws Exception {

        // Busca veículo
        Veiculo veiculo = veiculoRepository.findById(veiculoId)
                .orElseThrow(() ->
                        new RuntimeException("Veículo não encontrado"));

        // Calcula 10%
        BigDecimal preco =
                BigDecimal.valueOf(veiculo.getPreco());

        BigDecimal entrada =
                preco.multiply(BigDecimal.valueOf(0.10));

        // Produto do checkout
        PreferenceItemRequest item =
                PreferenceItemRequest.builder()
                        .title(
                                "Reserva - "
                                        + veiculo.getMarca()
                                        + " "
                                        + veiculo.getModelo()
                        )
                        .quantity(1)
                        .currencyId("BRL")
                        .unitPrice(entrada)
                        .build();

        // URLs de retorno
        PreferenceBackUrlsRequest backUrls =
                PreferenceBackUrlsRequest.builder()
                        .success(
                                "https://idealness-nail-rearview.ngrok-free.dev/frontend/sucesso.html?veiculoId="
                                        + veiculoId
                        )
                        .failure(
                                "https://idealness-nail-rearview.ngrok-free.dev/frontend/falha.html"
                        )
                        .pending(
                                "https://idealness-nail-rearview.ngrok-free.dev/frontend/pendente.html"
                        )
                        .build();

        // Preferência
        PreferenceRequest preferenceRequest =
                PreferenceRequest.builder()
                        .items(Collections.singletonList(item))
                        .backUrls(backUrls)
                        .autoReturn("approved")
                        .build();

        // Cria checkout
        PreferenceClient client =
                new PreferenceClient();

        try {

            Preference preference =
                    client.create(preferenceRequest);

            return Map.of(
                    "url",
                    preference.getInitPoint()
            );

        } catch (MPApiException e) {

            System.out.println("ERRO API:");
            System.out.println(e.getApiResponse().getContent());

            throw e;
        }
    }
}






