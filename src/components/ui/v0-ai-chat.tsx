"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { cn } from "@/lib/utils";
import {
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    Bug,
    HelpCircle,
    FileText,
    Layers,
    GitPullRequest,
    ChevronDown,
    GitBranch,
    Mic,
    Check,
    X,
} from "lucide-react";
import actionConfig from "@/json/action-config.json";
import sidebarData from "@/json/sidebar-data.json";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            // Temporarily shrink to get the right scrollHeight
            textarea.style.height = `${minHeight}px`;

            // Calculate new height
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        // Set initial height
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    // Adjust height on window resize
    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

export function VercelV0Chat() {
    const [value, setValue] = useState("");
    const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [showRepoDropdown, setShowRepoDropdown] = useState(false);
    const [showBranchDropdown, setShowBranchDropdown] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });

    // Mock branches for selected repository
    const mockBranches = [
        { name: "main", isDefault: true },
        { name: "develop", isDefault: false },
        { name: "feature/auth-system", isDefault: false },
        { name: "hotfix/bug-fix", isDefault: false },
    ];

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                setValue("");
                adjustHeight(true);
            }
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.dropdown-container')) {
                setShowRepoDropdown(false);
                setShowBranchDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMicClick = () => {
        setIsRecording(true);
    };

    const handleSaveRecording = () => {
        setIsRecording(false);
        setValue(prev => prev + " [Voice recording saved]");
        setTimeout(() => adjustHeight(), 0);
    };

    const handleCancelRecording = () => {
        setIsRecording(false);
    };

    const handleActionClick = (actionId: string) => {
        const action = actionConfig.actionButtons.find(btn => btn.id === actionId);
        if (action) {
            setValue(action.defaultPrompt);
            // Adjust height after setting the value
            setTimeout(() => adjustHeight(), 0);
        }
    };

    // Icon mapping for dynamic icon rendering
    const getIcon = (iconName: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            Bug: <Bug className="w-4 h-4" />,
            HelpCircle: <HelpCircle className="w-4 h-4" />,
            FileText: <FileText className="w-4 h-4" />,
            Layers: <Layers className="w-4 h-4" />,
            GitPullRequest: <GitPullRequest className="w-4 h-4" />,
        };
        return iconMap[iconName] || <HelpCircle className="w-4 h-4" />;
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-8">
            <h1 className="text-4xl font-bold text-black dark:text-white">
                What can I help you build today?
            </h1>

            <div className="w-full">
                {isRecording ? (
                    <div className="relative bg-neutral-900 rounded-xl border border-neutral-800 p-6">
                        <AIVoiceInput 
                            onStart={() => console.log('Recording started')}
                            onStop={(duration) => console.log('Recording stopped:', duration)}
                            visualizerBars={48}
                            className="py-0"
                        />
                        
                        {/* Recording Controls */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-dotted border-neutral-600">
                            {/* Left side - Paperclip icon */}
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                                >
                                    <Paperclip className="w-5 h-5 text-neutral-400 hover:text-white transition-colors" />
                                </button>
                            </div>
                            
                            {/* Right side - Cancel and Done buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancelRecording}
                                    className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    <span className="text-sm font-medium">Cancel</span>
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleSaveRecording}
                                    className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white transition-all duration-200"
                                >
                                    <Check className="w-4 h-4" />
                                    <span className="text-sm font-medium">Done</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative bg-neutral-900 rounded-xl border border-neutral-800">
                        <div className="overflow-y-auto">
                            <Textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    adjustHeight();
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask Async Coder anything about your code..."
                                className={cn(
                                    "w-full px-4 py-3",
                                    "resize-none",
                                    "bg-transparent",
                                    "border-none",
                                    "text-white text-sm",
                                    "focus:outline-none",
                                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                                    "placeholder:text-neutral-500 placeholder:text-sm",
                                    "min-h-[60px]"
                                )}
                                style={{
                                    overflow: "hidden",
                                }}
                            />
                        </div>

                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <Paperclip className="w-4 h-4 text-white" />
                                    <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">
                                        Attach
                                    </span>
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleMicClick}
                                    className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <Mic className="w-4 h-4 text-white" />
                                    <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">
                                        Voice
                                    </span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Repository Selector */}
                                <div className="relative dropdown-container">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowRepoDropdown(!showRepoDropdown);
                                            setShowBranchDropdown(false);
                                        }}
                                        className="px-2 py-1 rounded-lg text-sm text-zinc-400 transition-colors border border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        {selectedRepo ? sidebarData.codebases.find(r => r.id === selectedRepo)?.name : "Repo"}
                                        <ChevronDown className="w-3 h-3" />
                                    </button>
                                    
                                    {showRepoDropdown && (
                                        <div className="absolute bottom-full left-0 mb-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto scrollbar-hide">
                                            {sidebarData.codebases.map((repo) => (
                                                <button
                                                    key={repo.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedRepo(repo.id);
                                                        setSelectedBranch(null);
                                                        setShowRepoDropdown(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-neutral-700 transition-colors flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                                                >
                                                    <span className="text-xs text-zinc-500 flex-shrink-0">{repo.owner}/</span>
                                                    <span className="truncate">{repo.name}</span>
                                                    {repo.isPrivate && <span className="text-xs text-zinc-500 flex-shrink-0">(private)</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Branch Selector - Only show if repo is selected */}
                                {selectedRepo && (
                                    <div className="relative dropdown-container">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowBranchDropdown(!showBranchDropdown);
                                                setShowRepoDropdown(false);
                                            }}
                                            className="px-2 py-1 rounded-lg text-sm text-zinc-400 transition-colors border border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1"
                                        >
                                            <GitBranch className="w-4 h-4" />
                                            {selectedBranch || "main"}
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                        
                                        {showBranchDropdown && (
                                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 scrollbar-hide">
                                                {mockBranches.map((branch) => (
                                                    <button
                                                        key={branch.name}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedBranch(branch.name);
                                                            setShowBranchDropdown(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-neutral-700 transition-colors flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                                                    >
                                                        <GitBranch className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">{branch.name}</span>
                                                        {branch.isDefault && <span className="text-xs text-zinc-500 flex-shrink-0">(default)</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <button
                                    type="button"
                                    className={cn(
                                        "px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1",
                                        value.trim()
                                            ? "bg-white text-black"
                                            : "text-zinc-400"
                                    )}
                                >
                                    <ArrowUpIcon
                                        className={cn(
                                            "w-4 h-4",
                                            value.trim()
                                                ? "text-black"
                                                : "text-zinc-400"
                                        )}
                                    />
                                    <span className="sr-only">Send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
                    {actionConfig.actionButtons.map((action) => (
                        <ActionButton
                            key={action.id}
                            icon={getIcon(action.icon)}
                            label={action.label}
                            onClick={() => handleActionClick(action.id)}
                            description={action.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    description?: string;
}

function ActionButton({ icon, label, onClick, description }: ActionButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={description}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-colors group relative"
        >
            {icon}
            <span className="text-xs">{label}</span>
            {description && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                </div>
            )}
        </button>
    );
}