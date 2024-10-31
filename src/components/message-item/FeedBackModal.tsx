import { useForm } from 'react-hook-form';

import { useCallback } from 'react';
import { IModalProps } from '~/types/common';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Textarea,
} from '../ui';

export interface IFeedbackRequestBody {
  messageId?: string;
  thumbup?: boolean;
  feedback?: string;
}

const FeedbackModal = ({
  visible,
  hideModal,
  onOk,
}: IModalProps<IFeedbackRequestBody>) => {
  const form = useForm();

  const handleOk = useCallback(async () => {
    await form.trigger();
    const value = form.getValues();

    return onOk?.({ thumbup: false, feedback: value.feedback });
  }, [onOk, form]);

  return (
    <Dialog open={visible} onOpenChange={hideModal}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOk)} className='space-y-8'>
            <FormField
              control={form.control}
              name='feedback'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={8}
                      placeholder='Please input your feedback!'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button onClick={hideModal}>Cancel</Button>
              <Button type='submit'>OK</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
