import { AppTypeMap } from '@fastgpt/global/core/app/constants';
import { connectionMongo, type Model } from '../../common/mongo';
const { Schema, model, models } = connectionMongo;
import type { AppSchema as AppType } from '@fastgpt/global/core/app/type.d';
import { PermissionTypeEnum, PermissionTypeMap } from '@fastgpt/global/support/permission/constant';
import {
  TeamCollectionName,
  TeamMemberCollectionName
} from '@fastgpt/global/support/user/team/constant';
import { variableMap } from '@fastgpt/global/core/module/constants';

export const appCollectionName = 'apps';

const AppSchema = new Schema({
  teamId: {
    type: Schema.Types.ObjectId,
    ref: TeamCollectionName,
    required: true
  },
  tmbId: {
    type: Schema.Types.ObjectId,
    ref: TeamMemberCollectionName,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: '/icon/logo.svg'
  },
  intro: {
    type: String,
    default: ''
  },
  updateTime: {
    type: Date,
    default: () => new Date()
  },
  permission: {
    type: String,
    enum: Object.keys(PermissionTypeMap),
    default: PermissionTypeEnum.private
  },

  tools: {
    type: [
      {
        id: {
          // relate tools collections or system tools
          type: String,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        desc: {
          type: String
        },
        avatar: {
          type: String
        },
        config: {
          // save tool static config
          type: Object,
          default: {}
        }
      }
    ],
    default: []
  },
  welcomeText: {
    type: String
  },
  variables: {
    type: [
      {
        key: {
          type: String,
          required: true
        },
        label: {
          type: String,
          required: true
        },
        type: {
          type: String,
          enum: Object.keys(variableMap),
          required: true
        },
        required: {
          type: Boolean,
          required: true
        },
        maxLen: {
          // input
          type: Number
        },
        enums: {
          type: [
            {
              value: {
                type: String,
                required: true
              }
            }
          ],
          default: []
        }
      }
    ]
  },
  questionGuide: {
    type: Boolean
  },
  tts: {
    type: Object
  },

  inited: {
    type: Boolean
  },

  // abandon
  type: {
    type: String,
    enum: Object.keys(AppTypeMap)
  },
  simpleTemplateId: {
    type: String,
    required: true
  },
  modules: {
    type: Array
  }
});

try {
  AppSchema.index({ updateTime: -1 });
  AppSchema.index({ teamId: 1 });
} catch (error) {
  console.log(error);
}

export const MongoApp: Model<AppType> =
  models[appCollectionName] || model(appCollectionName, AppSchema);

MongoApp.syncIndexes();
