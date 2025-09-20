
'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Combobox } from '@/components/ui/combobox'; // shadcn/ui Combobox

const AvailabilitySchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  format_note: z.string().optional(),
});

const ListingSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  status: z.enum(['OPEN','PAUSED','FULL','CLOSED']).default('OPEN'),
  end_date: z.string().optional(),
  primary_skill_id: z.string(),
  availability: z.array(AvailabilitySchema).min(1),
});

type ListingInput = z.infer<typeof ListingSchema>;

export default function ListingForm({ initialData }: { initialData?: Partial<ListingInput> }) {
  const form = useForm<ListingInput>({
    resolver: zodResolver(ListingSchema),
    defaultValues: initialData || { availability: [{ day_of_week: 1, start_time: '', end_time: '' }] },
  });
  const { control, handleSubmit, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'availability' });

  const [skills, setSkills] = useState<{ skill_id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => setSkills(data.skills || []))
      .catch(console.error);
  }, []);

  const onSubmit = async (values: ListingInput) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create listing');
      setMessage('✅ Listing created!');
      form.reset(values);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
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
                  <FormControl><Input {...field} /></FormControl>
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
                    <Combobox
                      options={[
                        { value: 'OPEN', label: 'OPEN' },
                        { value: 'PAUSED', label: 'PAUSED' },
                        { value: 'FULL', label: 'FULL' },
                        { value: 'CLOSED', label: 'CLOSED' },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
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
                    <Combobox
                      options={skills.map(s => ({ value: s.skill_id, label: s.name }))}
                      value={field.value}
                      onValueChange={field.onChange}
                      allowCustomValue
                      placeholder="Type or select a skill"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Availability</FormLabel>
              {fields.map((f, idx) => (
                <div key={f.id} className="flex gap-2 mb-2">
                  <FormField
                    control={control}
                    name={`availability.${idx}.day_of_week`}
                    render={({ field }) => (
                      <Combobox
                        options={['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i) => ({ value: String(i), label: d }))}
                        value={String(field.value)}
                        onValueChange={(v) => field.onChange(Number(v))}
                      />
                    )}
                  />
                  <FormField control={control} name={`availability.${idx}.start_time`} render={({ field }) => (
                    <Input {...field} type="time" className="w-24" />
                  )} />
                  <FormField control={control} name={`availability.${idx}.end_time`} render={({ field }) => (
                    <Input {...field} type="time" className="w-24" />
                  )} />
                  <Button type="button" onClick={() => remove(idx)}>Remove</Button>
                </div>
              ))}
              <Button type="button" onClick={() => append({ day_of_week: 1, start_time: '', end_time: '' })}>Add Day</Button>
            </div>

            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Listing'}</Button>
            {message && <p>{message}</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

