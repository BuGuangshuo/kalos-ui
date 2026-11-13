export function skeletonExample() {
  return `import { KalosLoading, KalosSkeleton } from "@/components/ui/kalos-skeleton";

type Contact = { id: string; name: string; email: string };

export default function ContactList({ contacts }: { contacts?: Contact[] }) {
  if (!contacts) return (
    <KalosLoading label="正在加载联系人" className="flex w-full max-w-sm flex-col gap-4">
      {[160, 128, 144].map((width, index) => (
        <div key={index} className="flex items-center gap-3">
          <KalosSkeleton width={32} height={32} radius="50%" />
          <div className="min-w-0 flex-1">
            <KalosSkeleton line={20} width={width} height={10} />
            <KalosSkeleton line={16} width={112} height={8} />
          </div>
        </div>
      ))}
    </KalosLoading>
  );

  return <ul className="flex w-full max-w-sm flex-col gap-4">
    {contacts.map(contact => <li key={contact.id} className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted" aria-hidden="true">{contact.name.slice(0, 1)}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate leading-5">{contact.name}</p>
        <p className="truncate text-xs leading-4 text-muted-foreground">{contact.email}</p>
      </div>
    </li>)}
  </ul>;
}`;
}

export function spinnerExample() {
  return `import { KalosSpinner } from "@/components/ui/kalos-spinner";

export default function SyncStatus({ syncing = true }: { syncing?: boolean }) {
  return <div className="flex items-center gap-2" role="status">
    {syncing ? <KalosSpinner /> : null}
    <span>{syncing ? "正在同步联系人" : "联系人已同步"}</span>
  </div>;
}

// 单独展示图标时，用 label 说明当前状态。
export function LoadingIcon() {
  return <KalosSpinner size={20} label="正在加载文档" />;
}`;
}
