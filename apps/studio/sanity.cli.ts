import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '5l61z3ol',
    dataset: 'production'
  },
  deployment: {
    // Pin the hosted studio to this deploy (auto-updates can lag behind schema changes).
    appId: 'l3xd2fnwb5dfwng1lcqrjh6z',
    autoUpdates: false,
  },
})
