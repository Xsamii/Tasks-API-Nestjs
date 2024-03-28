import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
// import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/sigin.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtpayload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    const { username, password } = signupDto;
    // hashing password
    const generatedSalt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(password, generatedSalt);

    const user = this.userRepo.create({ username, password: hashedpassword });
    try {
      await this.userRepo.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signin(cred: SigninDto): Promise<{ accesstoken: string }> {
    const { username, password } = cred;
    const user = await this.userRepo.findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = {
        username,
      };
      const accesstoken = this.jwtService.sign(payload);
      return {
        accesstoken,
      };
    } else {
      throw new UnauthorizedException('please check your credenials');
    }
  }
}
