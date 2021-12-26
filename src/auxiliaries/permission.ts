import { Response } from "express";
import { roles, Troles } from "../enums";
import { singleRoleInterface } from "../interfacesAndTypes/enum";
import User from "../models/userEntity";

export function canAdminActOnUser(modifierUser: User, targetUser: User): Boolean {
	if (!modifierUser?.role || !targetUser?.role) return false;
	return isAllowed(false, modifierUser.role, targetUser.role);
}
export default function isAllowed(isSameLevelRolePermitted: boolean, userRole: Troles, role?: Troles | singleRoleInterface) {
	// ? Get permission Level of the user
	let roleChosen: singleRoleInterface | undefined;
	if (!role) roleChosen = roles.getRoleWithMinimumPermissionLevelByUserType(false);
	else if (typeof role === "string") roleChosen = roles.getRoleByName(role);
	else roleChosen = role;
	const userRoleFromEnum = roles.getRoleByName(userRole);
	if (userRoleFromEnum !== undefined && roleChosen !== undefined) {
		let comparisonValue: boolean = isSameLevelRolePermitted === true ? userRoleFromEnum.permissionLevel >= roleChosen.permissionLevel : userRoleFromEnum.permissionLevel >= roleChosen.permissionLevel; // TODO userRoleFromEnum.permissionLevel >= roleChosen.permissionLevel; togliere maggiore uguale, solo maggiore
		return comparisonValue;
	}
	return false;
}

export function createAccessToken(res: Response, accessToken: string) {
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		path: "/",
		maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION as string) * 1000 * 60 * 60 * 24,
	});
}
export function createAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
	createAccessToken(res, accessToken);
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		path: "/",
		maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION as string) * 1000 * 60 * 60 * 24 * 10,
	});
}
