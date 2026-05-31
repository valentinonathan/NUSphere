import "../../globals.css";


export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full min-w-full w-full">
      {children}
    </div>
  );
}

