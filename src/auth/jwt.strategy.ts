import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET,
            ignoreExpiration: false,
        });
    }

    async validate(payload: any) {
        const filter = {
            account: {
                pk: payload.sub
            }
        };

        const user = await this.userService.find(filter);
        return {
            pk: payload.sub,
            user: payload.name,
            ...user
        }
    }
}