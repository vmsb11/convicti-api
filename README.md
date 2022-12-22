# convicti-api

## Implementação do projeto

O projeto foi implementado em NodeJS com o banco de dados MySQL.
As principais bibliotecas utilizadas foram:
- Sequelize: para realizar o mapeamento das entidades da base de dados
- Express: para realizar a criação da API e das requisições da mesma
- JSON Web Token: para implementar a segurança da API por meio da criação de tokens no processamento da autenticação dos usuários

## Instalação

Clone o repositório e instale as dependências.

```bash
git clone https://github.com/vmsb11/convicti-api.git
cd convicti-api
npm install
```


## Configuração do banco de dados

1) Importe o arquivo convicti-vini.sql no banco de dados MySQL disponível no diretório
2) Abra o arquivo diretorio_do_projeto/server/config/config.json
3) Informe nas propriedades username, host, database e password as informações do banco de dados importado (developement, test e production)
4) Salve o arquivo


## Execução

Para executar o projeto, execute o comando

```bash
nodemon
```

A API ficará sendo executado na porta 8080.

Observação: a aplicação frontend está acessando essa API por meio da URL http://localhost:8080/api, portanto a aplicação frontend e backend devem ser executadas na mesma máquina.


## Detalhes sobre o projeto em geral

## Banco de dados


Base de dados

1) Usuários (Users)

Armazena informações básicas sobre os usuários como nome, email, senha, status e cargo.

2) Diretores (Directors)

Armazena informações sobre os diretores, é feita uma associação com a entidade usuários para que se identifique quais os usuários são diretores.
Há um campo generalManager que identifica se é um diretor geral ou não

3) Diretorias (Boards)

Armazena informações sobre as diretorias com seus respectivos diretores, portanto, é feita uma ligação com a entidade diretores.

4) Gerentes (Managers)

Armazena informações sobre os usuários que são gerentes, portanto, é feita uma ligação com a entidade usuários

5) Unidades (Units)

Armazena informações sobre as unidades com seus respectivos gerentes, portanto, é feita uma ligação com a entidade gerentes

6) Vendedores (Sellers)

Armazena informações sobre os vendedores e quais unidades os mesmos pertentece, é feita uma conexão com a entidade unidades

7) Vendas (Sales)

Armazena informações sobre as vendas realizadas conectando a unidade, o vendedor, a diretoria e o gerente responsável, é feita ligações com as entidades em questão


## Rotas da API e detalhamento do funcionamento das mesmas

Rotas da API

Usuários

1) Cadastro de usuários
Rota: http://127.0.0.1:8080/api/users (POST)
Parâmetros:
 - dados do usuário no formato JSON
Exemplo de cadastro
{
    "name": "Walter Henrique",
    "occupation": "Gerente",
    "mail": "walter.henrique@magazineaziul.com.br",
    "password": "123456",
    "status": "Ativo"
}

2) Autenticação de usuário
Rota: http://192.168.15.21:8080/api/users/login (POST)
Parâmetros:
 - dados do login no formato JSON
Exemplo de login
{
    "password": "123456",
    "mail": "pele@magazineaziul.com.br"
}
Observações importantes sobre o login:
 - O login retorna os dados do usuário e o token JWT gerado, este token deverá ser utilizado em todas as outras chamadas da API que necessitam que o usuário esteja logado
 - Se o usuário for um vendedor, o login retornará também o id do vendedor, id da unidade para ser utilizado no filtro das informações das vendas
 - Se o usuário for um diretor geral ou diretor comum, o login retornará também o id da diretoria associada para ser utilizado no filtro das informações das vendas
 - Se o usuário for um gerente, o login retornará também o id do gerente, id da unidade para ser utilizado no filtro das informações das vendas

3) Recuperação de senha de usuário
Rota: http://192.168.15.21:8080/api/users/recovery (POST)
Parâmetros:
 - email do usuário no formato JSON
Exemplo de recuperação de senha
{
    "mail": "pele@magazineaziul.com.br"
}
A senha será enviada para o email do usuário, como não tenho um servidor de email configurado, esta rota não está funcionando corretamente, já está implementada mas não funcionando

4) Consulta de usuários
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/users/?page={page}&size={size}&parameter={parameter} (GET)
Parâmetros:
- page: página atual
- size: tamanho de registros por páginas
- parameter: parâmetro de filtro, se não for informado, o filtro é ignorado
Exemplo de chamada:
Rota: http://localhost:8080/api/users/?page=1&size=10&parameter=pele

A consulta é paginada.

5) Consulta de usuários por id
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/users/{id} (GET)
Parâmetros:
- id : id do usuário
Exemplo de chamada:
Rota: http://localhost:8080/api/users/15

6) Alteração de cadastro de usuários
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/users/{id} (PUT)
Parâmetros:
 - id: id do usuário
 - dados do usuário no formato JSON
Exemplo de alteração de cadastro
Rota: http://localhost:8080/api/users/15
{
    "name": "Walter Henrique 123",
    "occupation": "Gerente",
    "mail": "walter.henrique@magazineaziul.com.br",
    "password": "123456",
    "status": "Ativo"
}

