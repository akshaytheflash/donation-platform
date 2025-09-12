import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Calendar, Upload, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  goalAmount: z.number().min(100, 'Goal amount must be at least $100'),
  category: z.string().min(1, 'Please select a category'),
  endDate: z.date({
    required_error: 'Please select an end date',
  }),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  longDescription: z.string().min(50, 'Long description must be at least 50 characters'),
  imageUrl: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

const categories = [
  'Education',
  'Healthcare', 
  'Emergency',
  'Environment',
  'Water',
  'Food',
  'Other'
];

const StartCampaign = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const watchedEndDate = watch('endDate');
  const watchedImageUrl = watch('imageUrl');

  const handleImageUrlChange = (url: string) => {
    setValue('imageUrl', url);
    setImagePreview(url);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert({
          title: data.title,
          goal_amount: data.goalAmount,
          category: data.category,
          description: data.description,
          long_description: data.longDescription,
          image_url: data.imageUrl || `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop`,
          end_date: data.endDate.toISOString(),
          status: 'active',
          raised_amount: 0,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Campaign Created!',
        description: 'Your campaign has been successfully created and is now live.',
      });

      navigate(`/campaign/${campaign.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to create campaign. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Start Your <span className="gradient-text">Campaign</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Create a transparent, blockchain-backed campaign to raise funds for your cause.
          </p>
        </div>

        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Clean Water for Rural Communities"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Goal Amount */}
              <div className="space-y-2">
                <Label htmlFor="goalAmount">Goal Amount (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="goalAmount"
                    type="number"
                    placeholder="50000"
                    className="pl-10"
                    {...register('goalAmount', { valueAsNumber: true })}
                  />
                </div>
                {errors.goalAmount && (
                  <p className="text-sm text-destructive">{errors.goalAmount.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label>Campaign End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watchedEndDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {watchedEndDate ? format(watchedEndDate, "PPP") : "Pick an end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={watchedEndDate}
                      onSelect={(date) => date && setValue('endDate', date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate.message}</p>
                )}
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Campaign Image URL</Label>
                <div className="space-y-3">
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={watchedImageUrl || ''}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                  />
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <img
                        src={imagePreview}
                        alt="Campaign preview"
                        className="w-full h-full object-cover"
                        onError={() => setImagePreview('')}
                      />
                    </div>
                  )}
                </div>
                {errors.imageUrl && (
                  <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief overview of your campaign and its goals..."
                  rows={3}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Long Description */}
              <div className="space-y-2">
                <Label htmlFor="longDescription">Detailed Description *</Label>
                <Textarea
                  id="longDescription"
                  placeholder="Provide detailed information about your campaign, how funds will be used, expected impact, timeline, etc..."
                  rows={6}
                  {...register('longDescription')}
                />
                {errors.longDescription && (
                  <p className="text-sm text-destructive">{errors.longDescription.message}</p>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/campaigns')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-hero"
                >
                  {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StartCampaign;