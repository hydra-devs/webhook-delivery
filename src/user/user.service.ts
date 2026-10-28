import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  show() {
    return "hellooo";
  }

  name() {
    return "returned";
  }
}
