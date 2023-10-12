import { DrupalClient } from "next-drupal"
import { DrupalState } from '@pantheon-systems/drupal-kit';

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    previewSecret: process.env.DRUPAL_PREVIEW_SECRET,
  }
)

export const cacheAwareStore = new DrupalState({
	apiBase: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
});
