import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

/**
 * Project id and dataset come from the environment so this file contains no
 * account-specific values and can be committed as-is. Set them in studio/.env
 * (see studio/README.md).
 */
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

if (!projectId) {
  throw new Error(
    'SANITY_STUDIO_PROJECT_ID is not set. Copy studio/.env.example to studio/.env and fill it in.'
  );
}

export default defineConfig({
  name: 'modesh',
  title: 'Modesh Empowerment Hub',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
