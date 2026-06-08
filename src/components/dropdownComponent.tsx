import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DropdownComponent({name, placeholder, options}: {name: string; placeholder: string; options: string[];}) {
  return (
    <Select>
      <SelectTrigger className="w-full bg-white/35 rounded-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white/35 backdrop-blur">
        <SelectGroup>
          <SelectLabel>{name}</SelectLabel>
          {options?.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
