import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUsersRepository);
  });

  it("Should return a user balance", async () => {
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
    await createStatementUseCase.execute(operation_01);
    const operation_02 = {
      user_id,
      type: 'deposit' as OperationType,
      amount: 10,
      description: 'venda de produto 02'
    }
    await createStatementUseCase.execute(operation_02);
    const operation_03 = {
      user_id,
      type: 'withdraw' as OperationType,
      amount: 10,
      description: 'pagamento de serviço'
    }
    await createStatementUseCase.execute(operation_03);

    const result = await getBalanceUseCase.execute({user_id})
    expect(result).toHaveProperty("balance");
  });

  it("Should not return a balance of an inexistent user", async () => {
    expect( async () => {
      await getBalanceUseCase.execute({user_id: ""})
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

})
