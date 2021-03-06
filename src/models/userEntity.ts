import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import _ from "lodash";
import { statuses, Tstatuses, Tthemes, themes, roles, Troles } from "../enums";
import { Generated, PrimaryGeneratedColumn, OneToMany, Entity, PrimaryColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import Feedback from "./feedbackEntity";

@Entity("users")
export default class User extends BaseEntity {
	password?: string;

	toJSON(): User {
		delete this.salt;
		delete this.hash;
		delete this.activationCode;
		delete this.refreshToken;
		return this;
	}

	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ nullable: true })
	@Generated("uuid")
	activationCode?: string;

	@OneToMany(() => Feedback, (feedback) => feedback.user)
	feedbacks?: Feedback[];

	@Column({ unique: true })
	email!: string;

	@Column()
	salt?: string;

	@Column()
	hash?: string;

	@Column({ nullable: true })
	firstname?: string;

	@Column({ nullable: true })
	lastname?: string;

	@Column({ nullable: true })
	profileImageUrl?: string;

	@Column({ nullable: true })
	facebookId?: string;

	@Column({ nullable: true })
	googleId?: string;

	@Column({ nullable: true })
	refreshToken?: string;

	@Column({
		type: "enum",
		enum: statuses.names(),
		default: statuses.values().PENDING,
	})
	status!: Tstatuses;

	@Column({
		default: "en-EN",
	})
	language!: string;

	@Column({
		type: "enum",
		enum: themes.names(),
		default: themes.values().LIGHT,
	})
	theme!: Tthemes;

	@Column({
		type: "enum",
		enum: roles.names(),
		default: roles.getRoleWithMinimumPermissionLevelByUserType(false).name,
	})
	role!: Troles;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	setRefreshToken(refreshToken: string): void {
		this.refreshToken = refreshToken;
	}

	setPassword(password: string): void {
		this.salt = bcrypt.genSaltSync(5);
		this.hash = bcrypt.hashSync(password, this.salt);
	}

	setActivationCode(): void {
		this.activationCode = uuid();
	}

	validatePassword(password: string): boolean {
		return bcrypt.compareSync(password, this.hash as string);
	}

	createPassword(): string {
		const password = uuid().substring(0, 7).replace("-", "");
		this.setPassword(password);
		return password;
	}
}
