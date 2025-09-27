import BackBtn from '@/components/back-btn';
import AnimationContainer from '@/components/global/animation-container';
import ImageGallery from '@/components/image-gallery';
import { TextAnimate } from '@/components/magicui/text-animate';
import { ProjectDockIcon } from '@/components/project-dock-icon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProjectBySlug } from '@/lib/actions/project.action';
import { SlugProps } from '@/types';
import { IProject } from '@/types/project';
import { format } from 'date-fns';
import { ArrowRight, Calendar, Code2, Globe, Sparkles, Target } from 'lucide-react';

export default async function ProjectDetails({ params }: SlugProps) {
  const { slug } = await params;
  const project: IProject = await getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="my-6">
        <Card className="dark:bg-dark-lite dark:text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Project Not Found</h2>
            <p className="text-lg mb-6">Sorry, we couldn&apos;t find the project you&apos;re looking for. It might have been removed or the URL might be incorrect.</p>
            <AnimationContainer className="flex items-center justify-center">
              <BackBtn variant="default" />
            </AnimationContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="my-6 space-y-16">
      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Image Gallery */}
        <AnimationContainer delay={0.2}>
          <div className="relative group">
            <ImageGallery images={project.screenshots?.length ? project.screenshots : [project.coverImage]} name={project.title} />
          </div>
        </AnimationContainer>

        {/* Title & Description */}
        <div className="space-y-8">
          <BackBtn className="mb-4" />
          <AnimationContainer delay={0.3}>
            <TextAnimate animation="fadeIn" by="character" delay={0} duration={0.5} className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {project.title}
            </TextAnimate>
          </AnimationContainer>
          <AnimationContainer delay={0.4}>
            <TextAnimate className="text-lg leading-relaxed">{project.shortDescription || project.description || 'No description available'}</TextAnimate>
          </AnimationContainer>
          <AnimationContainer delay={0.5}>
            <ProjectDockIcon live={project.liveUrl} github={project.github} details={project.description} />
          </AnimationContainer>
        </div>
      </div>

      {/* Project Overview */}
      <AnimationContainer delay={0.2}>
        <div className="space-y-8">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <ArrowRight className="w-6 h-6 text-primary" />
            Project Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="w-5 h-5" />
                  <h3 className="font-semibold">Timeline</h3>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Category:</span>
                    <span className="text-muted-foreground">{project.category ?? 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Launch Date:</span>
                    <span className="text-muted-foreground">{format(new Date(project.launchDate), 'PPP')}</span>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Globe className="w-5 h-5" />
                  <h3 className="font-semibold">Tags</h3>
                </div>
                <div>
                  {project.tags && project.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-base px-4 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">N/A</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AnimationContainer>

      {/* Key Highlights */}
      {project.keyHighlights && project.keyHighlights.length > 0 && (
        <AnimationContainer delay={0.3}>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-primary" />
              Key Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.keyHighlights.map((highlight, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex justify-center text-primary mt-1 items-center">
                      <Target className="w-4 h-4" />
                    </div>
                    <p className="text-lg">{highlight}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </AnimationContainer>
      )}

      {/* Features */}
      {project.features && project.features.length > 0 && (
        <AnimationContainer delay={0.4}>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-primary" />
              Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.features.map((feature, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <p className="text-lg">{feature}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </AnimationContainer>
      )}

      {/* Impact */}
      {project.impact && (
        <AnimationContainer delay={0.6}>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-primary" />
              Impact
            </h2>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-lg leading-relaxed">{project.impact}</p>
              </div>
            </Card>
          </div>
        </AnimationContainer>
      )}

      {/* Future Plans */}
      {project.futurePlans && project.futurePlans.length > 0 && (
        <AnimationContainer delay={0.7}>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-primary" />
              Future Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.futurePlans.map((plan, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                      <Target className="w-4 h-4" />
                    </div>
                    <p className="text-lg">{plan}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </AnimationContainer>
      )}

      {/* Testimonial */}
      {project.testimonial && (
        <AnimationContainer delay={0.8}>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-primary" />
              Testimonial
            </h2>
            <Card className="p-6 flex items-center gap-6">
              {project.testimonial.avatar && <img src={project.testimonial.avatar} alt={project.testimonial.author ?? 'Testimonial Avatar'} className="w-20 h-20 rounded-full object-cover" />}
              <div>
                <p className="italic text-lg">"{project.testimonial.quote}"</p>
                <p className="font-semibold mt-2">{project.testimonial.author ?? 'Anonymous'}</p>
                <p className="text-sm text-muted-foreground">{project.testimonial.role}</p>
              </div>
            </Card>
          </div>
        </AnimationContainer>
      )}
    </div>
  );
}
