CREATE TABLE veiculo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    ano INT,
    preco DECIMAL(10,2),
    descricao TEXT,
    data_anuncio DATE,
    disponivel BOOLEAN
);
CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    nome VARCHAR(255),
    senha VARCHAR(255)
);
CREATE TABLE anuncio (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data_criacao DATE,
    usuario_id BIGINT,
    veiculo_id BIGINT,
    descricao VARCHAR(255),

    CONSTRAINT fk_anuncio_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id),

    CONSTRAINT fk_anuncio_veiculo
        FOREIGN KEY (veiculo_id) REFERENCES veiculo(id)
);
select * from usuario
select * from anuncio
select * from veiculo