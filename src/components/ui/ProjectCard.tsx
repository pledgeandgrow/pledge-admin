import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ProjectCardProps {
  title: string;
  description: string;
  status: string;
  deadline: string;
}

export function ProjectCard({ title, description, status, deadline }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow hover:scale-105 duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-bold hover:text-blue-500 transition-colors duration-200">{title}</CardTitle>
        <CardDescription className="text-gray-600 hover:text-gray-900 transition-colors duration-200">{description}</CardDescription>
      </CardHeader>
      <CardContent className="hover:bg-gray-100 transition-background duration-200">
        <p className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Status: {status}</p>
        <p className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Deadline: {deadline}</p>
      </CardContent>
    </Card>
  );
}
