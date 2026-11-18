import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchProjects } from "../data/projects";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/Button";
import { FadeUp } from "../components/ui/MotionPrimitives";
import { STUDIO_EASE } from "../lib/motion";
import { usePageMeta } from "../hooks/usePageMeta";

const CATEGORIES = ["All", "Website", "Mobile Apps", "Machine Learning"];

export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  usePageMeta({
    title: t("meta.projects_title"),
    description: t("meta.projects_description"),
    path: "/projects",
    robots: "index,follow",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    let isMounted = true;
    fetchProjects().then((data) => {
      if (isMounted) {
        setProjects(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) =>
      (p.categories || []).includes(selectedCategory),
    );
  }, [projects, selectedCategory]);

  const isEn = i18n.language === "en";

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors duration-300">
      <Navbar />

      <main
        id="main-content"
        className="flex-1 pt-28 sm:pt-36 pb-20 px-5 sm:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-ink-muted hover:text-ink transition-colors"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>{t("projects.back_home")}</span>
            </Link>
          </div>

          <FadeUp className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.03em] leading-[1.06] text-ink mb-3">
                {t("projects.archive_heading")}
              </h1>
              <p className="text-base sm:text-lg text-ink-muted max-w-2xl leading-relaxed">
                {t("projects.archive_subheading")}
              </p>
            </div>

            {!loading && (
              <div className="inline-flex items-baseline gap-2 border-b border-line pb-2 self-start md:self-auto">
                <span className="font-display text-2xl font-semibold text-ink tabular-nums">
                  {filteredProjects.length}
                </span>
                <span className="font-mono text-xs text-ink-muted uppercase">
                  {isEn ? "Projects" : "Proyek"}
                </span>
              </div>
            )}
          </FadeUp>

          <div
            role="group"
            aria-label="Filter projects by category"
            className="flex flex-wrap gap-6 mb-10 border-b border-line"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              const label =
                category === "All" ? t("projects.filter_all") : category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative min-h-[44px] pb-3 text-[15px] font-medium transition-colors ${
                    active ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <span>{label}</span>
                  {active && (
                    <motion.span
                      layoutId="archive-projects-underline"
                      transition={{
                        type: "spring",
                        stiffness: 440,
                        damping: 34,
                      }}
                      className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-ink"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="space-y-4 animate-pulse">
                  <div className="aspect-video rounded-xl bg-mist" />
                  <div className="h-5 w-1/3 bg-mist rounded" />
                  <div className="h-4 w-2/3 bg-mist rounded" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-xl border border-line p-12 text-center space-y-4">
              <h2 className="font-display text-2xl font-semibold text-ink">
                {t("projects.empty_title")}
              </h2>
              <p className="text-base text-ink-muted">
                {t("projects.empty_desc")}
              </p>
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedCategory("All")}
              >
                {t("projects.filter_all")}
              </Button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, idx) => {
                  const translatedDesc = t(`projects.${project.slug}_desc`, {
                    defaultValue: "",
                  });
                  const desc =
                    translatedDesc ||
                    (isEn && project.shortDescriptionEn
                      ? project.shortDescriptionEn
                      : project.shortDescription);
                  const isInDevelopment =
                    project.status && project.status !== "selesai";

                  return (
                    <motion.article
                      key={project.id || project.slug}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.14 } }}
                      transition={{
                        duration: 0.25,
                        delay: Math.min(idx * 0.03, 0.18),
                        ease: STUDIO_EASE,
                      }}
                      className="group flex flex-col justify-between"
                    >
                      <div>
                        <Link
                          to={`/project/${project.slug}`}
                          className="block relative aspect-video rounded-xl bg-mist dark:bg-[#0D1017] border border-line hover:border-accent/40 overflow-hidden transition-all"
                          aria-label={`${project.name} - ${t("projects.cta")}`}
                        >
                          {isInDevelopment ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-mist text-ink-muted p-6">
                              <Wrench
                                size={24}
                                className="text-ink"
                                aria-hidden="true"
                              />
                              <span className="font-mono text-xs uppercase">
                                In Development
                              </span>
                            </div>
                          ) : (
                            <img
                              src={project.src}
                              alt={`${project.name} screenshot`}
                              width={1920}
                              height={1080}
                              loading={idx < 3 ? "eager" : "lazy"}
                              decoding="async"
                              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          )}
                        </Link>

                        <div className="pt-4 space-y-2">
                          <div className="flex items-center justify-between gap-2 font-mono text-xs text-ink-muted">
                            <span>
                              {(project.categories || []).join(" / ")}
                            </span>
                            <span className="tabular-nums">{project.year}</span>
                          </div>

                          <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-ink">
                            <Link
                              to={`/project/${project.slug}`}
                              className="hover:text-accent transition-colors"
                            >
                              {project.name}
                            </Link>
                          </h2>

                          <p className="text-sm sm:text-base text-ink-muted leading-relaxed line-clamp-2">
                            {desc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-line flex items-center justify-between gap-3">
                        <span className="font-mono text-xs text-ink-muted truncate">
                          {project.client}
                        </span>
                        <Link
                          to={`/project/${project.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-accent shrink-0 transition-colors"
                        >
                          <span>{t("projects.cta")}</span>
                          <ArrowRight
                            size={15}
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
