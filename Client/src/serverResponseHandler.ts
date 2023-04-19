import {
  IFriends,
  IGetUsersResponse,
  ILoginResponse,
  IRequestData,
  SendMessageDTO,
} from "./interfaces";

export class ServerResponseHandler {
  #guid: string | null = null;
  #data: Array<IRequestData<any>> = [];
  #users: Array<IFriends> = [];

  public deserialize = (data: Buffer) => {
    const res: Array<IRequestData<any>> = [];
    try {
      res.push(JSON.parse(data.toString()));
    } catch {
      const splittedData: Array<string> = data.toString().split("}{");

      splittedData.forEach((element, index) => {
        if (index % 2 === 0) splittedData[index] = element + "}";
        else splittedData[index] = "{" + element;
        res.push(JSON.parse(splittedData[index]));
      });
    }

    this.#data = res;
  };

  public handle = () => {
    this.#data.map((j) => {
      switch (j.methodName) {
        case "login":
          this.#loginHandler(j.body);
          break;
        case "getUsers":
          this.#getUsersHandler(j.body);
          break;
        case "sendMessage":
          this.#sendMessageHandler(j.body);
          break;
        default:
          break;
      }
    });
  };

  #loginHandler = (values: ILoginResponse) => {
    console.log({ loginValues: values });

    this.#guid = values.token;
  };

  public getGuid = () => this.#guid;

  #getUsersHandler = (values: IGetUsersResponse) => {
    console.log({ getUsersValues: values });

    this.#users = values.users;
  };

  public getUsers = () => this.#users;

  #sendMessageHandler = (values: SendMessageDTO) => {
    console.log({ sendMessageValues: values });

    console.log(`${values.senderName}: ${values.message}`);
  };
}
