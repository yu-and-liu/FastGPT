import { POST } from '@fastgpt/service/common/api/plusRequest';
import type {
    AuthOutLinkChatProps,
    AuthOutLinkLimitProps,
    AuthOutLinkInitProps,
    AuthOutLinkResponse
} from '@fastgpt/global/support/outLink/api.d';
import { getUserAndAuthBalance } from '@fastgpt/service/support/user/controller';
import { MongoTeam } from '@fastgpt/service/support/user/team/teamSchema';
import { MongoTeamMember } from "@fastgpt/service/support/user/team/teamMemberSchema"
export function authOutLinkInit(data: AuthOutLinkInitProps): Promise<AuthOutLinkResponse> {
    if (!global.feConfigs?.isPlus) return Promise.resolve({ uid: data.outLinkUid });
    return POST<AuthOutLinkResponse>('/support/outLink/authInit', data);
}
export function authOutLinkChatLimit(data: AuthOutLinkLimitProps): Promise<AuthOutLinkResponse> {
    if (!global.feConfigs?.isPlus) return Promise.resolve({ uid: data.outLinkUid });
    return POST<AuthOutLinkResponse>('/support/outLink/authChatStart', data);
}

export async function authTeamShareChatStart({
    teamId,
    ip,
    outLinkUid,
    question
}: AuthOutLinkChatProps & {
    teamId: string;
}) {
    // get outLink and app
    const res: any = await MongoTeam.findById(teamId);


    // check balance and chat limit
    const user = await MongoTeamMember.findOne({ teamId, userId: String(res.ownerId) });

    const userInfo = await getUserAndAuthBalance({ tmbId: user._id, minBalance: 0 });

    return {
        user: userInfo,
        uid: outLinkUid,
    };
}
