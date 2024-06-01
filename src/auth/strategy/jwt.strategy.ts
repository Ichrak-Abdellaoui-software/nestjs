import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    console.log('JWT Validate Payload:', payload);
    if (!payload || !payload.email) {
      throw new UnauthorizedException('Invalid token');
    }
    //return { email: payload.email, sub: payload.sub };
    return { _id: payload._id, email: payload.email, role: payload.role };
  }
}