7) Remoção de cadastro de usuários
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/users/{id} (DELETE)
Parâmetros:
 - id: id do usuário
Exemplo de remoção de cadastro
Rota: http://localhost:8080/api/users/15

------------------------------------------------------------

Diretores

1) Cadastro de diretores
Rota: http://127.0.0.1:8080/api/directors (POST)
Parâmetros:
 - dados do diretor no formato JSON, o usuário deve estar previamente cadastrado
Exemplo de cadastro
{
    "userId": 2,
    "generalManager": "Sim"
}

2) Consulta de diretores
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/directors/?page={page}&size={size}&parameter={parameter} (GET)
Parâmetros:
- page: página atual
- size: tamanho de registros por páginas
- parameter: parâmetro de filtro, se não for informado, o filtro é ignorado
Exemplo de chamada:
Rota: http://localhost:8080/api/directors/?page=1&size=10&parameter=pele

A consulta é paginada.

3) Consulta de diretores por id
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/directors/{id} (GET)
Parâmetros:
- id : id do diretor
Exemplo de chamada:
Rota: http://localhost:8080/api/directors/1

4) Alteração de cadastro de diretores
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/directors/{id} (PUT)
Parâmetros:
 - id: id do diretor
 - dados do diretor no formato JSON
Exemplo de alteração de cadastro
Rota: http://localhost:8080/api/directors/1
{
    "userId": 2,
    "generalManager": "Sim"
}

5) Remoção de cadastro de diretores
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/directors/{id} (DELETE)
Parâmetros:
 - id: id do diretor
Exemplo de remoção de cadastro
Rota: http://localhost:8080/api/directors/1

------------------------------------------------------------

Diretorias

1) Cadastro de diretorias
Rota: http://127.0.0.1:8080/api/boards (POST)
Parâmetros:
 - dados do diretoria no formato JSON, o diretor deve estar previamente cadastrado
Exemplo de cadastro
{
    "directorId": 2,
    "name": "Sul"
}

2) Consulta de diretorias
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/boards/?page={page}&size={size}&parameter={parameter} (GET)
Parâmetros:
- page: página atual
- size: tamanho de registros por páginas
- parameter: parâmetro de filtro, se não for informado, o filtro é ignorado
Exemplo de chamada:
Rota: http://localhost:8080/api/boards/?page=1&size=10&parameter=Sul

A consulta é paginada.

3) Consulta de diretorias por id
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/boards/{id} (GET)
Parâmetros:
- id : id do diretoria
Exemplo de chamada:
Rota: http://localhost:8080/api/boards/2

4) Alteração de cadastro de diretorias
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/boards/{id} (PUT)
Parâmetros:
 - id: id do diretoria
 - dados do diretoria no formato JSON
Exemplo de alteração de cadastro
Rota: http://localhost:8080/api/boards/2
{
    "directorId": 2,
    "name": "Sul"
}

5) Remoção de cadastro de diretorias
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/boards/{id} (DELETE)
Parâmetros:
 - id: id do diretoria
Exemplo de remoção de cadastro
Rota: http://localhost:8080/api/boards/2

------------------------------------------------------------

Gerentes

1) Cadastro de gerentes
Rota: http://127.0.0.1:8080/api/managers (POST)
Parâmetros:
 - dados do gerente no formato JSON, o usuário deve estar previamente cadastrado
Exemplo de cadastro
{
    "userId": 6
}

2) Consulta de gerentes
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/managers/?page={page}&size={size}&parameter={parameter} (GET)
Parâmetros:
- page: página atual
- size: tamanho de registros por páginas
- parameter: parâmetro de filtro, se não for informado, o filtro é ignorado
Exemplo de chamada:
Rota: http://localhost:8080/api/managers/?page=1&size=10&parameter=Sul

A consulta é paginada.

3) Consulta de gerentes por id
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/managers/{id} (GET)
Parâmetros:
- id : id do gerente
Exemplo de chamada:
Rota: http://localhost:8080/api/managers/1

4) Alteração de cadastro de gerentes
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/managers/{id} (PUT)
Parâmetros:
 - id: id do gerente
 - dados do gerente no formato JSON
Exemplo de alteração de cadastro
Rota: http://localhost:8080/api/managers/1
{
    "userId": 15
}

5) Remoção de cadastro de gerentes
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/managers/{id} (DELETE)
Parâmetros:
 - id: id do gerente
Exemplo de remoção de cadastro
Rota: http://localhost:8080/api/managers/1

------------------------------------------------------------

Unidades

1) Cadastro de unidades
Rota: http://127.0.0.1:8080/api/units (POST)
Parâmetros:
 - dados do unidade no formato JSON, o gerente e a unidade devem estar previamente cadastradas
Exemplo de cadastro
{
    "managerId": 1,
    "boardId": 2,
    "name": "Porto Alegre",
    "latLon": "-30.048750057541955, -51.228587422990806"
}

