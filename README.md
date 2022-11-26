# [NODEJS] Desafio 07: Testes Unitários

## Sobre o desafio
Nesse desafio, você deverá criar testes unitários para uma aplicação já pronta usando tudo que aprendeu até agora sobre testes.

Para que você possa focar somente na parte de testes unitários sem precisar estudar muito a aplicação do zero, o template foi desenvolvido com base em uma aplicação já conhecida: **FinAPI**. A API construída no primeiro módulo da trilha.ker start ignite-challenge-database-queries

## Template da aplicação
Para realizar esse desafio, criamos para você esse modelo que você deve utilizar como um template do GitHub.
O template está disponível na seguinte URL:
[rocketseat-education/ignite-template-tests-challenge](https://github.com/rocketseat-education/ignite-template-tests-challenge)

## Banco de dados
Se você quiser testar a aplicação usando o Insomnia para ver o funcionamento até mesmo como auxílio para criar os testes unitários, é importante que você confira os dados de autenticação do banco no arquivo `ormconfig.json` e, se necessário, altere.
Além disso você precisa criar uma database com o nome `fin_api` de acordo com o que está no arquivo de configurações do TypeORM.

## Rotas da aplicação
Para te ajudar a entender melhor o funcionamento da aplicação como um todo, abaixo você verá uma descrição de cada rota e quais parâmetros recebe.

### POST `/api/v1/users`
A rota recebe `name`, `email` e `password` dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status `201`.

### POST `/api/v1/sessions`
A rota recebe `email` e `password` no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT.

<aside>
💡 Essa aplicação não possui refresh token, ou seja, o token criado dura apenas 1 dia e deve ser recriado após o período mencionado.
</aside>

### GET `/api/v1/profile`
A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.

### GET `/api/v1/statements/balance`
A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do usuário autenticado e também o saldo total numa propriedade `balance`.

### POST `/api/v1/statements/deposit`
A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de depósito do valor e retorna as informações do depósito criado com status `201`.

### POST `/api/v1/statements/withdraw`
A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de saque do valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status `201`.

### GET `/api/v1/statements/:statement_id`
A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota e retorna as informações da operação encontrada.

## Testes
### Usuários
- [X] Should create a new user;
- [X] Should not create a new user if already exists;
- [X] Should be able to authenticate an user;
- [X] Should not be able to authenticate an nonexistent user;
- [X] Should not be able to authenticate with incorrect password;
- [X] Should return a user profile;
- [X] Should not return a nonexistent user profile;
- [X] Should register a deposit operation;
- [X] Should not register a deposit operation for a nonexistent user;
- [X] Should register a withdraw operation;
- [X] Should not register a withdraw operation if has insufficient funds;
- [X] Should return a user statement;
- [X] Should not return a statement of a inexistent user;
- [X] Should not return a inexistent statement;
- [X] Should return a user balance;
- [X] Should not return a balance of an inexistent user;

