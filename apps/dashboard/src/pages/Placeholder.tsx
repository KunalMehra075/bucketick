import { Construction } from 'lucide-react';
import { Button } from '@bucketick/ui';

/** Friendly stand-in for pages not built yet. */
export function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-content">{title}</h1>

      <div className="mt-10 grid place-items-center rounded-card border border-dashed border-line bg-surface/50 px-6 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-soft-yellow text-[#9a6b00]">
          <Construction className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-content">
          This corner is still under construction
        </h2>
        <p className="mt-2 max-w-sm text-sm text-content-muted">
          {title} is on the way. We are building the dashboard one delightful screen at a time, and
          this one is next in line. Promise it will be worth the wait.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => history.back()}>
          Take me back
        </Button>
      </div>
    </div>
  );
}
