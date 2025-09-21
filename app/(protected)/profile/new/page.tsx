'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

export default function ProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      availability: [{ day_of_week: 1, start_time: '', end_time: '' }],
    },
  });
  const { control, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'availability' });


  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        setLoading(false);
        return;
      }
      const userId = auth.user.id;

      const [{ data: profile }, { data: avail }] = await Promise.all([
        supabase.from('users').select('*').eq('userid', userId).single(),
        supabase.from('user_availability').select('*').eq('user_id', userId),
      ]);

      if (profile) {
        reset({
          name: profile.name ?? '',
          username: profile.username ?? '',
          timezone: profile.timezone ?? '',
          github_id: profile.github_id ?? '',
          status: profile.status ?? 'LEARNING',
          experience: profile.experience ?? '',
          expertise: profile.expertise ?? '',
          availability:
            avail?.map((a) => ({
              day_of_week: a.day_of_week,
              start_time: a.start_time.slice(0, 5), // HH:MM
              end_time: a.end_time.slice(0, 5),
              format_note: a.format_note ?? '',
            })) ?? [],
        });
      }
      setLoading(false);
    })();
  }, [reset, supabase]);

  const onSubmit = async (values: ProfileInput) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      setMessage('✅ Profile updated!');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading profile…</p>;

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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input placeholder="America/New_York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="github_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['TEACHING', 'PAUSED', 'LEARNING', 'MODERATING'].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience / Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
                  <FormLabel>Expertise / Skills</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

        
            <div className="space-y-2">
              <FormLabel className="font-bold">Weekly Availability</FormLabel>
              {fields.map((f, idx) => (
                <div key={f.id} className="flex flex-wrap items-center gap-2">
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
                    render={({ field }) => <Input type="time" className="w-28" {...field} />}
                  />
                  <FormField
                    control={control}
                    name={`availability.${idx}.end_time`}
                    render={({ field }) => <Input type="time" className="w-28" {...field} />}
                  />
                  <FormField
                    control={control}
                    name={`availability.${idx}.format_note`}
                    render={({ field }) => (
                      <Input placeholder="Note" className="flex-1" {...field} />
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

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Saving…' : 'Save Profile'}
            </Button>
            {message && <p className="mt-2 text-center text-sm text-muted-foreground">{message}</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
