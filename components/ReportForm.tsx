'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import error from 'next/error';

const ListingSchema = z.object({
  listing_id: z.string(),
  mentor_user_id: z.string(),
  status: z.enum(['OPEN', 'CLOSED']).default('OPEN'),
  name: z.string(),
  description: z.string(),
  format_notes: z.string().optional(),
  creation_date: z.date(),
  end_date: z.date().optional(),
  primary_skill_id: z.string().optional(),
});

const ReportSchema = z.object({
  report_reason_class: z.string(),
  report_reason_text: z.string(),
});

type ReportInput = z.infer<typeof ReportSchema>;

type ListingType = z.infer<typeof ListingSchema>;

export default function ReportForm({ listingId }: { listingId: string }) {
  const supabase = createClientComponentClient();
  const [listingData, setListingData] = useState<ListingType | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<ReportInput>({
    resolver: zodResolver(ReportSchema),
    defaultValues: {
      report_reason_class: '',
      report_reason_text: '',
    },
  });

  const { control, handleSubmit, reset } = form;

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => {
//     //   if (user) setCurrentUserId(user.id);
//     });
//   }, [supabase]);

  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from('mentorship_listing')
        .select('*')
        .eq('listing_id', listingId)
        .single();

      if (!error && data) {
        setListingData(data);
        reset(data);
      }
    };
    fetchListing();
  }, [listingId, supabase, reset]);

  const onSubmit = async (values: ReportInput) => {
    setLoading(true);
    setMessage(null);

    try {
      await fetch('/api/listings/report', {
        method: 'POST',
        body: JSON.stringify({
          thread_type: 'listing',
          listing_id: listingId,
          report_reason_class: values.report_reason_class,
          report_reason_text: values.report_reason_text,
        }),
      });
      if (error) throw error;
      setMessage('✅ Profile saved!');
      //   reset(values);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto mt-6 max-w-3xl">
      <CardContent className="pt-5">
        {listingData && <p className="mb-4">Report for listing: {listingData.name}</p>}

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="report_reason_class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Issue</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Type of Issue" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="report_reason_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>More Details</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Please provide more details, and how this infringes on users' safety."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Report'}
            </Button>
            {message && <p className="mt-2 text-center text-sm text-muted-foreground">{message}</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
