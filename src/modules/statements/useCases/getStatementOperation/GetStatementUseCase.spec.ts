import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
});

  it("Should return a user statement", async () => {
    const user = {
      name: "Usuário Teste",
      email: "usuario@email.com.br",
      password: "12345678"
    }
    await createUserUseCase.execute(user);
    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const user_id  = authenticatedUser.user?.id!;

    const operation_01 = {
      user_id,
      type: 'deposit' as OperationType,
      amount: 10,
      description: 'venda de produto 01'
    }
    const statementOperation = await createStatementUseCase.execute(operation_01);

    const statement_id = statementOperation?.id!;
    const result = await getStatementOperationUseCase.execute({user_id, statement_id });
    expect(result).toHaveProperty("id");
  });

  it("Should not return a statement of a inexistent user", async () => {
    expect( async () => {
      await getStatementOperationUseCase.execute({user_id: "", statement_id: "" });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not return a inexistent statement", async () => {
    expect( async () => {
      const user = {
        name: "Usuário Teste",
        email: "usuario@email.com.br",
        password: "12345678"
      }
      await createUserUseCase.execute(user);
      const authenticatedUser = await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });

      const user_id  = authenticatedUser.user?.id!;
      await getStatementOperationUseCase.execute({user_id, statement_id: "" });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})
