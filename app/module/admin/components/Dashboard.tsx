"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, Eye, Heart, MessageCircle, Users, FolderOpen,
  Tag, TrendingUp, Clock, BarChart2, Image as ImageIcon,
  Video, AlignLeft, ArrowRight, RefreshCw,
} from "lucide-react";
import { DashboardRepository } from "../infrastructure/dashboard.repository";
import { GetDashboardUseCase } from "../application/usecases/get-dashboard.usecase";
import { DashboardStats, PostSummary, RecentComment } from "../domain/entities/dashboard.entity";
import { formatDate } from "../../../lib/global/global";

const dashboardRepo = new DashboardRepository();
const getDashboardUseCase = new GetDashboardUseCase(dashboardRepo);

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return String(n);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon: Icon, color, sub,
}: {
  label: string; value: string | number; icon: React.ElementType;
  color: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 truncate">{label}</p>
        <p className="text-2xl font-black text-gray-900 leading-tight">{fmt(Number(value))}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function ActivityCard({ label, value, icon: Icon, trend }: {
  label: string; value: number; icon: React.ElementType; trend?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
        <Icon className="w-4 h-4 text-orange-500" />
      </div>
      <p className="text-3xl font-black text-gray-900">{value}</p>
      {trend && <p className="text-[11px] text-gray-400 mt-1">{trend}</p>}
    </div>
  );
}

function PostMiniCard({ post, metric }: { post: PostSummary; metric: "views" | "likes" }) {
  return (
    <Link href={`/module/post/view/page/${post.id}`} target="_blank">
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {post.mediaUrl ? (
            <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-300" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
            {post.title}
          </p>
          <p className="text-[11px] text-gray-400 truncate">{post.category?.name ?? "—"}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-sm font-black text-gray-800">
            {fmt(metric === "views" ? post.views : post.likesCount)}
          </p>
          <p className="text-[10px] text-gray-400">{metric === "views" ? "vues" : "likes"}</p>
        </div>
      </div>
    </Link>
  );
}

function CommentCard({ comment }: { comment: RecentComment }) {
  return (
    <div className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-black text-gray-600 uppercase">
          {comment.admin?.name?.charAt(0) ?? "?"}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-800">{comment.admin?.name ?? "Anonyme"}</span>
          <span className="text-[10px] text-gray-400">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{comment.content}</p>
        {comment.post && (
          <p className="text-[10px] text-orange-600 font-semibold truncate mt-0.5">
            → {comment.post.title}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, href }: {
  title: string; icon: React.ElementType; children: React.ReactNode; href?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">{title}</h3>
        </div>
        {href && (
          <Link href={href} className="flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700">
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

// ── Media type bar ─────────────────────────────────────────────────────────────

function MediaBar({ data }: { data: { IMAGE: number; VIDEO: number; TEXT: number } }) {
  const total = data.IMAGE + data.VIDEO + data.TEXT;
  const items = [
    { label: "Image", value: data.IMAGE, icon: ImageIcon, color: "bg-orange-500" },
    { label: "Vidéo", value: data.VIDEO, icon: Video, color: "bg-blue-500" },
    { label: "Texte", value: data.TEXT, icon: AlignLeft, color: "bg-gray-400" },
  ];
  return (
    <div className="space-y-3 px-2 py-1">
      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {items.map((item) => (
          <div
            key={item.label}
            className={`${item.color} transition-all`}
            style={{ width: `${total ? (item.value / total) * 100 : 0}%` }}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
              <span className="text-[11px] font-semibold text-gray-600">
                {item.label} <span className="font-black text-gray-900">({item.value})</span>
              </span>
            </div>
          );
        })}
      </div>
      {/* Rows */}
      <div className="space-y-2 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          const pct = total ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-700">{item.label}</span>
                  <span className="text-xs font-black text-gray-900">{item.value} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Category bar ───────────────────────────────────────────────────────────────

function CategoryBars({ data }: { data: { id: string; name: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-2.5 px-2 py-1">
      {data.map((cat, i) => (
        <div key={cat.id || i} className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-gray-600 w-24 truncate flex-shrink-0">{cat.name}</span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all"
              style={{ width: `${(cat.count / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-black text-gray-900 w-6 text-right flex-shrink-0">{cat.count}</span>
        </div>
      ))}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const data = await getDashboardUseCase.execute();
      setStats(data);
    } catch {
      setError("Impossible de charger les statistiques.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
          <BarChart2 className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-gray-700 font-bold mb-1">Erreur de chargement</p>
        <p className="text-sm text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => load()}
          className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Réessayer
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const { overview, posts, activity, recentComments } = stats;

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Vue d'ensemble de la plateforme</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-gray-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Posts" value={overview.totalPosts} icon={FileText} color="bg-orange-500"
          sub={`${overview.publishedPosts} publiés`} />
        <StatCard label="Brouillons" value={overview.draftPosts} icon={FileText} color="bg-yellow-500"
          sub="non publiés" />
        <StatCard label="Vues" value={overview.totalViews} icon={Eye} color="bg-blue-500" />
        <StatCard label="Likes" value={overview.totalLikes} icon={Heart} color="bg-red-500" />
        <StatCard label="Commentaires" value={overview.totalComments} icon={MessageCircle} color="bg-purple-500" />
        <StatCard label="Catégories" value={overview.totalCategories} icon={FolderOpen} color="bg-green-500"
          sub={`${overview.totalTags} tags`} />
      </div>

      {/* ── Activity this week / month ── */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Activité récente</h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <ActivityCard label="Posts cette semaine" value={activity.postsThisWeek} icon={TrendingUp} trend="7 derniers jours" />
          <ActivityCard label="Posts ce mois" value={activity.postsThisMonth} icon={FileText} trend="30 derniers jours" />
          <ActivityCard label="Commentaires / semaine" value={activity.commentsThisWeek} icon={MessageCircle} trend="7 derniers jours" />
          <ActivityCard label="Likes / semaine" value={activity.likesThisWeek} icon={Heart} trend="7 derniers jours" />
        </div>
      </div>

      {/* ── Middle: media type + categories ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Types de contenu" icon={BarChart2}>
          <MediaBar data={posts.byMediaType} />
        </SectionCard>
        <SectionCard title="Top catégories" icon={FolderOpen}>
          <CategoryBars data={posts.byCategory} />
        </SectionCard>
      </div>

      {/* ── Top posts + recent ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Plus vus" icon={Eye}>
          <div className="divide-y divide-gray-50">
            {posts.topViewed.map((p) => (
              <PostMiniCard key={p.id} post={p} metric="views" />
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Plus likés" icon={Heart}>
          <div className="divide-y divide-gray-50">
            {posts.topLiked.map((p) => (
              <PostMiniCard key={p.id} post={p} metric="likes" />
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Récemment publiés" icon={Clock} href="/module/admin/dashboard">
          <div className="divide-y divide-gray-50">
            {posts.recentlyPublished.map((p) => (
              <PostMiniCard key={p.id} post={p} metric="views" />
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ── Recent comments ── */}
      <SectionCard title="Derniers commentaires" icon={MessageCircle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {recentComments.slice(0, 10).map((c) => (
            <CommentCard key={c.id} comment={c} />
          ))}
        </div>
      </SectionCard>

      {/* ── Footer info ── */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-400 pb-4">
        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {overview.totalAdmins} administrateurs</span>
        <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {overview.totalTags} tags</span>
        <span className="flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5" /> {overview.totalCategories} catégories</span>
      </div>
    </div>
  );
}
