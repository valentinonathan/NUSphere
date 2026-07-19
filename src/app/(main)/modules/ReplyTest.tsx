import AvatarWithOnline from "@/components/avatarWithOnline";
import postDummy from "../../../../public/post-dummy.png"
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function ReplyTest() {
    return (
        <div className="flex w-full h-auto gap-2">
            <div className="w-max h-auto flex flex-col">
                <AvatarWithOnline size="2" />
                <div className="relative flex-1 w-full">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 bg-white" style={{width:"1px"}}/>
                </div>
            </div>

            <div className="w-full max-w-full">
                <h3 className="w-full flex items-center" style={{height:"2rem"}}>Valentino Nathan</h3>
                <div className="flex flex-col gap-2">
                    <p className="">This is my life in NUS: I woke up, I code, and then I sleep!</p>
                    <div className="flex gap-3">
                        <div className="flex w-max py-1.5 px-2 bg-black/20 rounded-full gap-3">
                            <div className="flex gap-1">
                                <FaChevronUp className="text-white text-md" />
                                <h3 className="font-semibold text-[75%]">4.1k</h3>
                            </div>
                            <div className="flex gap-1">
                                <FaChevronDown className="text-white text-md" />
                                <h3 className="font-semibold text-[75%]">2k</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full">
                </div>
            </div>
        </div>
    );
}