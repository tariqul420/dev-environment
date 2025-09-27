import { services } from '@/data/services';
import BadgeTitle from '../badge-title';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const Service = () => {
  return (
    <section id="services" className="py-12">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <BadgeTitle title="My Services" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-8">What I Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4">
                <service.icon className="w-8 h-8" />
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;
