import type { ResolvingMetadata, ResolvingViewport } from 'next/dist/lib/metadata/types/metadata-interface.js';
import type { AppRoutes, LayoutRoutes, ParamMap } from './routes.js';

type AppPageConfig<Route extends AppRoutes = AppRoutes> = {
  default:
    | React.ComponentType<{ params: Promise<ParamMap[Route]> } & any>
    | ((props: { params: Promise<ParamMap[Route]> } & any) => React.ReactNode | Promise<React.ReactNode> | never | void | Promise<void>);
  generateStaticParams?: (props: { params: ParamMap[Route] }) => Promise<any[]> | any[];
  generateMetadata?: (props: { params: Promise<ParamMap[Route]> } & any, parent: ResolvingMetadata) => Promise<any> | any;
  generateViewport?: (props: { params: Promise<ParamMap[Route]> } & any, parent: ResolvingViewport) => Promise<any> | any;
  metadata?: any;
  viewport?: any;
};

type LayoutConfig<Route extends LayoutRoutes = LayoutRoutes> = {
  default: React.ComponentType<LayoutProps<Route>> | ((props: LayoutProps<Route>) => React.ReactNode | Promise<React.ReactNode> | never | void | Promise<void>);
  generateStaticParams?: (props: { params: ParamMap[Route] }) => Promise<any[]> | any[];
  generateMetadata?: (props: { params: Promise<ParamMap[Route]> } & any, parent: ResolvingMetadata) => Promise<any> | any;
  generateViewport?: (props: { params: Promise<ParamMap[Route]> } & any, parent: ResolvingViewport) => Promise<any> | any;
  metadata?: any;
  viewport?: any;
};

// Validate ../../app/(marketing)/about/page.tsx
{
  const handler = {} as typeof import('../../app/(marketing)/about/page.js');
  handler satisfies AppPageConfig<'/about'>;
}

// Validate ../../app/(marketing)/privacy/page.tsx
{
  const handler = {} as typeof import('../../app/(marketing)/privacy/page.js');
  handler satisfies AppPageConfig<'/privacy'>;
}

// Validate ../../app/(marketing)/terms/page.tsx
{
  const handler = {} as typeof import('../../app/(marketing)/terms/page.js');
  handler satisfies AppPageConfig<'/terms'>;
}

// Validate ../../app/page.tsx
{
  const handler = {} as typeof import('../../app/page.js');
  handler satisfies AppPageConfig<'/'>;
}

// Validate ../../app/tools/(tools)/calc/bmi/page.tsx
{
  const handler = {} as typeof import('../../app/tools/(tools)/calc/bmi/page.jsx/page.js');
  handler satisfies AppPageConfig<'/tools/calc/bmi'>;
}

// Validate ../../app/tools/(tools)/calc/date-diff/page.tsx
{
  const handler = {} as typeof import('../../app/tools/(tools)/calc/date-diff/page.jsx/page.js');
  handler satisfies AppPageConfig<'/tools/calc/date-diff'>;
}

// Validate ../../app/tools/(tools)/calc/unit-converter/page.tsx
{
  const handler = {} as typeof import('../../app/tools/(tools)/calc/unit-converter/page.jsx/page.js');
  handler satisfies AppPageConfig<'/tools/calc/unit-converter'>;
}

// Validate ../../app/tools/page.tsx
{
  const handler = {} as typeof import('../../app/tools/page.js');
  handler satisfies AppPageConfig<'/tools'>;
}

// Validate ../../app/layout.tsx
{
  const handler = {} as typeof import('../../app/layout.js');
  handler satisfies LayoutConfig<'/'>;
}

// Validate ../../app/tools/layout.tsx
{
  const handler = {} as typeof import('../../app/tools/layout.js');
  handler satisfies LayoutConfig<'/tools'>;
}
