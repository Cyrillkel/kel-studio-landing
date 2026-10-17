// A project from portfolio.items in locales/*.json. Plain types with no imports,
// so client components can use them.
//
// A project with `url` links to the live site. A project with `case` has no public
// address (an internal product, a site that is not online any more, or work under
// NDA): its card opens a dialog with the story and the stack instead (CaseDialog).

export type CaseStackGroup = {
  // "Frontend", "Backend", "Integrations".
  name: string;
  items: string[];
};

export type PortfolioCase = {
  // What we did on the project: "Frontend and backend".
  role: string;
  // What the product is, in a sentence or two.
  about: string;
  // What we built, one point per line.
  work: string[];
  stack: CaseStackGroup[];
  // Pictures shown in the dialog, the first one usually the card image.
  gallery: string[];
  // A remark under the description, e.g. that the screens are an illustration.
  note?: string;
};

export type PortfolioItem = {
  title: string;
  description: string;
  image: string;
  url?: string;
  case?: PortfolioCase;
};