2) Consulta de unidades
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/units/?page={page}&size={size}&parameter={parameter}&boardId={boardId} (GET)
Parâmetros:
- page: página atual
- size: tamanho de registros por páginas
- parameter: parâmetro de filtro, se não for informado, o filtro é ignorado
- boardId: id da diretoria, se não for informado, o filtro é ignorado
Exemplo de chamada:
Rota: http://localhost:8080/api/units/?page=1&size=10&parameter=Sul

A consulta é paginada.

3) Consulta de unidades por id
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/units/{id} (GET)
Parâmetros:
- id : id do unidade
Exemplo de chamada:
Rota: http://localhost:8080/api/units/2

4) Alteração de cadastro de unidades
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/units/{id} (PUT)
Parâmetros:
 - id: id do unidade
 - dados do unidade no formato JSON
Exemplo de alteração de cadastro
Rota: http://localhost:8080/api/units/2
{
    "managerId": 1,
    "boardId": 2,
    "name": "Porto Alegre - RS",
    "latLon": "-30.048750057541955, -51.228587422990806"
}

5) Remoção de cadastro de unidades
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/units/{id} (DELETE)
Parâmetros:
 - id: id do unidade
Exemplo de remoção de cadastro
Rota: http://localhost:8080/api/units/2

------------------------------------------------------------

Vendedores

1) Cadastro de vendedores
Rota: http://127.0.0.1:8080/api/sellers (POST)
Parâmetros:
 - dados do vendedor no formato JSON, o gerente e a vendedor devem estar previamente cadastradas
Exemplo de cadastro
{
    "boardId": 7,
    "userId": 16
}

2) Consulta de vendedores
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/sellers/?page={page}&size={size}&parameter={parameter} (GET)
Parâmetros:
- page: página atual
- size: tamanho de registros por páginas
- parameter: parâmetro de filtro, se não for informado, o filtro é ignorado
- unityId: id da unidade, se não for informado, o filtro é ignorado
Exemplo de chamada:
Rota: http://localhost:8080/api/sellers/?page=1&size=10&parameter=Belo

A consulta é paginada.

3) Consulta de vendedores por id
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/sellers/{id} (GET)
Parâmetros:
- id : id do vendedor
Exemplo de chamada:
Rota: http://localhost:8080/api/sellers/2

4) Alteração de cadastro de vendedores
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/sellers/{id} (PUT)
Parâmetros:
 - id: id do vendedor
 - dados do vendedor no formato JSON
Exemplo de alteração de cadastro
Rota: http://localhost:8080/api/sellers/2
{
    "boardId": 7,
    "userId": 16
}

5) Remoção de cadastro de vendedores
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/sellers/{id} (DELETE)
Parâmetros:
 - id: id do vendedor
Exemplo de remoção de cadastro
Rota: http://localhost:8080/api/sellers/2

------------------------------------------------------------

Vendas

1) Cadastro de vendas
Rota: http://127.0.0.1:8080/api/sales (POST)
Parâmetros:
 - dados do venda no formato JSON, o gerente e a venda devem estar previamente cadastradas
Exemplo de cadastro
{
    "sellerId": 13,
    "boardId": 4,
    "unityId": 	9,
    "date": "2022-01-06 10:00:00",
    "amount": 100,
    "location": "-23.544259437612844, -46.64370714029131",
    "status": "Confirmado"
}

2) Consulta de vendas
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/sales/?page={page}&size={size}&parameter={parameter} (GET)
Parâmetros:
- page: página atual
- size: tamanho de registros por páginas
- parameter: parâmetro de filtro, se não for informado, o filtro é ignorado
- boardId: id da diretoria, se não for informado, o filtro é ignorado
- sellerId: id do vendedor, se não for informado, o filtro é ignorado
- unityId: id da unidade, se não for informado, o filtro é ignorado
- managerId: id do gerente, se não for informado, o filtro é ignorado
- startDate: data inicial, se não for informado, o filtro é ignorado
- finalDate: data final, se não for informado, o filtro é ignorado
PS: para filtrar por períodos, obrigatoriamente a data inicial e final devem ser informadas
Exemplo de chamada:
Rota: http://localhost:8080/api/sales/?page=1&size=10&parameter=Sul

A consulta é paginada.

3) Consulta de vendas por id
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://localhost:8080/api/sales/{id} (GET)
Parâmetros:
- id : id do venda
Exemplo de chamada:
Rota: http://localhost:8080/api/sales/4

4) Alteração de cadastro de vendas
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/sales/{id} (PUT)
Parâmetros:
 - id: id do venda
 - dados do venda no formato JSON
Exemplo de alteração de cadastro
Rota: http://localhost:8080/api/sales/4
{
    "sellerId": 13,
    "boardId": 4,
    "unityId": 	9,
    "date": "2022-01-06 10:00:00",
    "amount": 300,
    "location": "-23.544259437612844, -46.64370714029131",
    "status": "Confirmado"
}

5) Remoção de cadastro de vendas
Autorização: Bearer Token, informar o token gerado na autenticação
Rota: http://127.0.0.1:8080/api/sales/{id} (DELETE)
Parâmetros:
 - id: id do venda
Exemplo de remoção de cadastro
Rota: http://localhost:8080/api/sales/4

------------------------------------------------------------
