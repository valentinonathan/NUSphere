import FindPeople from "./FindPeople";
import PeopleCarousel from "./PeopleCarousel";

export default function PeopleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col gap-8 min-w-full w-full p-4 max-w-full items-center">
          <FindPeople />
          <PeopleCarousel heading="People you might know" />
          <PeopleCarousel heading="People from School of Computing" />
          <PeopleCarousel heading="Fellow Indonesians" />
        </div>
    );
}