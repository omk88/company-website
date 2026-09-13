"use client";

import React, { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Search,
  X,
  MapPin,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export interface JobItem {
  id: string;
  category: "engineering" | "product" | "operations";
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  experience: string;
  applyUrl?: string;
}

interface UnifiedCareersTableProps {
  onApplyClick?: (job: JobItem) => void;
  onGeneralApplicationClick?: () => void;
  onAlertSignupClick?: (email: string) => void;
}

const allJobs: JobItem[] = [];

export default function UnifiedCareersTable({
  onApplyClick,
  onGeneralApplicationClick,
  onAlertSignupClick,
}: UnifiedCareersTableProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filterJobs = (category?: string) => {
    return allJobs.filter((job) => {
      const matchesCategory = !category || category === "all" || job.category === category;
      const matchesQuery =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  };

  const engineeringMatches = filterJobs("engineering");
  const productMatches = filterJobs("product");
  const operationsMatches = filterJobs("operations");
  const allMatches = filterJobs("all");

  const getFilteredJobs = () => {
    switch (activeTab) {
      case "engineering": return engineeringMatches;
      case "product": return productMatches;
      case "operations": return operationsMatches;
      default: return allMatches;
    }
  };

  const filteredJobs = getFilteredJobs();
  const visibleJobs = showAll ? filteredJobs : filteredJobs.slice(0, 5);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowAll(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowAll(false);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    onAlertSignupClick?.(emailInput);
    setSubscribed(true);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1 overflow-x-auto no-scrollbar min-w-0 pr-4">
          <TabsList className="flex w-max gap-1 p-1">
            <TabsTrigger value="all" className="flex items-center gap-1.5 px-4 whitespace-nowrap">
              <span>All Roles</span>
              <span className="text-xs font-mono text-muted-foreground/60 font-normal">
                {allMatches.length}
              </span>
            </TabsTrigger>

            <TabsTrigger value="engineering" className="flex items-center gap-1.5 px-4 whitespace-nowrap">
              <span>Engineering</span>
              <span className="text-xs font-mono text-muted-foreground/60 font-normal">
                {engineeringMatches.length}
              </span>
            </TabsTrigger>

            <TabsTrigger value="product" className="flex items-center gap-1.5 px-4 whitespace-nowrap">
              <span>Product & Design</span>
              <span className="text-xs font-mono text-muted-foreground/60 font-normal">
                {productMatches.length}
              </span>
            </TabsTrigger>

            <TabsTrigger value="operations" className="flex items-center gap-1.5 px-4 whitespace-nowrap">
              <span>Operations</span>
              <span className="text-xs font-mono text-muted-foreground/60 font-normal">
                {operationsMatches.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground stroke-[1.5]" />
          <Input
            type="text"
            placeholder="Search positions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAll(true);
            }}
            className="pl-10 pr-9 h-10 bg-white dark:bg-card border-border/50 rounded-md shadow-xs focus-visible:ring-1 focus-visible:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150 p-0.5 rounded-sm hover:bg-muted"
            >
              <X className="h-4 w-4 stroke-[2]" />
            </button>
          )}
        </div>
      </div>

      <Card className="w-full pt-0 pb-8 flex flex-col items-center bg-white dark:bg-card border-border/50 rounded-none shadow-md shadow-black/5 dark:shadow-black/40 transition-all duration-300 ease-out overflow-hidden">
        <TabsContent value={activeTab} className="w-full mt-0 border-0 p-0 outline-none">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-sm text-zinc-600 dark:text-zinc-400 bg-muted/20">
                  <th className="py-3.5 px-6 md:px-10">Role & Department</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Location</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Type</th>
                  <th className="py-3.5 px-6 md:px-10 text-right">Action</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-border/60">
                {filteredJobs.length > 0 ? (
                  visibleJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="group hover:bg-muted/30 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 md:px-10">
                        <div className="flex flex-col">
                          <span className="text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                            {job.title}
                          </span>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>{job.department}</span>
                            <span className="sm:hidden">•</span>
                            <span className="sm:hidden flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {job.location}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 hidden sm:table-cell text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-muted-foreground/70 shrink-0" />
                          <span>{job.location}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 hidden md:table-cell text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-muted-foreground/70 shrink-0" />
                          <span>{job.type}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 md:px-10 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onApplyClick?.(job)}
                          className="gap-1.5 text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
                        >
                          <span>Apply</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <div className="flex flex-col p-6">

                        <h3 className="text-base md:text-base tracking-tight mb-2 text-zinc-600 dark:text-zinc-400">
                          No active openings right now
                        </h3>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {!showAll && filteredJobs.length > 5 && (
          <Button
            onClick={() => setShowAll(true)}
            className="mt-6 px-6 py-2 rounded-full bg-[#0B0F19] text-white hover:bg-[#161B26] dark:bg-white dark:text-black dark:hover:bg-white/90 text-sm font-medium transition-colors shadow-xs"
          >
            Load more roles
          </Button>
        )}
      </Card>
    </Tabs>
  );
}