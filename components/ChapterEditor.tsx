'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Chapter } from '@/lib/types';
import { formatTimestamp } from '@/lib/youtube';
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { useChapterEditor } from './hooks/use-chapter-editor';

interface Props {
	chapters: Chapter[];
	onChange: (chapters: Chapter[]) => void;
}

export default function ChapterEditor({ chapters, onChange }: Props) {
	const {
		editingId,
		title,
		setTitle,
		start,
		setStart,
		formError,
		startEdit,
		cancelEdit,
		saveEdit,
		remove,
		move,
	} = useChapterEditor(chapters, onChange);

	return (
		<div className="space-y-2">
			{chapters.map((c, i) => (
				<div key={c.id} className="rounded-lg border p-2.5 text-sm">
					{editingId === c.id ? (
						<div className="space-y-2">
							<Input value={title} onChange={(e) => setTitle(e.target.value)} />
							{formError && (
								<Alert variant="destructive" className="py-2">
									<AlertDescription>{formError}</AlertDescription>
								</Alert>
							)}
							<div className="flex gap-2">
								<Input
									value={start}
									onChange={(e) => setStart(e.target.value)}
									placeholder="MM:SS"
									className="w-28 font-mono"
								/>
								<Button size="sm" onClick={saveEdit}>
									Save
								</Button>
								<Button variant="ghost" size="sm" onClick={cancelEdit}>
									Cancel
								</Button>
							</div>
						</div>
					) : (
						<div className="flex items-center justify-between gap-2">
							<span className="min-w-0 truncate">
								<span className="mr-2 font-mono text-xs text-muted-foreground">
									{i + 1}. {formatTimestamp(c.startSeconds)}
								</span>
								{c.title}
							</span>
							<span className="flex shrink-0 gap-1">
								<Button
									variant="ghost"
									size="icon-xs"
									onClick={() => move(c.id, -1)}
									aria-label="Move up"
								>
									<ChevronUp />
								</Button>
								<Button
									variant="ghost"
									size="icon-xs"
									onClick={() => move(c.id, 1)}
									aria-label="Move down"
								>
									<ChevronDown />
								</Button>
								<Button variant="ghost" size="xs" onClick={() => startEdit(c)}>
									<Pencil /> Edit
								</Button>
								<AlertDialog>
									<AlertDialogTrigger
										render={
											<Button
												variant="destructive"
												size="xs"
												className="text-red-500 hover:text-destructive"
											/>
										}
									>
										<Trash2 /> Del
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Delete this chapter?</AlertDialogTitle>
											<AlertDialogDescription>
												“{c.title}” will be permanently removed from this course. This
												can&apos;t be undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => remove(c.id)}
												className="bg-destructive text-white hover:bg-destructive/90"
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</span>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
