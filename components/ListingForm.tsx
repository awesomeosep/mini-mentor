'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { SkillSelector } from '@/components/SkillSelector';

const AvailabilitySchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  format_note: z.string().optional(),
});

const ListingSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'PAUSED', 'FULL', 'CLOSED']).default('OPEN'),
  end_date: z.string().optional(),
  primary_skill_id: z.string(),
  availability: z.array(AvailabilitySchema).min(1),
});

export type ListingInput = z.infer<typeof ListingSchema>;

export default function ListingForm({
  defaultValues,
  isEdit = false,
  listingId,
}: {
  defaultValues?: Partial<ListingInput>;
  isEdit?: boolean;
  listingId?: string;
}) {
  const form = useForm<ListingInput>({
    resolver: zodResolver(ListingSchema),
    defaultValues: defaultValues || {
      availability: [{ day_of_week: 1, start_time: '', end_time: '' }],
    },
  });
  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'availability',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const dayOptions = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const onSubmit = async (values: ListingInput) => {
    setLoading(true);
    setMessage(null);
    try {
      const endpoint = isEdit ? `/api/listings/${listingId}` : '/api/listings';

      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setMessage(isEdit ? '✅ Listing updated!' : '✅ Listing created!');
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
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
                    <select className="w-full rounded border bg-background p-2" {...field}>
                      <option value="OPEN">OPEN</option>
                      <option value="PAUSED">PAUSED</option>
                      <option value="FULL">FULL</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="primary_skill_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Skill</FormLabel>
                  <FormControl>
                    <SkillSelector value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Availability</FormLabel>
              {fields.map((f, idx) => (
                <div key={f.id} className="mb-2 flex items-center gap-2">
                  <FormField
                    control={control}
                    name={`availability.${idx}.day_of_week`}
                    render={({ field }) => (
                      <select
                        className="rounded border bg-background p-2"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      >
                        {dayOptions.map((day, i) => (
                          <option key={i} value={i}>
                            {day}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`availability.${idx}.start_time`}
                    render={({ field }) => <Input {...field} type="time" className="w-24" />}
                  />
                  <FormField
                    control={control}
                    name={`availability.${idx}.end_time`}
                    render={({ field }) => <Input {...field} type="time" className="w-24" />}
                  />
                  <Button type="button" variant="secondary" onClick={() => remove(idx)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ day_of_week: 1, start_time: '', end_time: '' })}
              >
                Add Day
              </Button>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Update Listing' : 'Create Listing'}
            </Button>
            {message && <p className="mt-2 text-sm">{message}</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
