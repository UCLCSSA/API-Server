import { IsString } from 'class-validator';

export class RegisterWithWeChatRequestDto {
    @IsString()
    readonly appId: string;

    @IsString()
    readonly appSecret: string;

    @IsString()
    readonly code: string;
}
