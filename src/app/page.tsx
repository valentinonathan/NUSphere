import background from "../../public/home_background.png";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-center bg-cover" style={{backgroundImage: `url(${background.src})`,}}>
      
    </div>
  );
}
