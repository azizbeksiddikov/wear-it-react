import { MemberStatus, MemberType } from '../enums/member.enum';

export interface Member {
	_id: string;
	memberType: MemberType;
	memberStatus: MemberStatus;
	memberEmail: string;
	memberPhone: string;
	memberPassword?: string;
	memberFullName?: string;
	memberAddress?: string;
	memberDesc?: string;
	memberImage?: string;
	memberPoints: number;
	createdAt: Date;
	updatedAt: Date;
}

/*
	memberPassword?: string;
	memberFullName?: string;
	memberPoints?: number;
*/
export interface MemberInput {
	memberPhone: string;
	memberPassword: string;
	memberEmail: string;
	memberType?: MemberType;
	memberStatus?: MemberStatus;
	memberFullName?: string;
	memberAddress?: string;
	memberDesc?: string;
	memberImage?: string;
	memberPoints?: number;
}

export interface MemberUpdateInput {
	memberEmail?: string;
	memberPhone?: string;
	memberPassword?: string;
	memberFullName?: string;
	memberAddress?: string;
	memberDesc?: string;
	memberImage?: string;
	memberPoints?: number;
	memeberStatus?: MemberStatus;
}

export interface LoginInput {
	memberEmail: string;
	memberPassword: string;
}
