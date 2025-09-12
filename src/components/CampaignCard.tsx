import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
  donors: number;
  daysLeft: number;
  category: string;
  location: string;
}

const CampaignCard = ({
  id,
  title,
  description,
  image,
  raised,
  goal,
  donors,
  daysLeft,
  category,
  location,
}: CampaignCardProps) => {
  return (
    <Card className="card-modern group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
            {category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
        
        <ProgressBar current={raised} goal={goal} className="mb-4" />
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{donors} donors</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{daysLeft} days left</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button asChild className="flex-1 btn-hero">
          <Link to={`/donate/${id}`}>
            Donate Now
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/campaign/${id}`}>
            Learn More
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;