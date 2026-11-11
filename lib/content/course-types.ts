export type CourseId =
  | 'professional-baking'
  | 'pastry-arts'
  | 'artisan-bread-making'
  | 'bakery-entrepreneurship'
  | 'wedding-master-class';

export interface CourseOption {
  readonly slug: CourseId;
  /** Existing full label submitted to Netlify; independent of future display edits. */
  readonly label: string;
}

export interface Course {
  readonly id: CourseId;
  readonly title: string;
  readonly enrollmentValue: string;
  readonly description: string;
  readonly level: string;
  readonly duration: string;
  readonly learningTopics: readonly string[];
  readonly image: { readonly src: `/images/${string}`; readonly alt: string };
  readonly verification: {
    readonly status: 'repository-only';
    readonly sourceFile: string;
    readonly sourceRevision: string;
    readonly awaitingClient: readonly string[];
  };
  readonly fees: { readonly amount: number; readonly currency: 'KES' } | null;
  readonly credential: string | null;
  readonly intake: string | null;
}

/** Unreconciled homepage presentations; deliberately not catalogue references. */
export interface LegacyHomeFeature {
  readonly title: string;
  readonly desc: string;
  readonly img: `/images/${string}`;
  readonly tag: string;
}
