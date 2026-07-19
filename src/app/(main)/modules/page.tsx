import { fetchBackendServer } from "@/utils/fetch-backend-server";
import ModuleBox from "./ModuleBox";

export default async function ModulesPage() {
    type module = {
        id: number,
        title: string,
        banner_url: string
    }
    const modules = await fetchBackendServer<module[]>("/modules/my", "GET");
    return (
        <div className="p-4">
            <h1 className="font-momo text-4xl text-center">Modules Thread</h1>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-semibold">Your Modules:</h2>
                    <div className="flex gap-4 flex-wrap">
                        {modules.map(m => <ModuleBox key={m.id} moduleCode={m.title} />)}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-semibold">Explore Other Modules:</h2>
                    <div className="flex gap-4 flex-wrap">

                    </div>
                </div>
            </div>
        </div>
    );
}