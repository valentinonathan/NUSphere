import FindPeople from "./FindPeople";
import PeopleCarousel from "./PeopleCarousel";

export default function PeopleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col gap-4 min-w-full w-full p-4 max-w-full">
          <FindPeople />
          <PeopleCarousel />
        </div>
    );
}