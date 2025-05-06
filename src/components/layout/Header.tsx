
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleSpecificLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case "patient":
        return (
          <>
            <li>
              <Link to="/appointments" className="text-gray-700 hover:text-clinic-600">
                My Appointments
              </Link>
            </li>
            <li>
              <Link to="/book-appointment" className="text-gray-700 hover:text-clinic-600">
                Book Appointment
              </Link>
            </li>
            <li>
              <Link to="/billing" className="text-gray-700 hover:text-clinic-600">
                My Bills
              </Link>
            </li>
          </>
        );
      case "doctor":
        return (
          <>
            <li>
              <Link to="/appointments" className="text-gray-700 hover:text-clinic-600">
                My Schedule
              </Link>
            </li>
            <li>
              <Link to="/patients" className="text-gray-700 hover:text-clinic-600">
                Patients
              </Link>
            </li>
          </>
        );
      case "staff":
        return (
          <>
            <li>
              <Link to="/appointments" className="text-gray-700 hover:text-clinic-600">
                Appointments
              </Link>
            </li>
            <li>
              <Link to="/patients" className="text-gray-700 hover:text-clinic-600">
                Patients
              </Link>
            </li>
            <li>
              <Link to="/billing" className="text-gray-700 hover:text-clinic-600">
                Billing
              </Link>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container px-4 py-4 mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-clinic-600">ClinicCare</span>
          </Link>
          
          {user && (
            <nav className="ml-8 hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <Link to="/dashboard" className="text-gray-700 hover:text-clinic-600">
                    Dashboard
                  </Link>
                </li>
                {getRoleSpecificLinks()}
              </ul>
            </nav>
          )}
        </div>

        <div className="flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border border-clinic-200">
                    <AvatarFallback className="bg-clinic-100 text-clinic-800">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600" 
                  onClick={logout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button className="bg-clinic-500 hover:bg-clinic-600">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
