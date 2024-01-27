"use client";

import { logo } from "@/assets/images";
import { LayoutDashboardIcon, Menu, MoveDown, Star, Text } from "lucide-react";
import Image from "next/image";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const SideBar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [lookup, setLookup] = useState(false);
  const [customers, setCustomers] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="dark:bg-black bg-white">
        <div className="flex flex-col  w-[300px] ">
          <Link href="/">
            <div className="w-full  my-10 ">
              <Image
                alt="logo"
                src={logo}
                width={250}
                height={250}
                className="w-full"
              />
            </div>
          </Link>

          <Link
            href="/dashboard"
            className={`${
              pathname === "/dashboard" ? "bg-gray-900" : ""
            } hover:bg-gray-800`}
          >
            <div className="flex gap-x-3 items-center h-12 w-full justify-start ml-10 ">
              <LayoutDashboardIcon />
              <h1 className="text-xl ">Dashboard</h1>
            </div>
          </Link>

          <div className="hover:bg-gray-800">
            <div
              onClick={() => setLookup((prev) => !prev)}
              className="flex gap-x-3 items-center h-12  justify-start ml-10 z-2 "
            >
              <Text />
              <h1 className="text-xl ">Lookups</h1>
              <MoveDown />
            </div>

            {lookup && (
              <ul className="w-full flex flex-col items-start bg-white  dark:bg-black  py-3 z-10">
                <li
                  className={`
                ${
                  pathname === "/lookups/customer-type" ? "bg-gray-900" : ""
                } w-full text-lg hover:bg-gray-800
              `}
                >
                  <Link href="/lookups/customer-type" className="ml-14">
                    Customer Types
                  </Link>
                </li>
                <li
                  className={`
                ${
                  pathname === "/lookups/business-type" ? "bg-gray-900" : ""
                } w-full text-lg hover:bg-gray-800
              `}
                >
                  <Link href="/lookups/business-type" className="ml-14">
                    Business Types
                  </Link>
                </li>
                <li
                  className={`
                ${
                  pathname === "/lookups/education-level" ? "bg-gray-900" : ""
                } w-full text-lg hover:bg-gray-800
              `}
                >
                  <Link href="/lookups/education-level" className="ml-14">
                    Education Level
                  </Link>
                </li>
                <li
                  className={`
                ${
                  pathname === "/lookups/bsa-basis" ? "bg-gray-900" : ""
                } w-full text-lg hover:bg-gray-800
              `}
                >
                  <Link href="/lookups/bsa-basis" className="ml-14">
                    BSA-Basis
                  </Link>
                </li>
                <li
                  className={`
                ${
                  pathname === "/lookups/bsa-controls" ? "bg-gray-900" : ""
                } w-full text-lg hover:bg-gray-800
              `}
                >
                  <Link href="/lookups/bsa-controls" className="ml-14">
                    BSA-Controls
                  </Link>
                </li>
                <li
                  className={`
                ${
                  pathname === "/lookups/ofac-basis" ? "bg-gray-900" : ""
                } w-full text-lg hover:bg-gray-800
              `}
                >
                  <Link href="/lookups/ofac-basis" className="ml-14">
                    OFAC-Basis
                  </Link>
                </li>
                <li
                  className={`
                ${
                  pathname === "/lookups/ofac-basis" ? "bg-gray-900" : ""
                } w-full text-lg hover:bg-gray-800
              `}
                >
                  <Link href="/lookups/ofac-controls" className="ml-14">
                    OFAC-Controls
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="hover:bg-gray-800">
            <div
              onClick={() => setCustomers((prev) => !prev)}
              className="flex gap-x-3 items-center h-12  justify-start ml-10 z-2"
            >
              <Star />
              <h1 className="text-xl ">Customers</h1>
              <MoveDown />
            </div>
            {customers && (
              <ul className="w-full flex flex-col items-start  bg-white  dark:bg-black py-3 z-10">
                <li
                  className={`
                  ${
                    pathname === "/customers/manage-customers"
                      ? "bg-gray-900"
                      : ""
                  } w-full text-md  hover:bg-gray-800

                `}
                >
                  <Link href="/customers/manage-customers" className="ml-14">
                    Manage Customers
                  </Link>
                </li>
                <li
                  className={`
                  ${
                    pathname === "/customers/customer-details"
                      ? "bg-gray-900"
                      : ""
                  } w-full text-md hover:bg-gray-800
                `}
                >
                  <Link href="/customers/customer-details" className="ml-14">
                    Customer Details
                  </Link>
                </li>
                <li
                  className={`
                  ${
                    pathname === "/customers/customer-details-list"
                      ? "bg-gray-900"
                      : ""
                  } w-full text-md hover:bg-gray-800
                `}
                >
                  <Link
                    href="/customers/customer-details-list"
                    className="ml-14"
                  >
                    Customer Details List
                  </Link>
                </li>
                <li
                  className={`
                  ${
                    pathname === "/customers/customer-risk-factor"
                      ? "bg-gray-900"
                      : ""
                  } w-full text-md hover:bg-gray-800
                `}
                >
                  <Link
                    href="/customers/customer-risk-factor"
                    className="ml-14"
                  >
                    Customer Risk Factor
                  </Link>
                </li>
                <li
                  className={`
                  ${
                    pathname === "/customers/customer-risk-factor-list"
                      ? "bg-gray-900"
                      : ""
                  } w-full text-md hover:bg-gray-800
                `}
                >
                  <Link
                    href="/customers/customer-risk-factor-list"
                    className="ml-14"
                  >
                    Customer Risk Factors List
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="hover:bg-gray-800">
            <div
              onClick={() => setRiskAssessment((prev) => !prev)}
              className="flex gap-x-3 items-center h-12  justify-start ml-10 z-2"
            >
              <Star />
              <h1 className="text-xl ">Risk Assessment</h1>
              <MoveDown />
            </div>

            {riskAssessment && (
              <ul className="w-full flex flex-col items-start  bg-white  dark:bg-black py-3 z-10">
                <li
                  className={`
                  ${
                    pathname === "/risk-assessment/bsa-ra" ? "bg-gray-900" : ""
                  } w-full text-lg hover:bg-gray-800
                `}
                >
                  <Link href="/risk-assessment/bsa-ra" className="ml-14">
                    BSA-RA
                  </Link>
                </li>
                <li
                  className={`
                  ${
                    pathname === "/risk-assessment/ofac-ra" ? "bg-gray-900" : ""
                  } w-full text-lg hover:bg-gray-800 
                `}
                >
                  <Link href="/risk-assessment/ofac-ra" className="ml-14">
                    OFAC-RA
                  </Link>
                </li>
                <li
                  className={`
                  ${
                    pathname === "/risk-assessment/bsa-risk-matrix"
                      ? "bg-gray-900"
                      : ""
                  } w-full text-lg hover:bg-gray-800 
                `}
                >
                  <Link
                    href="/risk-assessment/bsa-risk-matrix"
                    className="ml-14"
                  >
                    BSA Risk Matrix
                  </Link>
                </li>
                <li
                  className={`
                  ${
                    pathname === "/risk-assessment/ofac-risk-matrix"
                      ? "bg-gray-900"
                      : ""
                  } w-full text-lg hover:bg-gray-800
                `}
                >
                  <Link
                    href="/risk-assessment/ofac-risk-matrix"
                    className="ml-14"
                  >
                    OFAC Risk Matrix
                  </Link>
                </li>
                <li
                  className={`
                  ${
                    pathname === "/risk-assessment/print-reports"
                      ? "bg-gray-900"
                      : ""
                  } w-full text-lg hover:bg-gray-800
                `}
                >
                  <Link href="/risk-assessment/print-reports" className="ml-14">
                    Print Reports
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideBar;
