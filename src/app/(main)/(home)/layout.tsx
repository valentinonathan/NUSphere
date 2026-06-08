import "../../globals.css";


export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let response = await fetch(process.env.BACKEND_URL);
  response = await response.json();

  return (
    <div className="flex min-h-full min-w-full w-full">
      {children}
      <div className="z-1 fixed top-21 right-4" style={{minWidth:"calc((100vw - 12.5rem)/2)", width:"calc((100vw - 12.5rem)/2)", maxWidth:"calc((100vw - 12.5rem)/2)", minHeight:"calc(100vh - 6.25rem)", maxHeight:"calc(100vh - 6.25rem)", height: "calc(100vh - 6.25rem)"}}>
        {response?.[0]?.name}
      </div>
    </div>
  );
}

