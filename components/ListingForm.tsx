'use client';

import { useForm } from 'react-hook-form';
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

const ListingSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'PAUSED', 'FULL', 'CLOSED']).default('OPEN'),
  end_date: z.string().optional(),
  primary_skill_id: z.string(),
  format_notes: z.string().optional(),
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
    defaultValues: defaultValues || {},
  });
  const { control, handleSubmit } = form;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
              name="format_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format Notes</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <div className="flex flex-row items-center gap-2">
                    <FormLabel>Primary Skill</FormLabel>
                    <FormControl>
                      <SkillSelector value={field.value} onChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
