import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
export function TabGroup({options, }: Readonly<{options: string[]}>) {
  return (
    <Tabs defaultValue={options?.[0]}>
      <TabsList className="bg-white/50 rounded-md">
        {options?.map(o => <TabsTrigger key={o} className="rounded-md" value={o}>{o}</TabsTrigger>)}
      </TabsList>
    </Tabs>
  )
}