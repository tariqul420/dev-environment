'use client';
export const dynamic = 'force-dynamic';

import { BarChart3, FileText, FolderGit2, Globe, Mail, MessageSquareMore, MoreVertical, Plus, Rocket, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

const STAT_CARDS = [
  { label: 'Projects', value: 18, delta: '+2 this week', icon: FolderGit2 },
  { label: 'Blog Posts', value: 42, delta: '+3 this month', icon: FileText },
  { label: 'Monthly Views', value: '28.4k', delta: '+12%', icon: BarChart3 },
  { label: 'Leads', value: 73, delta: '-5%', icon: Users },
];

const RECENT_MESSAGES = [
  {
    name: 'Nabila Sultana',
    email: 'nabila@example.com',
    subject: 'Portfolio collaboration inquiry',
    date: 'Aug 20, 2025',
  },
  { name: 'Rahim Uddin', email: 'rahim@startup.io', subject: 'Website revamp', date: 'Aug 19, 2025' },
  { name: 'Akash Khan', email: 'akash@agency.co', subject: 'Contract terms & NDA', date: 'Aug 18, 2025' },
  { name: 'Mehedi Hasan', email: 'mehedi@apps.dev', subject: 'Bug in contact form', date: 'Aug 17, 2025' },
];

const RECENT_PROJECTS = [
  {
    name: 'Meetora — Video Meetings',
    status: 'Published' as const,
    lastDeploy: '2h ago',
    views: 4321,
  },
  { name: 'Natural Sefa — E‑commerce', status: 'Updating' as const, lastDeploy: '1d ago', views: 10987 },
  { name: 'Portfolio v2.1', status: 'Draft' as const, lastDeploy: '—', views: 0 },
];

const QUICK_TASKS = [
  { id: 't1', label: 'Write blog: Scaling Next.js on VPS' },
  { id: 't2', label: 'Create case study for Meetora' },
  { id: 't3', label: 'Refactor contact form validations' },
  { id: 't4', label: 'Optimize images & OG tags' },
];

export default function AdminDashboardPage() {
  const [search, setSearch] = useState('');
  const [enabledDeploys, setEnabledDeploys] = useState(true);
  const filteredMessages = useMemo(() => {
    if (!search) return RECENT_MESSAGES;
    return RECENT_MESSAGES.filter((m) => [m.name, m.email, m.subject].some((v) => v.toLowerCase().includes(search.toLowerCase())));
  }, [search]);

  function handelURL(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    toast.warning('URL not available!');
  }

  return (
    <TooltipProvider>
      <div className="mx-auto w-full max-w-screen-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Overview & quick actions for <span className="font-medium">tariqul.dev</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open traffic & conversions</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="sm">
                  <Link href="/admin/projects/new">
                    <Plus className="mr-2 h-4 w-4" /> New Project
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create a portfolio project</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-xl">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Quick create</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/admin/blog/new">
                    <FileText className="mr-2 h-4 w-4" /> Blog post
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/projects/new">
                    <FolderGit2 className="mr-2 h-4 w-4" /> Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search & Tabs */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-base">Quick Search</CardTitle>
              <div className="flex w-full items-center gap-2 md:w-80">
                <Input placeholder="Search messages, projects, posts..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <CardDescription>Use the tabs to focus on a section</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <StatsGrid />
              </TabsContent>
              <TabsContent value="projects" className="mt-4">
                <ProjectsTable />
              </TabsContent>
              <TabsContent value="blog" className="mt-4">
                <BlogEmptyState />
              </TabsContent>
              <TabsContent value="messages" className="mt-4">
                <MessagesTable messages={filteredMessages} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquareMore className="h-4 w-4" /> Recent Messages
                </CardTitle>
                <CardDescription>Latest from your contact form</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[320px] pr-2">
                  <MessagesTable messages={filteredMessages} compact />
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FolderGit2 className="h-4 w-4" /> Recent Projects
                </CardTitle>
                <CardDescription>Deploy status & visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectsTable />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Rocket className="h-4 w-4" /> Quick Actions
                </CardTitle>
                <CardDescription>Create & manage on the fly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="secondary">
                    <Link href="/admin/projects/new">
                      <FolderGit2 className="mr-2 h-4 w-4" /> Project
                    </Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/admin/blog/new">
                      <FileText className="mr-2 h-4 w-4" /> Blog
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/messages">
                      <Mail className="mr-2 h-4 w-4" /> Inbox
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/analytics">
                      <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                    </Link>
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto-deploy updates</p>
                    <p className="text-xs text-muted-foreground">Trigger build on push</p>
                  </div>
                  <Switch checked={enabledDeploys} onCheckedChange={setEnabledDeploys} />
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Uptime (last 24h)</p>
                  <Progress value={98} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <UsageMeter label="CPU" value={38} />
                  <UsageMeter label="Memory" value={61} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="h-4 w-4" /> Traffic Snapshot
                </CardTitle>
                <CardDescription>Lightweight visual — no libs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <TinySparkline values={[6, 9, 7, 12, 10, 14, 17, 15, 22, 19, 24, 30]} />
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xl font-semibold">28.4k</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold">1.8k</p>
                      <p className="text-xs text-muted-foreground">Visitors</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold">3.4%</p>
                      <p className="text-xs text-muted-foreground">CVR</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Today\&apos;s Tasks</CardTitle>
                <CardDescription>Personal checklist</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {QUICK_TASKS.map((t) => (
                  <label key={t.id} className="flex cursor-pointer items-center gap-3 rounded-xl p-2 hover:bg-muted/40">
                    <Checkbox id={t.id} />
                    <span className="text-sm">{t.label}</span>
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function StatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CARDS.map((s) => (
        <Card key={s.label} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
            <s.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{s.value}</div>
            <p className="text-xs text-muted-foreground">{s.delta}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: 'Draft' | 'Published' | 'Updating' }) {
  if (status === 'Published') return <Badge className="bg-emerald-600 hover:bg-emerald-600">Published</Badge>;
  if (status === 'Updating') return <Badge variant="secondary">Updating</Badge>;
  return <Badge variant="outline">Draft</Badge>;
}

function ProjectsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last deploy</TableHead>
          <TableHead className="text-right">Views</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {RECENT_PROJECTS.map((p) => (
          <TableRow key={p.name} className="hover:bg-muted/40">
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>
              <StatusBadge status={p.status} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{p.lastDeploy}</TableCell>
            <TableCell className="text-right">{p.views.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function MessagesTable({ messages }: { messages: typeof RECENT_MESSAGES; compact?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sender</TableHead>
          <TableHead className="hidden md:table-cell">Subject</TableHead>
          <TableHead className="hidden lg:table-cell">Email</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((m) => (
          <TableRow key={m.email + m.date} className="hover:bg-muted/40">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(m.name)}`} alt={m.name} />
                  <AvatarFallback>
                    {m.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid">
                  <span className="text-sm font-medium leading-tight">{m.name}</span>
                  <span className="text-xs text-muted-foreground leading-tight md:hidden">{m.subject}</span>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{m.subject}</TableCell>
            <TableCell className="hidden lg:table-cell">{m.email}</TableCell>
            <TableCell className="text-right text-sm text-muted-foreground">{m.date}</TableCell>
          </TableRow>
        ))}
        {!messages.length && (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center text-sm text-muted-foreground">
              No messages found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function BlogEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-muted/30 p-10 text-center">
      <FileText className="h-6 w-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">No filtered posts here. Create your next article to power SEO.</p>
      <Button asChild size="sm" className="mt-1">
        <Link href="/admin/blog/new">
          <Plus className="mr-2 h-4 w-4" /> New Blog Post
        </Link>
      </Button>
    </div>
  );
}

function UsageMeter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function TinySparkline({ values }: { values: number[] }) {
  // Normalize values to 0-100 for gradient stops
  const max = Math.max(...values);
  const pts = values.map((v) => Math.round((v / max) * 100));
  const height = 40;
  return (
    <div className="relative h-[40px] w-full overflow-hidden rounded-xl border bg-background">
      {/* Bars */}
      <div className="absolute inset-0 flex items-end gap-[3px] p-2">
        {pts.map((p, i) => (
          <div key={i} className="w-[6px] rounded-sm bg-primary/70" style={{ height: `${(p / 100) * height}px` }} />
        ))}
      </div>
      {/* Baseline */}
      <div className="absolute bottom-2 left-2 right-2 h-px bg-border/80" />
    </div>
  );
}
