import { ArrowDownRight } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section>
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline">
              Beta
              <ArrowDownRight className="ml-2 size-4" />
            </Badge>
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              Micromentoring for the Masses{' '}
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              Connect with verified mentors, access exclusive resources, and take your skills to the next level.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button className="w-full sm:w-auto">Find Your Mentor</Button>
              <Button variant="outline" className="w-full sm:w-auto">
                Share Your Expertise
                <ArrowDownRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
          <Image
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjY1ODQgNDBIMTUuMzgxN0MxMi4wNjUzIDQwIDEwLjA3IDM5Ljk5OTQgOC41NDgxIDM5LjcxNTlMMTcuMzY2OCAyOC4wMzQ0TDE2LjY1ODQgNDBaIiBmaWxsPSIjRkYxNjE2Ij48L3BhdGg+CjxwYXRoIGQ9Ik0zMS4yNDgyIDM5Ljc1MTRDMjkuNzUwMiAzOS45OTg4IDI3Ljc4NzUgNDAgMjQuNjE4MyA0MEgyMy4xMDlMMjIuMzk3IDI4LjAzMDlMMzEuMjQ4MiAzOS43NTE0WiIgZmlsbD0iI0ZGMTYxNiI+PC9wYXRoPgo8cGF0aCBkPSJNMzkuNjcxNSAzMS42NzA4QzM5LjYwNzEgMzEuOTc3MyAzOS41MzEzIDMyLjI2NTUgMzkuNDM4OSAzMi41NDI2QzM4LjgzMzcgMzQuMzU2NyAzNy43NzEyIDM1Ljk1MjIgMzYuMzg2NyAzNy4xOTgyTDI2LjQ0IDI2LjA0NEwzOS42NzE1IDMxLjY3MDhaIiBmaWxsPSIjRkYxNjE2Ij48L3BhdGg+CjxwYXRoIGQ9Ik0zLjQ4NTQ0IDM3LjA3OTJDMi4xNjM5NyAzNS44NTExIDEuMTQ3MzkgMzQuMzAwIDAuNTYxMDggMzIuNTQyNkMwLjQ1OTU1MSAzMi4yMzgyIDAuMzc1MjUzIDMxLjkyMSAwLjMwNzE3MyAzMS41ODAzTDEzLjMyMzkgMjYuMDQ1OEwzLjQ4NTQ0IDM3LjA3OTJaIiBmaWxsPSIjRkYxNjE2Ij48L3BhdGg+CjxwYXRoIGQ9Ik00MCAyNC42MTgzQzQwIDI1Ljc0MjggMzkuOTk2OCAyNi43MTU0IDM5Ljk4NTggMjcuNTY5MkwyOC4xNzI5IDIzLjAwNkg0MFYyNC42MTgzWiIgZmlsbD0iI0ZGMTYxNiI+PC9wYXRoPgo8cGF0aCBkPSJNMTEuNTk2MiAyMy4wMDZMMC4wMTA2NTM0IDI3LjQ4MDVDMC4wMDA3MDYxMDYgMjYuNjQ4MSAwIDI1LjcwNCAwIDI0LjYxODNWMjMuMDA2SDExLjU5NjJaIiBmaWxsPSIjRkYxNjE2Ij48L3BhdGg+CjxwYXRoIGQ9Ik0yNC42MTgzIDBDMjguNzgwNyAwIDMwLjg2MiAwLjAwNTUzNjczIDMyLjU0MjYgMC41NjEwOEMzNS43OTc5IDEuNjQ3MTMgMzguMzUyOSA0LjIwMjA4IDM5LjQzODkgNy40NTc5M0MzOS45OTQ1IDkuMTM3OTMgNDAgMTEuMjE5MyA0MCAxNS4zODE3VjIwLjAxNkgyNy41MDg5TDM2LjUxODEgMTYuMTg2MUwzMy44NDU5IDE0LjQxMjNMMjUuMTA0OCAxNy43ODc2TDI5LjIwODEgMTIuMzU4TDI2LjI1NzEgMTEuNTUwMUwyMS43MjU5IDE2LjYyODJMMjEuMzg4NSAxMC45MDkxSDE4LjM4MjVMMTguMDM5OCAxNi42MjgyTDEzLjUxMjEgMTEuNTUwMUwxMC41NjI5IDEyLjM1OEwxNC42NjA5IDE3Ljc4NTlMNS45MjUwNyAxNC40MTIzTDMuMjUyODQgMTYuMTg2MUwxMi4yNjAzIDIwLjAxNkgwVjE1LjM4MTdDMCwxMS4yMTkzIDAuMDA1NTM2NzMgOS4xMzc5MyAwLjU2MTA4IDcuNDU3OTNDMS42NDcxMyA0LjIwMjA4IDQuMjAyMDggMS42NDcxMyA3LjQ1NzkzIDAuNTYxMDhDOS4xMzc5MyAwLjAwNTUzNjczIDExLjIxOTMgMCAxNS4zODE3IDBIMjQuNjE4M1oiIGZpbGw9IiNGRjE2MTYiPjwvcGF0aD4KPC9zdmc+"
            alt="placeholder hero"
            width={500}
            height={500}
            className="max-h-96 w-full rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  );
}
