import type { PlatformGroup } from "@/data/services";
import { PlatformIcon } from "@/components/PlatformIcon";
import { ServiceActionButton } from "@/components/ServiceActionButton";

type PlatformCardProps = {
  platform: PlatformGroup;
};

export function PlatformCard({ platform }: PlatformCardProps) {
  const isXPlatform = platform.iconKey === "x";
  const hasSingleAction = platform.actions.length === 1;

  return (
    <article className="surface-panel flex h-full flex-col rounded-[24px] border border-white/8 p-4 sm:rounded-[26px] sm:p-6">
      <div className="rounded-[18px] border border-white/7 bg-white/[0.02] px-3.5 py-3.5 sm:rounded-[20px] sm:px-4">
        <div className="flex items-center gap-3.5">
          <PlatformIcon iconKey={platform.iconKey} />
          <div className="min-w-0">
            <h3 className="text-base font-semibold tracking-tight text-white sm:text-xl">
              {platform.platform}
            </h3>
            <p className="mt-1 text-[13px] leading-6 text-zinc-400 sm:text-sm">
              {platform.description}
            </p>
          </div>
        </div>
      </div>

      <div className={`mt-4 flex flex-1 sm:mt-5 ${hasSingleAction ? "items-end" : "items-start"}`}>
        {isXPlatform ? (
          <div className="grid w-full grid-cols-2 gap-2">
            {platform.actions.map((action, index) => (
              <ServiceActionButton
                key={action.slug}
                label={action.label}
                slug={action.slug}
                featured={index === platform.actions.length - 1}
                className={index === platform.actions.length - 1 ? "col-span-2" : ""}
              />
            ))}
          </div>
        ) : hasSingleAction ? (
          <div className="w-full">
            <ServiceActionButton
              label={platform.actions[0].label}
              slug={platform.actions[0].slug}
              featured
              fullWidth
              className="min-h-12"
            />
          </div>
        ) : (
          <div className="grid w-full grid-cols-2 gap-2">
            {platform.actions.map((action, index) => (
              <ServiceActionButton
                key={action.slug}
                label={action.label}
                slug={action.slug}
                className={
                  platform.actions.length % 2 === 1 &&
                  index === platform.actions.length - 1
                    ? "col-span-2"
                    : ""
                }
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
