import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { RegisterDto } from './dtos/register.dto';


@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any): Promise<any> {
    // Implement your login logic here, e.g., generating a JWT token.
    const token = this.jwtService.sign({ id: user.id });
    return { ...user, token };
  }

  async validateUser(username: string, password: string): Promise<any> {
    // Implement your user validation logic here
    // For example, check the username and password against a database
    console.log(username, password);
    if (username === 'test' && password === 'password') {
      return { id: 1, username: 'test' }; // Example user object
    }
    return null;
  }

  async register(userDto: RegisterDto): Promise<any> {
    // Implement your user registration logic here
    // For example, save the user to a database
    console.log(userDto);
    return { message: 'User registered successfully' };
  }
}
