import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export default function Dropdown({
    label, placeholder, options
}: {
    label: string,
    placeholder: string,
    options: string[]
}) {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-48 bg-white/35">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white/35 backdrop-blur">
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options?.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}