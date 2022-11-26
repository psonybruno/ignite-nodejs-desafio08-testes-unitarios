import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
  });

  it("Should register a deposit operation", async () => {
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

    const operation = {
      user_id: authenticatedUser.user.id!,
      type: 'deposit' as OperationType,
      amount: 10,
      description: 'venda de produtos'
    }
    const result = await createStatementUseCase.execute(operation);

    expect(result).toHaveProperty("id");
  });

  it("Should not register a deposit operation for a nonexistent user", async () => {
    expect( async () => {
      const operation = {
        user_id: "",
        type: 'deposit' as OperationType,
        amount: 10,
        description: 'venda de produtos'
      }
      await createStatementUseCase.execute(operation);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should register a withdraw operation", async () => {
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

    const operation_01 = {
      user_id: authenticatedUser.user.id!,
      type: 'deposit' as OperationType,
      amount: 10,
      description: 'venda de produto 01'
    }
    await createStatementUseCase.execute(operation_01);
    const operation_02 = {
      user_id: authenticatedUser.user.id!,
      type: 'deposit' as OperationType,
      amount: 10,
      description: 'venda de produto 02'
    }
    await createStatementUseCase.execute(operation_02);
    const operation = {
      user_id: authenticatedUser.user.id!,
      type: 'withdraw' as OperationType,
      amount: 10,
      description: 'pagamento de serviço'
    }
    const result = await createStatementUseCase.execute(operation);
    expect(result).toHaveProperty("id");
  });

  it("Should not register a withdraw operation if has insufficient funds", async () => {
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
      const operation = {
        user_id: authenticatedUser.user.id!,
        type: 'withdraw' as OperationType,
        amount: 10,
        description: 'venda de produtos'
      }
      await createStatementUseCase.execute(operation);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

});
