"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

export type Stack = {
	id: string;
	name: string;
	icon: string;
	discordUrl: string | null;
};

export function DiscordList({ initialStacks }: { initialStacks: Stack[] }) {
	const [stacks, setStacks] = useState(initialStacks);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const handleUpdate = async (id: string, discordUrl: string) => {
		try {
			const res = await fetch(`/api/admin/stacks/${id}/discord`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ discordUrl }),
			});

			if (!res.ok) throw new Error("Failed to update Discord URL");

			setStacks(
				stacks.map((stack) =>
					stack.id === id ? { ...stack, discordUrl } : stack
				)
			);

			toast({
				title: "Success",
				description: "Discord URL updated successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update Discord URL",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="space-y-6">
			{stacks.map((stack) => {
				const Icon = (Icons[stack.icon as keyof typeof Icons] ||
					Icons.Code) as LucideIcon;
				return (
					<Card key={stack.id}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Icon className="h-5 w-5" />
								{stack.name}
							</CardTitle>
							<CardDescription>
								Manage Discord server invite URL for {stack.name} stack
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									const form = e.target as HTMLFormElement;
									const input = form.elements.namedItem(
										"discordUrl"
									) as HTMLInputElement;
									handleUpdate(stack.id, input.value);
								}}
								className="flex gap-2"
							>
								<Input
									name="discordUrl"
									placeholder="Enter Discord invite URL"
									defaultValue={stack.discordUrl || ""}
									className="flex-1"
								/>
								<Button type="submit" disabled={loading}>
									Save
								</Button>
							</form>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
