"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"

import { Button } from "@/components/ui/button"
import { CredentialsType } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  login: z.string().nonempty({
    message: "Qalam username is required"
  }),
  password: z.string().nonempty({
    message: "Qalam password is required"
  }),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
})

type FormType = z.infer<typeof formSchema>

type LoginFormProps = {
  setAuthenticated: (b: boolean) => void
}

export const LoginForm = ({setAuthenticated}: LoginFormProps) => {

  const [termsOpen, setTermsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
      terms: false,
    }
  })

  const onSubmit = async (values: FormType) => {
    if (loading) return;
    setLoading(true)
    const credentials: CredentialsType = {
      ...values
    }

    const { verified, cookies } = await (await fetch("/api/login", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({credentials})
    })).json()

    if (verified) {
      localStorage.setItem("login", credentials.login);
      localStorage.setItem("password", credentials.password);
      localStorage.setItem("cookies", cookies)
      setAuthenticated(true)
    } else {
      form.setError("login", {
        type: "manual",
        message: "Invalid login or password. Please try again.",
      });
      form.setError("password", {
        type: "manual",
        message: "Invalid login or password. Please try again.",
      });
    }
    setLoading(false)
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <Form {...form}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Qalam Login</CardTitle>
            <CardDescription>Enter your Qalam Credentials so we can scrape it</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Qalam Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          type="checkbox"
                          className="h-fit w-min"
                          checked={field.value}
                          onChange={field.onChange}
                          />
                      </FormControl>
                      <Label>I agree to the 
                        <HoverCard open={termsOpen} onOpenChange={setTermsOpen}>
                          <HoverCardTrigger onClick={() => setTermsOpen(!termsOpen)} className="underline">
                            terms and conditions
                          </HoverCardTrigger>
                          <HoverCardContent side="top" className="max-w-sm text-sm flex flex-col gap-2">
                            <h4 className="font-semibold">Terms and Conditions</h4>
                            <p>
                              By agreeing, you acknowledge and accept that your login credentials are stored locally
                              in your browser and transmitted over the internet in raw form when you request to scrape your Qalam data.
                            </p>
                            <p>
                              The developer assumes no responsibility or liability for any security breaches, misuse,
                              or unauthorized access to your credentials as a result of using this tool.
                            </p>
                          </HoverCardContent>
                        </HoverCard>
                      </Label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={loading} className="w-full" type="submit">Submit</Button>
            </form>
          </CardContent>
        </Card>
      </Form>
    </div>
  )
}