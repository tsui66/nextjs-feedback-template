"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"
import { cn, wait } from "@/lib/utils"
import { SystemStatusButton } from "./system-status-button"
import { submitFeedback } from "./feedback/action"
import { ReactNode, useState } from "react"
import { toast } from "./ui/use-toast"
import { useToast } from "@/components/ui/use-toast"


const ChatFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),

  feedback: z
    .string()
    .min(10, {
      message: "Please enter a message.",
    })
})

export function ContactWindow({
  children,
  Component,
}: {
  children?: never[];
  Component?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof ChatFormSchema>>({
    resolver: zodResolver(ChatFormSchema),
  })

  async function onSubmit(data: FormData) {
    try {
      await submitFeedback(data)
      toast({
        title: "🎉 Your feedback has been sent!",
        description: "Friday, February 10, 2023 at 5:57 PM",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Your feedback has failed to send.",
        description: "Friday, February 10, 2023 at 5:57 PM",
      })
    } finally {
      wait().then(() => setOpen(false))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {Component ? (Component) : (<Button variant="outline">Contact us</Button>)}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-4 text-base font-bold text-neutral-100">
            <span className="flex-grow">Contact us</span>
            <div className="flex-none">
              <SystemStatusButton status={'operational'} />
            </div></DialogTitle>
          <DialogDescription>
            Share feedback, request a feature, report a bug, or contact us.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form action={onSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                // @ts-ignore
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2 w-2/3">
                      <p className="mb-1 text-xs font-medium text-neutral-300">
                        What is your email?
                      </p>
                      <FormControl>
                        {/* TODO get email from user session if exists */}
                        <Input className="w-full-1/2" id="email" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feedback"
                // @ts-ignore
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <p
                        className={cn('mb-1 text-xs font-medium text-neutral-300')}
                      >
                        How can we help?
                      </p>
                      <FormControl >
                        <Textarea
                          className="flex min-h-[180px] resize-none"
                          {...field}
                          id="feedback"
                          placeholder="Please include all information relevant to your issue."
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogPrimitive.Close asChild>
                  <Button>Cancel</Button>
                </DialogPrimitive.Close>
                <Button type="submit">Send</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <></>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
