import { createElement, type ComponentProps, type ReactNode } from "react";
import { controlStyles } from "@/components/ui/kalos-styles";
import {
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export type KalosCardProps = Omit<ComponentProps<"div">, "title" | "children"> & {
  as?: "div" | "section" | "article" | "li";
  title: ReactNode;
  titleAs?: "h2" | "h3" | "h4" | "p";
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  interactive?: boolean;
  selected?: boolean;
};

export function KalosCard({
  as = "div",
  title,
  titleAs: Title = "h3",
  description,
  icon,
  action,
  children,
  footer,
  interactive = false,
  selected = false,
  className,
  ...props
}: KalosCardProps) {
  return createElement(
    as,
    {
      ...props,
      "data-slot": "card",
      "data-interactive": interactive || undefined,
      "data-selected": selected || undefined,
      className: [controlStyles.card, className].filter(Boolean).join(" "),
    },
    <>
      <CardHeader className={controlStyles.cardHeader}>
        {icon != null ? <span data-slot="card-icon" className={controlStyles.cardIcon}>{icon}</span> : null}
        <div className={controlStyles.cardTitles}>
          <Title data-slot="card-title" className={controlStyles.cardTitle}>{title}</Title>
          {description ? <CardDescription className={controlStyles.cardDescription}>{description}</CardDescription> : null}
        </div>
        {action != null ? <div data-slot="card-action" className={controlStyles.cardAction}>{action}</div> : null}
      </CardHeader>
      {children != null ? <CardContent className={controlStyles.cardContent}>{children}</CardContent> : null}
      {footer != null ? <CardFooter className={controlStyles.cardFooter}>{footer}</CardFooter> : null}
    </>,
  );
}
