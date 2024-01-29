import { connectionMongo, type Model } from '../../../common/mongo';
const { Schema, model, models } = connectionMongo;
import { TeamTagsSchema as TeamTagsType } from '@fastgpt/global/support/user/team/type.d';
import {
  TeamCollectionName,
  TeamTagsCollectionName
} from '@fastgpt/global/support/user/team/constant';

const TeamTagsSchema = new Schema({
  label: {
    type: String,
    required: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: TeamCollectionName
  },
  key: {
    type: String
  },
  createTime: {
    type: Date,
    default: () => Date.now()
  }
});

export const MongoTeamTags: Model<TeamTagsType> =
  models[TeamTagsCollectionName] || model(TeamTagsCollectionName, TeamTagsSchema);
