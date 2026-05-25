package com.projeto.veiculos.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MercadoPagoConfiguration {

    // Substitua pelo seu Access Token de TESTE do Mercado Pago
    private static final String ACCESS_TOKEN =
            "APP_USR-4075136334213781-051819-92ca1a0f0399e759503485011dcf6ddc-3410484341";

    @PostConstruct
    public void init() {
        com.mercadopago.MercadoPagoConfig.setAccessToken(ACCESS_TOKEN);
    }
}