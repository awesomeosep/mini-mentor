'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Card, CardContent } from '@/components/ui/card';

import { createClient } from '@/lib/supabase/client';

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

export default function ProfileSettingField() {
  const supabase = createClient();
  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      availability: [{ day_of_week: 1, start_time: '', end_time: '' }],
    },
  });
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      console.log('user data', data);
      if (data && data.user) {
        const { data: profileRes, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('userid', data?.user?.id)
          .limit(1)
          .single();
        console.log('profile stuff#', data, profileRes, profileError);
        // if (profileRes && !profileError) {
        //   if (profileRes.status == 'LEARNING') {
        //     return redirect('/listings');
        //   } else {
        //     return redirect('/listings/new');
        //   }
        // }
        const { data: myAvailability } = await supabase
          .from('user_availability')
          .select('*')
          .eq('user_id', data?.user?.id);

        form.setValue('name', profileRes?.name || '');
        form.setValue('username', profileRes?.username || '');
        form.setValue('timezone', profileRes?.timezone || '');
        form.setValue('experience', profileRes?.experience || '');
        form.setValue('status', profileRes?.status || 'LEARNING');
        form.setValue('availability', myAvailability || []);
      }
    });
  }, []);

  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'availability' });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (values: ProfileInput) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      setMessage('✅ Profile saved!');
      form.reset(values);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Timezone */}
            <FormField
              control={control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input placeholder="America/New_York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Github */}
            {/* <FormField
              control={control}
              name="github_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github ID (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="github_username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Status */}
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEACHING">TEACHING</SelectItem>
                        <SelectItem value="LEARNING">LEARNING</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mentor experience */}
            {/* <FormField
              control={control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience / Bio (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mentoring experience, age groups, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Mentor expertise */}
            {/* <FormField
              control={control}
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expertise / Skills (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Areas you teach or awards" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Availability for mentors */}
            {fields.length > 0 && (
              <div className="space-y-2">
                <FormLabel className="font-bold">Weekly Availability</FormLabel>
                {fields.map((fieldItem, idx) => (
                  <div key={fieldItem.id} className="flex flex-wrap items-center gap-2">
                    <FormField
                      control={control}
                      name={`availability.${idx}.day_of_week`}
                      render={({ field }) => (
                        <Select
                          defaultValue={String(field.value)}
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

                    <Button type="button" variant="destructive" onClick={() => remove(idx)}>
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

            <Button disabled={loading} type="submit" className="w-full">
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>

            {message && <p className="mt-2 text-center text-sm text-muted-foreground">{message}</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
