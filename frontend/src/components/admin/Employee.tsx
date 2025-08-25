import { Search, UsersRound } from "lucide-react"
import DashboardLayout from "../../layout/DashboardLayout"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

const Employee = () => {
  return (
<DashboardLayout>
    <div className="absolute  px-10 top-[100px] left-[300px] w-[calc(100%-300px)]">

<div >
<div className="flex items-center gap-3">
     <UsersRound color="#0077b6" size={42} className="text- to-blue-500" />   
     <p className="font-semibold text-3xl">  All Employees </p>
</div>

<p >Manage employee roles and view team information</p>
</div>

<div className="relative mt-8">
     
    <Search className="absolute top-3 left-2" />
    <Input className="py-6 px-12 border border-gray-200 rounded-lg"
    placeholder="Search by name or email"
    />
</div>


<div className="mt-5"> 
    <Select>
      <SelectTrigger className="w-[180px]"> 
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
 

</div>

<div>
    <div>
        <p>6</p>
        <p>Total Employees</p>
    </div>
     <div>
        <p>6</p>
        <p>Employees
</p>
    </div>
     <div>
        <p>6</p>
        <p>Admins</p>
    </div>

</div>

<div>
    <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead >Employee</TableHead>
          <TableHead  >Email</TableHead>
      <TableHead>Current Role</TableHead>
      <TableHead>Actions</TableHead>
  
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell >$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table> 
</div>

<p>Showing 6 of 6 employees</p>
    </div>
</DashboardLayout>
  )
}

export default Employee