import { controlStyles } from "@/components/ui/kalos-styles";
import type { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/kalos-aria-card";
export function KalosCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card className={controlStyles.card}>
      <CardHeader className={controlStyles.cardHeader}>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className={controlStyles.cardContent}>{children}</CardContent>
      {footer ? <CardFooter className={controlStyles.cardFooter}>{footer}</CardFooter> : null}
    </Card>
  );
}
