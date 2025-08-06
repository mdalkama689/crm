import { Bell, CalendarDays, ClipboardPlus, FileText, Folders, Grid2x2Plus, Info, LayoutDashboard, MessagesSquare, UsersRound } from "lucide-react"

const allValue = [
    {
        name: "Dashboard",
        icon: <LayoutDashboard />
    },
    {
        name: "Projects",
        icon: ""
    },
    {
        name: "Tasks",
        icon: ""
    }, {
        name: "Workspaces",
        icon: <Grid2x2Plus />
    },
    {
        name: "Calender",
        icon: <CalendarDays />
    },
    {name: "Contacts",
        icon: <UsersRound />
    },
    {name: "Messages",
        icon:     <MessagesSquare />
    },
    {name: "Packages",
        icon: ""
    },
    {
        name: "Invoices",
        icon: <FileText />
    },
    {name: "File Browser",
        icon: <Folders />
    },
    {name: "Notifications",
        icon: <Bell />
    },
    {name: "Reports",
        icon:     <ClipboardPlus />

    },
    {name: "Help Center",
        icon: <Info />
    }
]
const Navbar = () => {
  return (
    <div>Navbar</div>
  )
}

export default Navbar