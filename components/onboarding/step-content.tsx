import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { StepIcon } from "./step-icon";
import { ExternalLink, Copy, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Stack = {
    id: string;
    name: string;
    icon: string;
    discordUrl: string | null;
};

type StepContentProps = {
    step: number;
    title: string;
    description: string;
    isCompleted: boolean;
    isActive: boolean;
    onComplete: () => void;
    stacks?: Stack[];
    selectedStack?: Stack | null;
    onStackSelect?: (stack: Stack) => void;
    githubUsername?: string;
    onGithubSubmit?: (username: string) => void;
    discordUrl?: string;
    licenseKey?: string;
};

export function StepContent({
    step,
    title,
    description,
    isCompleted,
    isActive,
    onComplete,
    stacks = [],
    selectedStack,
    onStackSelect,
    githubUsername = "",
    onGithubSubmit,
    discordUrl,
    licenseKey,
}: StepContentProps) {
    const [username, setUsername] = useState(githubUsername);
    const { toast } = useToast();

    const handleGithubSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onGithubSubmit) {
            onGithubSubmit(username);
        }
    };

    return (
        <div className={`space-y-4 ${!isActive && "opacity-50"}`}>
            <div className="flex items-center gap-4">
                <StepIcon step={step} isCompleted={isCompleted} isActive={isActive} />
                <div>
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-gray-600">{description}</p>
                </div>
            </div>

            {isActive && (
                <div className="pl-14">
                    {step === 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {stacks.map((stack) => (
                                <Button
                                    key={stack.id}
                                    variant={
                                        selectedStack?.id === stack.id ? "default" : "outline"
                                    }
                                    className="h-auto py-4 px-6 justify-start"
                                    onClick={() => onStackSelect?.(stack)}
                                >
                                    <i className={`${stack.icon} text-2xl mr-2`} />
                                    {stack.name}
                                </Button>
                            ))}
                            {selectedStack && (
                                <Button className="col-span-full mt-4" onClick={onComplete}>
                                    Confirm Selection
                                </Button>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleGithubSubmit} className="space-y-4">
                            <Input
                                placeholder="Enter your GitHub username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <Button type="submit">Join Organization</Button>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <Alert>
                                <AlertDescription className="text-amber-600">
                                    Please accept the GitHub organization invitation from your email before proceeding.
                                    Once accepted, click the button below to continue.
                                </AlertDescription>
                            </Alert>
                            <Button 
                                onClick={onComplete}
                                className="flex items-center gap-2"
                            >
                                Add me to the team
                            </Button>
                        </div>
                    )}

                    {step === 4 && discordUrl && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Click below to join the Discord server for your selected tech
                                stack:
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    onClick={() =>
                                        window.open(discordUrl, "_blank", "noopener,noreferrer")
                                    }
                                    className="flex items-center gap-2"
                                >
                                    Join Discord Server
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={onComplete}
                                    className="flex items-center gap-2"
                                >
                                    Continue
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 5 && licenseKey && (
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-100 rounded-md">
                                <div className="flex justify-between items-center">
                                    <code className="font-mono text-sm">{licenseKey}</code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            navigator.clipboard.writeText(licenseKey);
                                            toast({
                                                title: "Copied!",
                                                description:
                                                    "JetBrains coupon code copied to clipboard",
                                            });
                                        }}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    onClick={() =>
                                        window.open(
                                            "https://resources.jetbrains.com/storage/products/jetbrains/docs/jetbrains_coupon_guide.pdf",
                                            "_blank"
                                        )
                                    }
                                    className="flex items-center gap-2"
                                >
                                    View Redemption Guide
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={onComplete}
                                    className="flex items-center gap-2"
                                >
                                    Continue
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 6 && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Please read our documentation to get started:
                            </p>
                            <a
                                href="https://github.com/Learnathon-By-Geeky-Solutions/.github/wiki"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={onComplete}
                            >
                                <Button className="flex items-center gap-2">
                                    Read Documentation
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}