import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  /** Deployed studio hostname, i.e. https://modesh.sanity.studio */
  studioHost: 'modesh',
  autoUpdates: true,
});
