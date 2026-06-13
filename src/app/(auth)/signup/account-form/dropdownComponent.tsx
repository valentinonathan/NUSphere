import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type accountForm = {Nationality: string, Year: string, Faculty: string, Major: string, Residence: string};
type data = {form: accountForm, setForm: React.Dispatch<React.SetStateAction<accountForm>>};

export default function DropdownComponent({name, placeholder, options, setState}: {name: string; placeholder: string; options: string[], setState: React.Dispatch<React.SetStateAction<string>>;}) {



  return (
    <Select onValueChange={value => setState(value)}>
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
