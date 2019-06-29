import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

// Column types are for MySQL 8

@Entity()
export class UserSession {
    @PrimaryColumn({ length: 100 })
    openId: string;

    // Hexadecimal (base-16) encoding of SHA-256 hash which requires 256 bits,
    // with each character encoding 4 bits.
    @Column({ length: 64 })
    uclcssaSessionKey: string;

    @CreateDateColumn({ type: 'datetime' })
    uclcssaSessionKeyCreatedAt: Date;

    @Column({ length: 100 })
    weChatSessionKey: string;

    @Column({ length: 100 })
    uclapiToken: string;
}
