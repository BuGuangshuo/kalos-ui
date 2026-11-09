import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/pop-aria-avatar";
export function PopAvatarStack({
  people,
  max = 4,
}: {
  people: { name: string; image?: string }[];
  max?: number;
}) {
  const limit = Math.max(1, Math.floor(max));
  return (
    <div
      className="flex"
      aria-label={people.map((person) => person.name).join(", ")}
    >
      {people.slice(0, limit).map((person, index) => (
        <Avatar
          key={`${person.name}-${index}`}
          size="default"
          className="ring-2 ring-background -ml-1.5 first:ml-0"
        >
          {person.image ? (
            <AvatarImage src={person.image} alt={person.name} />
          ) : null}
          <AvatarFallback>
            {person.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </AvatarFallback>
        </Avatar>
      ))}
      {people.length > limit ? (
        <Avatar
          size="default"
          className="ring-2 ring-background -ml-1.5 first:ml-0"
        >
          <AvatarFallback>+{people.length - limit}</AvatarFallback>
        </Avatar>
      ) : null}
    </div>
  );
}
