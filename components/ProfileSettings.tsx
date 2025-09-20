'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AvailabilitySchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  format_note: z.string().optional(),
});

const ProfileSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(2),
  timezone: z.string().min(2),
  github_id: z.string().optional(),
  status: z.enum(['TEACHING', 'PAUSED', 'LEARNING', 'MODERATING']).default('LEARNING'),
  experience: z.string().optional(),
  expertise: z.string().optional(),
  availability: z.array(AvailabilitySchema).optional(),
});

type ProfileInput = z.infer<typeof ProfileSchema>;

export default function ProfileSettings({ userId }: { userId: string }) {
  const supabase = createClientComponentClient();
  const [initialData, setInitialData] = useState<ProfileInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: initialData || { availability: [] },
  });

  const { control, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'availability' });

  // Get logged-in user id
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });
  }, [supabase]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('userid', userId)
        .single();

      if (!error && data) {
        setInitialData(data);
        reset(data);
      }
    };
    fetchProfile();
  }, [userId, supabase, reset]);

  if (currentUserId !== userId) return null;

  const onSubmit = async (values: ProfileInput) => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('users').upsert({
        userid: userId,
        ...values,
      });
      if (error) throw error;
      setMessage('✅ Profile saved!');
      reset(values);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto mt-6 max-w-3xl">
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="username123" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="America/New_York" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* GitHub */}
            <FormField
              control={control}
              name="github_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub ID (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="github_username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEACHING">TEACHING</SelectItem>
                        <SelectItem value="PAUSED">PAUSED</SelectItem>
                        <SelectItem value="LEARNING">LEARNING</SelectItem>
                        <SelectItem value="MODERATING">MODERATING</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience */}
            <FormField
              control={control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience / Bio (optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Mentoring experience, age groups, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expertise / Skills (optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Areas you teach or awards" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.length > 0 && (
              <div className="space-y-2">
                <FormLabel>Weekly Availability</FormLabel>
                {fields.map((f, idx) => (
                  <div key={f.id} className="flex flex-wrap items-center gap-2">
                    <FormField
                      control={control}
                      name={`availability.${idx}.day_of_week`}
                      render={({ field }) => (
                        <Select
                          value={String(field.value)}
                          onValueChange={(v) => field.onChange(Number(v))}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                              <SelectItem key={i} value={String(i)}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`availability.${idx}.start_time`}
                      render={({ field }) => <Input type="time" {...field} className="w-28" />}
                    />
                    <FormField
                      control={control}
                      name={`availability.${idx}.end_time`}
                      render={({ field }) => <Input type="time" {...field} className="w-28" />}
                    />
                    <FormField
                      control={control}
                      name={`availability.${idx}.format_note`}
                      render={({ field }) => (
                        <Input placeholder="Note" {...field} className="flex-1" />
                      )}
                    />
                    <Button variant="destructive" type="button" onClick={() => remove(idx)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    append({ day_of_week: 1, start_time: '', end_time: '', format_note: '' })
                  }
                >
                  + Add Slot
                </Button>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
            {message && <p className="mt-2 text-center text-sm text-muted-foreground">{message}</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
